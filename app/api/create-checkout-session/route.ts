import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    console.log("=== CREATE CHECKOUT SESSION ===")

    const { priceId, planType, billingPeriod } = await request.json()
    console.log("Request data:", { priceId, planType, billingPeriod })

    if (!priceId || !planType || !billingPeriod) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Vérifier si l'utilisateur est authentifié
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("User authenticated:", !!user)
    if (authError) {
      console.log("Auth error:", authError)
    }

    let customerId: string | undefined
    const sessionMetadata: Record<string, string> = {
      plan_type: planType,
      billing_period: billingPeriod,
    }

    if (user) {
      // CAS 1: UTILISATEUR AUTHENTIFIÉ
      console.log("✅ Authenticated user checkout for:", user.email)
      sessionMetadata.user_id = user.id

      // Vérifier s'il a déjà un customer Stripe dans la table stripe_customers
      const { data: existingCustomer } = await supabase
        .from("stripe_customers")
        .select("stripe_customer_id")
        .eq("user_id", user.id)
        .single()

      if (existingCustomer) {
        customerId = existingCustomer.stripe_customer_id
        console.log("✅ Using existing Stripe customer:", customerId)
      } else {
        // Créer un nouveau customer Stripe
        console.log("Creating new Stripe customer for authenticated user...")
        const customer = await stripe.customers.create({
          email: user.email!,
          metadata: {
            supabase_user_id: user.id,
          },
        })

        customerId = customer.id
        console.log("✅ New customer created:", customerId)

        // Sauvegarder dans la table stripe_customers
        const { error: insertError } = await supabase.from("stripe_customers").insert({
          user_id: user.id,
          stripe_customer_id: customerId,
        })

        if (insertError) {
          console.error("❌ Error saving customer to database:", insertError)
        } else {
          console.log("✅ Customer saved to database")
        }
      }
    } else {
      // CAS 2: PROSPECT NON AUTHENTIFIÉ
      console.log("🔓 Guest checkout - user will need to sign up after payment")
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
      success_url: user
        ? `${request.nextUrl.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&payment=success`
        : `${request.nextUrl.origin}/signup?session_id={CHECKOUT_SESSION_ID}&plan=${planType}&payment=success`,
      cancel_url: `${request.nextUrl.origin}/pricing?payment=cancelled`,
      metadata: sessionMetadata,
      allow_promotion_codes: true,
    }

    // Si utilisateur authentifié, utiliser son customer ID
    if (customerId) {
      sessionConfig.customer = customerId
    } else {
      // Pour les guests, Stripe créera automatiquement un customer
      sessionConfig.customer_creation = "always"
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)
    console.log("✅ Checkout session created:", session.id)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("❌ Error creating checkout session:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
