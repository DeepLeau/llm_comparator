import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Stripe from "stripe"
import { STRIPE_PRICE_IDS } from "@/lib/stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("=== CREATE CHECKOUT SESSION ===")
    console.log("Request data:", body)

    let priceId: string
    let planType: string

    // Support for both old format (plan + billing_period) and new format (direct priceId)
    if (body.priceId) {
      // New format: direct priceId from pricing page
      priceId = body.priceId
      planType = body.planType
      console.log("✅ Using direct price ID:", priceId)
    } else {
      // Old format: plan + billing_period
      const { plan, billing_period } = body

      if (!plan || !billing_period) {
        return NextResponse.json({ error: "Plan and billing period are required" }, { status: 400 })
      }

      // Construire la clé pour récupérer le price_id
      const priceKey = `${plan}_${billing_period}` as keyof typeof STRIPE_PRICE_IDS
      priceId = STRIPE_PRICE_IDS[priceKey]
      planType = plan

      if (!priceId) {
        console.error("❌ Invalid plan/billing combination:", priceKey)
        return NextResponse.json({ error: "Invalid plan or billing period" }, { status: 400 })
      }

      console.log("✅ Using calculated price ID:", priceId)
    }

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
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/pricing?canceled=true`,
      metadata: {
        plan_type: planType,
        billing_period: body.billing_period || "monthly", // Default to monthly for direct priceId
      },
    }

    // Si un user_id est fourni (utilisateur connecté)
    if (body.user_id) {
      console.log("✅ Creating session for authenticated user:", body.user_id)

      // Vérifier que l'utilisateur existe
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, email")
        .eq("id", body.user_id)
        .single()

      if (userError || !user) {
        console.error("❌ User not found:", userError)
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Chercher un customer Stripe existant
      const { data: existingCustomer } = await supabase
        .from("stripe_customers")
        .select("stripe_customer_id")
        .eq("user_id", body.user_id)
        .single()

      if (existingCustomer) {
        // Utiliser le customer existant
        let customerId: string
        if (typeof existingCustomer.stripe_customer_id === "string") {
          customerId = existingCustomer.stripe_customer_id
        } else if (typeof existingCustomer.stripe_customer_id === "object" && existingCustomer.stripe_customer_id?.id) {
          customerId = existingCustomer.stripe_customer_id.id
        } else {
          console.error("❌ Invalid customer ID format")
          return NextResponse.json({ error: "Invalid customer data" }, { status: 400 })
        }

        sessionConfig.customer = customerId
        console.log("✅ Using existing customer:", customerId)
      } else {
        // Utiliser l'email pour créer/associer un customer
        sessionConfig.customer_email = user.email
        console.log("✅ Using customer email:", user.email)
      }

      // Ajouter l'user_id aux métadonnées
      sessionConfig.metadata!.user_id = body.user_id
    } else {
      console.log("🔓 Creating session for guest user")
      // Pour les utilisateurs non connectés, Stripe créera automatiquement un customer
    }

    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create(sessionConfig)

    console.log("✅ Checkout session created:", session.id)
    console.log("Session URL:", session.url)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("❌ Error creating checkout session:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
