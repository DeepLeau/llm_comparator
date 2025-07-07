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
    const { creditsToConsume } = await request.json()

    if (!creditsToConsume || creditsToConsume <= 0) {
      return NextResponse.json({ error: "Invalid credits amount" }, { status: 400 })
    }

    // Récupérer l'utilisateur depuis le token
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Récupérer les crédits actuels
    const { data: userData, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (fetchError) {
      console.error("Error fetching user credits:", fetchError)
      return NextResponse.json({ error: "Failed to fetch user credits" }, { status: 500 })
    }

    const currentCredits = userData.credits || 0
    const newCredits = currentCredits - creditsToConsume

    // Vérifier si l'utilisateur a assez de crédits
    if (newCredits < 0) {
      return NextResponse.json(
        { error: "Insufficient credits", currentCredits, required: creditsToConsume },
        { status: 400 },
      )
    }

    // Mettre à jour les crédits
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        credits: newCredits,
      })
      .eq("id", user.id)
      .select("credits")
      .single()

    if (updateError) {
      console.error("Error updating user credits:", updateError)
      return NextResponse.json({ error: "Failed to update credits" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      creditsConsumed: creditsToConsume,
      remainingCredits: updatedUser.credits,
    })
  } catch (error) {
    console.error("Error in consume-credits:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
