import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    console.log("=== CREATE UPGRADE SESSION ===")

    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Vérifier que l'utilisateur a un plan free
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("plan, name")
      .eq("id", user.id)
      .single()

    if (userError || !userData) {
      console.error("User error:", userError)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (userData.plan !== "free") {
      return NextResponse.json({ error: "User already has a paid plan" }, { status: 400 })
    }

    const { plan } = await request.json()

    if (!plan || !["start", "scale"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan specified" }, { status: 400 })
    }

    console.log("Creating upgrade session for:", user.email, "Plan:", plan)

    // Vérifier si l'utilisateur a déjà un customer Stripe
    let customerId: string | null = null
    const { data: existingCustomer } = await supabase
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single()

    if (existingCustomer) {
      customerId = existingCustomer.stripe_customer_id
      console.log("Using existing customer:", customerId)
    } else {
      // Créer un nouveau customer Stripe
      const customer = await stripe.customers.create({
        email: user.email!,
        name: userData.name || user.email!,
        metadata: {
          user_id: user.id,
        },
      })
      customerId = customer.id
      console.log("Created new customer:", customerId)

      // Sauvegarder la relation customer
      await supabase.from("stripe_customers").insert({
        user_id: user.id,
        stripe_customer_id: customerId,
      })
    }

    // Déterminer le price_id selon le plan
    const priceId = plan === "start" ? "price_1RixTrGffKn97RRDKSYDuywj" : "price_1RixEiGffKn97RRDrqTLy46a"

    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/settings?upgrade=cancelled`,
      metadata: {
        user_id: user.id,
        plan: plan,
        upgrade_from: "free",
      },
    })

    console.log("✅ Upgrade session created:", session.id)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("❌ Error creating upgrade session:", error)
    return NextResponse.json({ error: "Failed to create upgrade session" }, { status: 500 })
  }
}
