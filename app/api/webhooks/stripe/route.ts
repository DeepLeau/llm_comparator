import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// Initialize Supabase Admin Client (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key for admin access
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

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

    console.log(`🔔 Webhook received: ${event.type}`)

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("💥 Webhook error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log(`✅ Checkout completed: ${session.id}`)

  const userId = session.metadata?.user_id
  const planType = session.metadata?.plan_type || "pro"
  const billingPeriod = session.metadata?.billing_period || "monthly"

  if (userId) {
    // CAS 1: Utilisateur authentifié
    console.log(`👤 Authenticated user: ${userId}`)

    try {
      // Créer ou mettre à jour le customer Stripe
      await supabaseAdmin.from("stripe_customers").upsert({
        user_id: userId,
        stripe_customer_id: session.customer as string,
        created_at: new Date().toISOString(),
      })

      // Mettre à jour le plan de l'utilisateur
      const credits = planType === "pro" ? 1000 : planType === "business" ? 5000 : 50

      await supabaseAdmin
        .from("users")
        .update({
          plan: planType,
          credits: credits,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      console.log(`✅ User ${userId} upgraded to ${planType}`)
    } catch (error) {
      console.error("❌ Error updating authenticated user:", error)
    }
  } else {
    // CAS 2: Prospect non-authentifié
    console.log(`🔓 Guest checkout: ${session.customer}`)

    try {
      await supabaseAdmin.from("pending_subscriptions").insert({
        stripe_customer_id: session.customer as string,
        email: session.customer_details?.email || "",
        name: session.customer_details?.name || "",
        plan: planType,
        billing_period: billingPeriod,
        session_id: session.id,
        created_at: new Date().toISOString(),
      })

      console.log(`✅ Pending subscription created for ${session.customer_details?.email}`)
    } catch (error) {
      console.error("❌ Error creating pending subscription:", error)
    }
  }

  // Enregistrer le paiement
  if (session.amount_total) {
    try {
      await supabaseAdmin.from("payments").insert({
        user_id: userId || null,
        stripe_payment_intent_id: session.payment_intent as string,
        amount: session.amount_total,
        currency: session.currency || "usd",
        status: "succeeded",
        description: `${planType} plan - ${billingPeriod}`,
        created_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("❌ Error recording payment:", error)
    }
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log(`🔄 Subscription updated: ${subscription.id}`)

  try {
    await supabaseAdmin.from("subscriptions").upsert({
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      status: subscription.status,
      price_id: subscription.items.data[0]?.price.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })

    console.log(`✅ Subscription ${subscription.id} updated`)
  } catch (error) {
    console.error("❌ Error updating subscription:", error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`❌ Subscription cancelled: ${subscription.id}`)

  try {
    // Marquer l'abonnement comme annulé
    await supabaseAdmin
      .from("subscriptions")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscription.id)

    // Rétrograder l'utilisateur au plan gratuit
    const { data: customerData } = await supabaseAdmin
      .from("stripe_customers")
      .select("user_id")
      .eq("stripe_customer_id", subscription.customer as string)
      .single()

    if (customerData?.user_id) {
      await supabaseAdmin
        .from("users")
        .update({
          plan: "free",
          credits: 50,
          updated_at: new Date().toISOString(),
        })
        .eq("id", customerData.user_id)

      console.log(`✅ User ${customerData.user_id} downgraded to free plan`)
    }
  } catch (error) {
    console.error("❌ Error handling subscription cancellation:", error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`💰 Payment succeeded: ${invoice.id}`)

  try {
    await supabaseAdmin.from("payments").insert({
      stripe_payment_intent_id: invoice.payment_intent as string,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: "succeeded",
      description: invoice.description || "Subscription payment",
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error recording successful payment:", error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`💸 Payment failed: ${invoice.id}`)

  try {
    await supabaseAdmin.from("payments").insert({
      stripe_payment_intent_id: invoice.payment_intent as string,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: "failed",
      description: invoice.description || "Failed subscription payment",
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error recording failed payment:", error)
  }
}
