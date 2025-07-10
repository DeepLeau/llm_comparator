import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    console.log("=== CREATE PORTAL SESSION ===")

    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("❌ User not authenticated:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Récupérer le customer ID Stripe de l'utilisateur
    const { data: customer, error: customerError } = await supabase
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single()

    if (customerError || !customer) {
      console.error("❌ No Stripe customer found for user:", user.id, customerError)
      return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    // Créer une session du portail client
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.stripe_customer_id,
      return_url: `${origin}/settings`,
    })

    console.log("✅ Portal session created:", portalSession.id)

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error("❌ Error creating portal session:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
