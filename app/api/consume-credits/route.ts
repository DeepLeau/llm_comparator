import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

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
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { creditsToConsume } = await request.json()

    if (!creditsToConsume || creditsToConsume < 1) {
      return NextResponse.json({ error: "Invalid credits to consume" }, { status: 400 })
    }

    // Get current credits and update
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (fetchError) {
      console.error("Error fetching user credits:", fetchError)
      return NextResponse.json({ error: "Failed to fetch user credits" }, { status: 500 })
    }

    const currentCredits = userData?.credits || 0

    if (currentCredits < creditsToConsume) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 })
    }

    const newCredits = currentCredits - creditsToConsume

    // Update user credits
    const { error: updateError } = await supabase.from("users").update({ credits: newCredits }).eq("id", user.id)

    if (updateError) {
      console.error("Error updating user credits:", updateError)
      return NextResponse.json({ error: "Failed to update credits" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      newCredits,
      creditsConsumed: creditsToConsume,
    })
  } catch (error) {
    console.error("Error in consume-credits:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
