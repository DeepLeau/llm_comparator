import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function GET(request: NextRequest) {
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

    // Récupérer le plan de l'utilisateur depuis la base de données
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("plan")
      .eq("id", user.id)
      .single()

    if (userError) {
      console.error("Error fetching user plan:", userError)
      return NextResponse.json({ error: "Failed to fetch user plan" }, { status: 500 })
    }

    // Plan par défaut si non défini
    const plan = userData?.plan || "free"

    return NextResponse.json({
      plan,
      userId: user.id,
    })
  } catch (error) {
    console.error("Error in user-plan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
