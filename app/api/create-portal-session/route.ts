import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Vérifier que l'utilisateur est authentifié
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Récupérer le customer ID Stripe de l'utilisateur depuis la table stripe_customers
    const { data: customerData, error: customerError } = await supabase
      .from("stripe_customers") // ✅ Utilise stripe_customers, pas profiles
      .select("stripe_customer_id")
      .eq("user_id", user.id) // ✅ Utilise user_id, pas id
      .single()

    if (customerError || !customerData) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    }

    // Créer une session du portail client
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerData.stripe_customer_id,
      return_url: `${request.nextUrl.origin}/settings`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error("Error creating portal session:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
