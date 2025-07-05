import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Stripe from "stripe"

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
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("User authenticated:", !!user)
    if (authError) {
      console.log("Auth error:", authError)
    }

    const origin = request.headers.get("origin") || "http://localhost:3000"

    // Configuration de base pour la session Stripe
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      metadata: {
        plan_type: planType,
        billing_period: billingPeriod,
      },
      cancel_url: `${origin}/pricing?payment=cancelled`,
      allow_promotion_codes: true,
    }

    if (user) {
      // CAS 1: UTILISATEUR AUTHENTIFIÉ
      console.log("✅ Authenticated user checkout for:", user.email)

      // Vérifier si l'utilisateur a déjà un customer Stripe
      const { data: existingCustomer } = await supabase
        .from("stripe_customers")
        .select("stripe_customer_id")
        .eq("user_id", user.id)
        .single()

      if (existingCustomer?.stripe_customer_id) {
        // Utiliser le customer existant
        console.log("Using existing customer:", existingCustomer.stripe_customer_id)
        sessionConfig.customer = existingCustomer.stripe_customer_id
      } else {
        // Créer un nouveau customer avec l'email
        console.log("Creating new customer for:", user.email)
        sessionConfig.customer_email = user.email
      }

      sessionConfig.success_url = `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&payment=success`
      sessionConfig.metadata!.user_id = user.id
    } else {
      // CAS 2: UTILISATEUR NON AUTHENTIFIÉ
      console.log("🔓 Guest checkout - user will need to sign up after payment")
      sessionConfig.success_url = `${origin}/signup?session_id={CHECKOUT_SESSION_ID}&plan=${planType}&payment=success`
    }

    console.log("Creating Stripe session with config:", {
      mode: sessionConfig.mode,
      hasCustomer: !!sessionConfig.customer,
      hasCustomerEmail: !!sessionConfig.customer_email,
      metadata: sessionConfig.metadata,
      success_url: sessionConfig.success_url,
    })

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
