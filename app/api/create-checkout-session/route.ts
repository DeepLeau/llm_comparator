import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
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

// Configuration des prix Stripe
const STRIPE_PRICE_IDS = {
  start: "price_1RixTrGffKn97RRDKSYDuywj",
  scale: "price_1RixEiGffKn97RRDrqTLy46a",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("=== CREATE CHECKOUT SESSION ===")
    console.log("Request body:", body)

    // Support des deux formats d'API
    let planType: string
    let priceId: string

    if (body.priceId && body.planType) {
      // Nouveau format depuis pricing-plans.tsx
      planType = body.planType
      priceId = body.priceId
      console.log("Using new format - planType:", planType, "priceId:", priceId)
    } else if (body.plan) {
      // Ancien format
      planType = body.plan
      priceId = STRIPE_PRICE_IDS[body.plan as keyof typeof STRIPE_PRICE_IDS]
      console.log("Using old format - converted planType:", planType, "priceId:", priceId)
    } else {
      console.error("❌ Missing required parameters")
      return NextResponse.json({ error: "Missing plan information" }, { status: 400 })
    }

    if (!priceId) {
      console.error("❌ Invalid plan type:", planType)
      return NextResponse.json({ error: `Invalid plan type: ${planType}` }, { status: 400 })
    }

    // Vérifier si l'utilisateur est connecté
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("User authenticated:", !!user, user?.email)

    // URLs de redirection
    const baseUrl = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const successUrl = user
      ? `${baseUrl}/dashboard?payment=success&plan=${planType}`
      : `${baseUrl}/signup?payment=success&plan=${planType}&session_id={CHECKOUT_SESSION_ID}`

    const cancelUrl = `${baseUrl}/pricing?canceled=true`

    console.log("Redirect URLs:", { successUrl, cancelUrl })

    // Configuration de la session Stripe
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        plan: planType,
        user_id: user?.id || "",
        user_email: user?.email || body.email || "",
        user_name: user?.user_metadata?.name || body.name || "",
      },
      subscription_data: {
        metadata: {
          plan: planType,
          user_id: user?.id || "",
          user_email: user?.email || body.email || "",
        },
      },
      allow_promotion_codes: true,
    }

    // Ajouter l'email du customer si disponible
    if (user?.email || body.email) {
      sessionConfig.customer_email = user?.email || body.email
    }

    console.log("Creating Stripe session with config:", {
      mode: sessionConfig.mode,
      customer_email: sessionConfig.customer_email,
      metadata: sessionConfig.metadata,
    })

    const session = await stripe.checkout.sessions.create(sessionConfig)

    console.log("✅ Stripe session created:", {
      id: session.id,
      url: session.url,
      customer_email: session.customer_email,
    })

    // Si l'utilisateur n'est pas connecté, sauvegarder les infos pour plus tard
    if (!user) {
      console.log("💾 Saving pending subscription for non-authenticated user")

      const { error: insertError } = await supabaseAdmin.from("pending_subscriptions").insert({
        session_id: session.id,
        email: session.customer_email || body.email || "",
        name: body.name || "",
        plan: planType,
        stripe_customer_id: session.customer as string,
        created_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("❌ Error saving pending subscription:", insertError)
      } else {
        console.log("✅ Pending subscription saved successfully")
      }
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error("❌ Error creating checkout session:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
