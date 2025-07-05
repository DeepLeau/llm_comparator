import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { supabaseAdmin } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    console.log("=== STRIPE WEBHOOK ===")

    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("✅ Webhook event received:", event.type)

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log("🎉 Processing checkout completion:", session.id)

    const userId = session.metadata?.user_id
    const planType = session.metadata?.plan_type
    const billingPeriod = session.metadata?.billing_period

    if (!planType) {
      console.error("❌ Missing plan_type in session metadata")
      return
    }

    // Calculer les crédits selon le plan
    const credits = planType === "pro" ? 1000 : planType === "business" ? 5000 : 50

    if (userId) {
      // CAS 1: UTILISATEUR AUTHENTIFIÉ
      console.log("✅ Processing for authenticated user:", userId)

      // Mettre à jour le plan de l'utilisateur
      const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({
          plan: planType,
          credits: credits,
        })
        .eq("id", userId)

      if (updateError) {
        console.error("❌ Error updating user plan:", updateError)
      } else {
        console.log("✅ User plan updated successfully")
      }

      // Sauvegarder ou mettre à jour la relation customer
      if (session.customer) {
        const { error: customerError } = await supabaseAdmin.from("stripe_customers").upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
        })

        if (customerError) {
          console.error("❌ Error saving customer relation:", customerError)
        } else {
          console.log("✅ Customer relation saved")
        }
      }

      // Sauvegarder l'abonnement si présent
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

        const { error: subscriptionError } = await supabaseAdmin.from("subscriptions").upsert({
          user_id: userId,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: session.customer as string,
          status: subscription.status,
          price_id: subscription.items.data[0]?.price.id,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        })

        if (subscriptionError) {
          console.error("❌ Error saving subscription:", subscriptionError)
        } else {
          console.log("✅ Subscription saved successfully")
        }
      }
    } else {
      // CAS 2: PROSPECT NON AUTHENTIFIÉ
      console.log("🔓 Processing for guest user")

      const customerEmail = session.customer_details?.email || session.customer_email

      const { error: pendingError } = await supabaseAdmin.from("pending_subscriptions").insert({
        stripe_customer_id: session.customer as string,
        email: customerEmail,
        plan: planType,
        session_id: session.id,
      })

      if (pendingError) {
        console.error("❌ Error saving pending subscription:", pendingError)
      } else {
        console.log("✅ Pending subscription saved for guest")
      }
    }
  } catch (error) {
    console.error("❌ Error in handleCheckoutCompleted:", error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log("🔄 Processing subscription update:", subscription.id)

    const { error } = await supabaseAdmin
      .from("subscriptions")
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      })
      .eq("stripe_subscription_id", subscription.id)

    if (error) {
      console.error("❌ Error updating subscription:", error)
    } else {
      console.log("✅ Subscription updated successfully")
    }
  } catch (error) {
    console.error("❌ Error in handleSubscriptionUpdated:", error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log("❌ Processing subscription cancellation:", subscription.id)

    // Mettre à jour le statut de l'abonnement
    const { error: subscriptionError } = await supabaseAdmin
      .from("subscriptions")
      .update({
        status: "cancelled",
      })
      .eq("stripe_subscription_id", subscription.id)

    if (subscriptionError) {
      console.error("❌ Error updating cancelled subscription:", subscriptionError)
    }

    // Remettre l'utilisateur au plan gratuit
    const { data: subscriptionData } = await supabaseAdmin
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", subscription.id)
      .single()

    if (subscriptionData?.user_id) {
      const { error: userError } = await supabaseAdmin
        .from("users")
        .update({
          plan: "free",
          credits: 50,
        })
        .eq("id", subscriptionData.user_id)

      if (userError) {
        console.error("❌ Error downgrading user to free plan:", userError)
      } else {
        console.log("✅ User downgraded to free plan")
      }
    }
  } catch (error) {
    console.error("❌ Error in handleSubscriptionDeleted:", error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log("💰 Processing successful payment:", invoice.id)

    if (invoice.customer && invoice.subscription) {
      // Enregistrer le paiement
      const { error } = await supabaseAdmin.from("payments").insert({
        stripe_payment_intent_id: invoice.payment_intent as string,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: "succeeded",
        description: invoice.description || `Payment for ${invoice.lines.data[0]?.description}`,
      })

      if (error) {
        console.error("❌ Error saving payment record:", error)
      } else {
        console.log("✅ Payment record saved")
      }
    }
  } catch (error) {
    console.error("❌ Error in handlePaymentSucceeded:", error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    console.log("💸 Processing failed payment:", invoice.id)

    // Enregistrer le paiement échoué
    const { error } = await supabaseAdmin.from("payments").insert({
      stripe_payment_intent_id: invoice.payment_intent as string,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: "failed",
      description: `Failed payment for ${invoice.lines.data[0]?.description}`,
    })

    if (error) {
      console.error("❌ Error saving failed payment record:", error)
    } else {
      console.log("✅ Failed payment record saved")
    }
  } catch (error) {
    console.error("❌ Error in handlePaymentFailed:", error)
  }
}
