import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    console.log("=== CREATE CHECKOUT SESSION DEBUG ===")

    // Vérifier les variables d'environnement
    console.log("STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY)
    console.log("NEXT_PUBLIC_SUPABASE_URL exists:", !!process.env.NEXT_PUBLIC_SUPABASE_URL)

    const { priceId, planType, billingPeriod } = await request.json()
    console.log("Request data:", { priceId, planType, billingPeriod })

    if (!priceId || !planType || !billingPeriod) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Vérifier si l'utilisateur est connecté
    const authHeader = request.headers.get("authorization")
    let user = null
    let customerId = null

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "")
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser(token)
      user = authUser
    }

    console.log("User authenticated:", !!user)

    // Si l'utilisateur est connecté, récupérer ou créer son customer Stripe
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("stripe_customer_id").eq("id", user.id).single()

      if (profile?.stripe_customer_id) {
        customerId = profile.stripe_customer_id
        console.log("Existing customer ID:", customerId)
      } else {
        // Créer un nouveau customer Stripe
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            supabase_user_id: user.id,
          },
        })
        customerId = customer.id
        console.log("New customer ID:", customerId)

        // Sauvegarder le customer ID dans Supabase
        await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id)
      }
    }

    // Créer la session de checkout
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${request.nextUrl.origin}/dashboard?payment=success&plan=${planType}`,
      cancel_url: `${request.nextUrl.origin}/pricing?payment=cancelled`,
      metadata: {
        plan_type: planType,
        billing_period: billingPeriod,
      },
    }

    // Ajouter le customer ID si l'utilisateur est connecté
    if (customerId) {
      sessionConfig.customer = customerId
    } else {
      // Pour les utilisateurs non connectés, rediriger vers signup après paiement
      sessionConfig.success_url = `${request.nextUrl.origin}/signup?payment=success&plan=${planType}&billing=${billingPeriod}`
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)
    console.log("✅ Session created:", session.id)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("❌ Checkout session error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
