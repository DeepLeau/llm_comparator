import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    console.log("=== GET PENDING SUBSCRIPTION ===")
    console.log("Session ID:", sessionId)

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Chercher l'abonnement en attente
    const { data: pendingSubscription, error: pendingError } = await supabaseAdmin
      .from("pending_subscriptions")
      .select("*")
      .eq("session_id", sessionId)
      .single()

    if (pendingError || !pendingSubscription) {
      console.log("❌ No pending subscription found:", pendingError)
      return NextResponse.json({ error: "No pending subscription found" }, { status: 404 })
    }

    console.log("✅ Found pending subscription:", pendingSubscription)

    return NextResponse.json({
      email: pendingSubscription.email,
      name: pendingSubscription.name || "",
      plan: pendingSubscription.plan,
    })
  } catch (error) {
    console.error("❌ Error getting pending subscription:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
