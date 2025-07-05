import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    console.log("=== CREATE PORTAL SESSION ===")

    // Vérifier si l'utilisateur est authentifié
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("❌ User not authenticated:", authError)
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    console.log("✅ User authenticated:", user.email)

    // Récupérer le customer ID Stripe de l'utilisateur
    const { data: customerData, error: customerError } = await supabase
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single()

    if (customerError || !customerData) {
      console.log("❌ No Stripe customer found for user:", user.id)
      return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    }

    console.log("✅ Found Stripe customer:", customerData.stripe_customer_id)

    // Créer une session du portail client Stripe
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerData.stripe_customer_id,
      return_url: `${request.nextUrl.origin}/settings`,
    })

    console.log("✅ Portal session created:", portalSession.id)

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error("❌ Error creating portal session:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
