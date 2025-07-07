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
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { creditsToConsume } = await request.json()

    if (!creditsToConsume || creditsToConsume <= 0) {
      return NextResponse.json({ error: "Invalid credits to consume" }, { status: 400 })
    }

    // Get current credits first
    const { data: userData, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (fetchError) {
      console.error("Error fetching user credits:", fetchError)
      return NextResponse.json({ error: "Failed to fetch user credits" }, { status: 500 })
    }

    const currentCredits = userData?.credits || 0
    const newCredits = currentCredits - creditsToConsume

    if (newCredits < 0) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 })
    }

    // Update user's credits
    const { error: updateError } = await supabaseAdmin.from("users").update({ credits: newCredits }).eq("id", user.id)

    if (updateError) {
      console.error("Error consuming credits:", updateError)
      return NextResponse.json({ error: "Failed to consume credits" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      creditsConsumed: creditsToConsume,
      remainingCredits: newCredits,
    })
  } catch (error) {
    console.error("Error in consume-credits:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
