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

    const { creditsRequired } = await request.json()

    if (!creditsRequired || creditsRequired <= 0) {
      return NextResponse.json({ error: "Invalid credits required" }, { status: 400 })
    }

    // Get user's current credits
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (userError) {
      console.error("Error fetching user credits:", userError)
      return NextResponse.json({ error: "Failed to fetch user credits" }, { status: 500 })
    }

    const currentCredits = userData?.credits || 0
    const hasEnoughCredits = currentCredits >= creditsRequired

    return NextResponse.json({
      hasEnoughCredits,
      currentCredits,
      creditsRequired,
    })
  } catch (error) {
    console.error("Error in check-credits:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
