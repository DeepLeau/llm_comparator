import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
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
    const customerId =
          typeof session.customer === "string"
            ? session.customer
            : (session.customer as Stripe.Customer).id;

    if (userId) {
      // CAS 1: UTILISATEUR AUTHENTIFIÉ
      console.log("✅ Processing authenticated user checkout for user:", userId)

      // Sauvegarder ou mettre à jour la relation customer
      if (session.customer) {
        console.log("Saving customer relation:", userId, "->", session.customer)

        const { data: customerData, error: customerError } = await supabaseAdmin
          .from("stripe_customers")
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
          })
          .select()

        if (customerError) {
          console.error("❌ Error saving customer relation:", customerError)
        } else {
          console.log("✅ Customer relation saved:", customerData)
        }
      }

      // Sauvegarder l'abonnement si présent (le trigger se chargera de mettre à jour users)
      if (session.subscription) {
        console.log("Retrieving subscription details:", session.subscription)

        const subscriptionResponse = await stripe.subscriptions.retrieve(session.subscription as string)
        const subscription = subscriptionResponse as Stripe.Subscription

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
            stripe_customer_id: customerId,
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
          console.log("🔄 User plan will be updated automatically by trigger")
        }
      } else {
        // Pas d'abonnement, mettre à jour manuellement le plan utilisateur
        const credits = planType === "pro" ? 500 : planType === "business" ? 1500 : 10
        console.log("No subscription, updating user plan manually to:", planType, "with credits:", credits)

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
      }
    } else {
      // CAS 2: PROSPECT NON AUTHENTIFIÉ
      console.log("🔓 Processing guest checkout - storing in pending_subscriptions")

      const customerDetails = session.customer_details
      console.log("Customer details:", customerDetails)

      const pendingData = {
        stripe_customer_id: customerId,
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

    const customerId = typeof subscription.customer === "string"
      ? subscription.customer
      : (subscription.customer as Stripe.Customer).id;

    // 🔍 On récupère le user_id associé à ce customer
    const { data: customer, error: customerError } = await supabaseAdmin
      .from("stripe_customers")
      .select("user_id")
      .eq("stripe_customer_id", customerId)
      .single()

    if (customerError || !customer) {
      console.error("❌ Unable to find user for subscription update:", customerError)
      return
    }

    const userId = customer.user_id;

    const { data: subscriptionData, error: subscriptionError } = await supabaseAdmin
      .from("subscriptions")
      .upsert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        price_id: subscription.items.data[0]?.price.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      }, { onConflict: 'stripe_subscription_id' })
      .select()

    if (subscriptionError) {
      console.error("❌ Error updating subscription:", subscriptionError)
    } else {
      console.log("✅ Subscription updated successfully:", subscriptionData)
    }
  } catch (error) {
    console.error("❌ Error in handleSubscriptionUpdated:", error)
  }
}



async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log("❌ Processing subscription deletion:", subscription.id)

    // Mettre à jour le statut de l'abonnement (le trigger se chargera de mettre à jour users)
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
      console.log("🔄 User will be downgraded to free plan automatically by trigger")
    }
  } catch (error) {
    console.error("❌ Error in handleSubscriptionDeleted:", error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log("💰 Processing successful payment:", invoice.id)
    const stripePaymentIntentId = invoice.payment_intent
    ? (invoice.payment_intent as string)
    : `invoice_${invoice.id}`; // fallback

    const paymentData = {
      user_id: invoice.metadata?.user_id,
      stripe_payment_intent_id: stripePaymentIntentId,
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
    const stripePaymentIntentId = invoice.payment_intent
    ? (invoice.payment_intent as string)
    : `invoice_${invoice.id}`; // fallback

    const paymentData = {
      user_id: invoice.metadata?.user_id,
      stripe_payment_intent_id: stripePaymentIntentId,
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
