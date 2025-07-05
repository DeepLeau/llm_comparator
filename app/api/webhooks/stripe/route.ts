import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Client admin pour les webhooks (server-side only)
const supabaseAdmin = createClient("https://jbgvpcimlmrkzjqyjucc.supabase.co", process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("🔔 Webhook event received:", event.type, "ID:", event.id)

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
        console.log(`⚠️ Unhandled event type: ${event.type}`)
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
    console.log("💳 Processing checkout completion:", session.id)
    console.log("Session data:", {
      customer: session.customer,
      subscription: session.subscription,
      metadata: session.metadata,
      customer_details: session.customer_details,
    })

    const userId = session.metadata?.user_id
    const planType = session.metadata?.plan_type || "pro"
    const billingPeriod = session.metadata?.billing_period || "monthly"

    if (userId) {
      // CAS 1: UTILISATEUR AUTHENTIFIÉ
      console.log("✅ Processing authenticated user checkout for user:", userId)

      // Mettre à jour le plan de l'utilisateur
      const credits = planType === "pro" ? 1000 : planType === "business" ? 5000 : 50
      console.log("Updating user plan to:", planType, "with credits:", credits)

      const { data: userUpdateData, error: userUpdateError } = await supabaseAdmin
        .from("users")
        .update({
          plan: planType,
          credits: credits,
        })
        .eq("id", userId)
        .select()

      if (userUpdateError) {
        console.error("❌ Error updating user plan:", userUpdateError)
      } else {
        console.log("✅ User plan updated successfully:", userUpdateData)
      }

      // Sauvegarder ou mettre à jour la relation customer
      if (session.customer) {
        console.log("Saving customer relation:", userId, "->", session.customer)

        const { data: customerData, error: customerError } = await supabaseAdmin
          .from("stripe_customers")
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
          })
          .select()

        if (customerError) {
          console.error("❌ Error saving customer relation:", customerError)
        } else {
          console.log("✅ Customer relation saved:", customerData)
        }
      }

      // Sauvegarder l'abonnement si présent
      if (session.subscription) {
        console.log("Retrieving subscription details:", session.subscription)

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        console.log("Subscription details:", {
          id: subscription.id,
          status: subscription.status,
          customer: subscription.customer,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
        })

        const { data: subscriptionData, error: subscriptionError } = await supabaseAdmin
          .from("subscriptions")
          .upsert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: session.customer as string,
            status: subscription.status,
            price_id: subscription.items.data[0]?.price.id,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .select()

        if (subscriptionError) {
          console.error("❌ Error saving subscription:", subscriptionError)
        } else {
          console.log("✅ Subscription saved successfully:", subscriptionData)
        }
      }
    } else {
      // CAS 2: PROSPECT NON AUTHENTIFIÉ
      console.log("🔓 Processing guest checkout - storing in pending_subscriptions")

      const customerDetails = session.customer_details
      console.log("Customer details:", customerDetails)

      const pendingData = {
        stripe_customer_id: session.customer as string,
        email: customerDetails?.email || "",
        name: customerDetails?.name || "",
        plan: planType,
        session_id: session.id,
      }

      console.log("Inserting pending subscription:", pendingData)

      const { data: pendingResult, error: pendingError } = await supabaseAdmin
        .from("pending_subscriptions")
        .insert(pendingData)
        .select()

      if (pendingError) {
        console.error("❌ Error saving pending subscription:", pendingError)
      } else {
        console.log("✅ Pending subscription saved:", pendingResult)
      }
    }
  } catch (error) {
    console.error("❌ Error in handleCheckoutCompleted:", error)
    throw error
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log("🔄 Processing subscription update:", subscription.id)

    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      })
      .eq("stripe_subscription_id", subscription.id)
      .select()

    if (error) {
      console.error("❌ Error updating subscription:", error)
    } else {
      console.log("✅ Subscription updated successfully:", data)
    }
  } catch (error) {
    console.error("❌ Error in handleSubscriptionUpdated:", error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log("❌ Processing subscription deletion:", subscription.id)

    // Mettre à jour le statut de l'abonnement
    const { data: subscriptionUpdateData, error: subscriptionError } = await supabaseAdmin
      .from("subscriptions")
      .update({
        status: "canceled",
      })
      .eq("stripe_subscription_id", subscription.id)
      .select()

    if (subscriptionError) {
      console.error("❌ Error updating subscription status:", subscriptionError)
    } else {
      console.log("✅ Subscription status updated:", subscriptionUpdateData)
    }

    // Remettre l'utilisateur au plan gratuit
    const { data: subscriptionData } = await supabaseAdmin
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", subscription.id)
      .single()

    if (subscriptionData?.user_id) {
      const { data: userUpdateData, error: userError } = await supabaseAdmin
        .from("users")
        .update({
          plan: "free",
          credits: 50,
        })
        .eq("id", subscriptionData.user_id)
        .select()

      if (userError) {
        console.error("❌ Error updating user to free plan:", userError)
      } else {
        console.log("✅ User downgraded to free plan:", userUpdateData)
      }
    }
  } catch (error) {
    console.error("❌ Error in handleSubscriptionDeleted:", error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log("💰 Processing successful payment:", invoice.id)

    const paymentData = {
      user_id: invoice.metadata?.user_id,
      stripe_payment_intent_id: invoice.payment_intent as string,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: "succeeded",
      description: invoice.description || `Payment for ${invoice.lines.data[0]?.description}`,
    }

    const { data, error } = await supabaseAdmin.from("payments").insert(paymentData).select()

    if (error) {
      console.error("❌ Error saving payment record:", error)
    } else {
      console.log("✅ Payment record saved:", data)
    }
  } catch (error) {
    console.error("❌ Error in handlePaymentSucceeded:", error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    console.log("💸 Processing failed payment:", invoice.id)

    const paymentData = {
      user_id: invoice.metadata?.user_id,
      stripe_payment_intent_id: invoice.payment_intent as string,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: "failed",
      description: invoice.description || `Failed payment for ${invoice.lines.data[0]?.description}`,
    }

    const { data, error } = await supabaseAdmin.from("payments").insert(paymentData).select()

    if (error) {
      console.error("❌ Error saving failed payment record:", error)
    } else {
      console.log("✅ Failed payment record saved:", data)
    }
  } catch (error) {
    console.error("❌ Error in handlePaymentFailed:", error)
  }
}
