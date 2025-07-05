import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard?welcome=true"

  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error exchanging code for session:", error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error`)
      }

      if (data.user) {
        // Get user metadata
        const userData = data.user.user_metadata || {}
        const plan = userData.plan || "free"
        const name = userData.name || ""

        // Define credits based on plan
        const planCredits = {
          free: 50,
          pro: 1000,
          business: 5000,
        }

        // Create user record in users table
        const { error: insertError } = await supabase.from("users").insert({
          id: data.user.id,
          name: name,
          plan: plan,
          credits: planCredits[plan as keyof typeof planCredits] || 50,
        })

        if (insertError) {
          console.error("Error creating user record:", insertError)
          // Don't redirect to error page, user auth is successful
        }

        console.log("User verified and record created:", {
          id: data.user.id,
          email: data.user.email,
          name: name,
          plan: plan,
          credits: planCredits[plan as keyof typeof planCredits] || 50,
        })
      }

      return NextResponse.redirect(`${origin}${next}`)
    } catch (error) {
      console.error("Unexpected error in auth callback:", error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }
  }

  // No code provided
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}