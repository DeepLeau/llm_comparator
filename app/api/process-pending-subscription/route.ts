import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Stripe from "stripe"
import { jwtDecode } from "jwt-decode"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// Client admin pour les opérations privilégiées
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  console.log("=== PROCESSING PENDING SUBSCRIPTION ===")

  try {
    const { sessionId } = await request.json()
    console.log("Session ID received:", sessionId)

    if (!sessionId) {
      console.error("❌ No session ID provided")
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Récupérer le token d'authentification depuis le header Authorization
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("❌ No authorization token provided")
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 })
    }

    const accessToken = authHeader.replace("Bearer ", "")
    console.log("Access token received:", accessToken.substring(0, 20) + "...")

    // Décoder le JWT pour récupérer l'user_id
    let userId: string
    try {
      const decoded = jwtDecode(accessToken) as any
      userId = decoded.sub
      console.log("✅ User ID from token:", userId)
    } catch (error) {
      console.error("❌ Invalid JWT token:", error)
      return NextResponse.json({ error: "Invalid authorization token" }, { status: 401 })
    }

    // Vérifier que l'utilisateur existe
    const { data: user, error: userError } = await supabaseAdmin.from("users").select("*").eq("id", userId).single()

    if (userError || !user) {
      console.error("❌ User not found:", userError)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("✅ User found:", user.email)

    // Récupérer les détails de la session Stripe
    console.log("Fetching Stripe session details...")
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    })

    console.log("Stripe session status:", session.payment_status)
    console.log("Stripe session mode:", session.mode)

    if (session.payment_status !== "paid") {
      console.error("❌ Payment not completed")
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    // Chercher l'abonnement en attente
    console.log("Looking for pending subscription...")
    const { data: pendingSubscription, error: pendingError } = await supabaseAdmin
      .from("pending_subscriptions")
      .select("*")
      .eq("session_id", sessionId)
      .single()

    if (pendingError || !pendingSubscription) {
      console.error("❌ No pending subscription found:", pendingError)

      // Debug: voir toutes les pending subscriptions
      const { data: allPending } = await supabaseAdmin
        .from("pending_subscriptions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      console.log("All pending subscriptions:", allPending)
      return NextResponse.json({ error: "No pending subscription found" }, { status: 404 })
    }

    console.log("✅ Found pending subscription:", pendingSubscription)

    // Créer ou récupérer le customer Stripe
    let customerId = session.customer as string

    if (!customerId && session.customer_email) {
      console.log("Creating Stripe customer...")
      const customer = await stripe.customers.create({
        email: session.customer_email,
        name: user.name || "",
        metadata: {
          user_id: userId,
        },
      })
      customerId = customer.id
      console.log("✅ Stripe customer created:", customerId)
    }

    // Créer l'enregistrement stripe_customers
    if (customerId) {
      const { error: customerError } = await supabaseAdmin.from("stripe_customers").upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        email: user.email,
      })

      if (customerError) {
        console.error("❌ Error creating stripe_customers record:", customerError)
      } else {
        console.log("✅ Stripe customer record created/updated")
      }
    }

    // Créer l'enregistrement subscription si c'est un abonnement
    if (session.mode === "subscription" && session.subscription) {
      const subscription = session.subscription as Stripe.Subscription

      const { error: subscriptionError } = await supabaseAdmin.from("subscriptions").upsert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        status: subscription.status,
        price_id: subscription.items.data[0]?.price.id,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        plan_type: pendingSubscription.plan_type,
        billing_period: pendingSubscription.billing_period,
      })

      if (subscriptionError) {
        console.error("❌ Error creating subscription record:", subscriptionError)
      } else {
        console.log("✅ Subscription record created")
      }
    }

    // Mettre à jour le plan utilisateur
    const planCredits = {
      free: 50,
      pro: 1000,
      business: 5000,
    }

    const newCredits = planCredits[pendingSubscription.plan_type as keyof typeof planCredits] || 50

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        plan: pendingSubscription.plan_type,
        credits: newCredits,
      })
      .eq("id", userId)

    if (updateError) {
      console.error("❌ Error updating user plan:", updateError)
    } else {
      console.log("✅ User plan updated")
    }

    // Marquer l'abonnement en attente comme traité
    const { error: deleteError } = await supabaseAdmin
      .from("pending_subscriptions")
      .delete()
      .eq("id", pendingSubscription.id)

    if (deleteError) {
      console.error("❌ Error deleting pending subscription:", deleteError)
    } else {
      console.log("✅ Pending subscription cleaned up")
    }

    console.log("✅ Subscription processed successfully!")

    return NextResponse.json({
      success: true,
      plan: pendingSubscription.plan_type,
      credits: newCredits,
      message: "Subscription processed successfully",
    })
  } catch (error) {
    console.error("❌ Error processing pending subscription:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
