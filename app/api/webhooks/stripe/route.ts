import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("Webhook event:", event.type)

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        console.log("Checkout completed:", session.id)

        // Récupérer les détails de la subscription
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

          // Mettre à jour ou créer le profil utilisateur
          if (session.customer) {
            const customer = await stripe.customers.retrieve(session.customer as string)

            if (customer && !customer.deleted && customer.metadata?.supabase_user_id) {
              // Utilisateur existant
              await supabase
                .from("profiles")
                .update({
                  stripe_customer_id: customer.id,
                  subscription_status: subscription.status,
                  subscription_id: subscription.id,
                  plan_type: session.metadata?.plan_type || "pro",
                })
                .eq("id", customer.metadata.supabase_user_id)
            } else {
              // Nouvel utilisateur - stocker dans pending_subscriptions
              await supabase.from("pending_subscriptions").insert({
                stripe_customer_id: session.customer as string,
                subscription_id: subscription.id,
                plan_type: session.metadata?.plan_type || "pro",
                billing_period: session.metadata?.billing_period || "monthly",
                status: subscription.status,
              })
            }
          }
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        console.log("Subscription updated:", subscription.id)

        // Mettre à jour le statut de l'abonnement
        await supabase
          .from("profiles")
          .update({
            subscription_status: subscription.status,
          })
          .eq("subscription_id", subscription.id)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        console.log("Subscription cancelled:", subscription.id)

        // Mettre à jour le statut de l'abonnement
        await supabase
          .from("profiles")
          .update({
            subscription_status: "cancelled",
            subscription_id: null,
          })
          .eq("subscription_id", subscription.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
