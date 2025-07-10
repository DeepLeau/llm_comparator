import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    console.log("=== PROCESS PENDING SUBSCRIPTION ===")
    console.log("Session ID:", sessionId)

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Récupérer le token d'authentification
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      console.log("❌ No authorization header")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Vérifier l'utilisateur avec le token
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      console.log("❌ Invalid token:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("✅ User authenticated:", user.id, user.email)

    // Chercher l'abonnement en attente
    const { data: pendingSubscription, error: pendingError } = await supabaseAdmin
      .from("pending_subscriptions")
      .select("*")
      .eq("session_id", sessionId)
      .single()

    if (pendingError || !pendingSubscription) {
      console.log("❌ No pending subscription found:", pendingError)
      return NextResponse.json({ error: "No pending subscription found" }, { status: 404 })
    }

    console.log("✅ Found pending subscription:", pendingSubscription)

    // Vérifier que l'email correspond
    if (pendingSubscription.email !== user.email) {
      console.log("❌ Email mismatch:", pendingSubscription.email, "vs", user.email)
      return NextResponse.json({ error: "Email mismatch" }, { status: 400 })
    }

    // Récupérer les détails de la session Stripe
    console.log("🔍 Retrieving Stripe session:", sessionId)
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "payment_intent"],
    })

    console.log("Stripe session details:", {
      id: session.id,
      customer: session.customer,
      subscription: session.subscription,
      payment_intent: session.payment_intent,
      amount_total: session.amount_total,
      currency: session.currency,
    })

    // Utiliser le plan depuis les métadonnées de l'abonnement Stripe (plus fiable)
    let finalPlan = pendingSubscription.plan
    if (session.subscription && typeof session.subscription === "object") {
      const subscriptionPlan = session.subscription.metadata?.plan
      if (subscriptionPlan) {
        finalPlan = subscriptionPlan
        console.log("🔄 Using plan from Stripe metadata:", finalPlan)
      }
    }

    // Déterminer les crédits selon le plan
    const planCredits = {
      free: 50,
      start: 500,
      scale: 1500,
    }

    const credits = planCredits[finalPlan as keyof typeof planCredits] || 50

    console.log("Final Plan:", finalPlan, "Credits:", credits)

    // Mettre à jour le plan de l'utilisateur
    const { data: userUpdateData, error: userUpdateError } = await supabaseAdmin
      .from("users")
      .update({
        plan: finalPlan,
        credits: credits,
      })
      .eq("id", user.id)
      .select()

    if (userUpdateError) {
      console.error("❌ Error updating user plan:", userUpdateError)
      return NextResponse.json({ error: "Failed to update user plan" }, { status: 500 })
    }

    console.log("✅ User plan updated:", userUpdateData)

    // Créer la relation customer
    if (session.customer) {
      console.log("💳 Saving customer relation:", user.id, "->", session.customer)

      const { data: customerData, error: customerError } = await supabaseAdmin
        .from("stripe_customers")
        .upsert({
          user_id: user.id,
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
      console.log("📋 Processing subscription:", session.subscription)

      // session.subscription est déjà l'objet complet, pas besoin de retrieve
      const subscription = session.subscription as any

      console.log("Subscription details:", {
        id: subscription.id,
        status: subscription.status,
        customer: subscription.customer,
        price_id: subscription.items.data[0]?.price.id,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
      })

      const { data: subscriptionData, error: subscriptionError } = await supabaseAdmin
        .from("subscriptions")
        .upsert({
          user_id: user.id,
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

    // Sauvegarder le paiement
    if (session.payment_intent) {
      console.log("💰 Processing payment:", session.payment_intent)

      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string)

      const { data: paymentData, error: paymentError } = await supabaseAdmin
        .from("payments")
        .insert({
          user_id: user.id,
          stripe_payment_intent_id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          description: `Payment for ${finalPlan} plan`,
        })
        .select()

      if (paymentError) {
        console.error("❌ Error saving payment:", paymentError)
      } else {
        console.log("✅ Payment saved successfully:", paymentData)
      }
    }

    // Supprimer l'abonnement en attente
    const { error: deleteError } = await supabaseAdmin
      .from("pending_subscriptions")
      .delete()
      .eq("session_id", sessionId)

    if (deleteError) {
      console.error("❌ Error deleting pending subscription:", deleteError)
    } else {
      console.log("✅ Pending subscription deleted")
    }

    return NextResponse.json({
      success: true,
      message: "Subscription processed successfully",
      plan: finalPlan,
      credits: credits,
    })
  } catch (error) {
    console.error("❌ Error processing pending subscription:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
