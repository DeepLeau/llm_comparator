import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"
import { jwtDecode } from "jwt-decode"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// Use service role client for admin operations
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    console.log("=== MANAGE SUBSCRIPTION ===")

    // Get the authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("❌ No authorization header")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7) // Remove "Bearer " prefix

    // Decode the JWT token to get user info
    let decodedToken: any
    try {
      decodedToken = jwtDecode(token)
      if (!decodedToken || !decodedToken.sub) {
        throw new Error("Invalid token structure")
      }
    } catch (error) {
      console.error("❌ Error decoding token:", error)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const userId = decodedToken.sub
    const userEmail = decodedToken.email
    console.log("✅ User authenticated:", userId, userEmail)

    // Get user info
    const { data: user, error: userError } = await supabaseAdmin.from("users").select("*").eq("id", userId).single()

    if (userError || !user) {
      console.error("❌ User not found:", userError)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user has an active subscription
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single()

    if (subError || !subscription) {
      console.log("❌ No active subscription found for user")
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 })
    }

    // Get the Stripe customer ID
    const { data: customers, error: customerError } = await supabaseAdmin
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", userId)

    if (customerError || !customers || customers.length === 0) {
      console.error("❌ No Stripe customer found for user:", userId, customerError)
      return NextResponse.json({ error: "No customer record found" }, { status: 404 })
    }

    if (customers.length > 1) {
      console.error("❌ Multiple Stripe customers found for user:", userId)
      return NextResponse.json({ error: "Multiple customer records found for user" }, { status: 500 })
    }

    const stripeCustomerId = customers[0].stripe_customer_id
    console.log("✅ Using Stripe customer ID:", stripeCustomerId)

    const origin = request.headers.get("origin") || "http://localhost:3000"

    // Create billing portal session for subscription management
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${origin}/settings`,
    })

    console.log("✅ Portal session created:", portalSession.id)

    return NextResponse.json({
      url: portalSession.url,
      message: "Portal session created successfully",
    })
  } catch (error) {
    console.error("❌ Error creating portal session:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
