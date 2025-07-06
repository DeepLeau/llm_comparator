import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const sessionId = requestUrl.searchParams.get("session_id")

  console.log("=== AUTH CALLBACK ===")
  console.log("Code:", code)
  console.log("Session ID:", sessionId)
  console.log("Full URL:", requestUrl.toString())

  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  // Si on a un code, on l'échange pour une session
  if (code) {
    try {
      console.log("Exchanging code for session...")
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("❌ Auth callback error:", error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
      }

      console.log("✅ User authenticated via callback:", data.user?.email)

      // Créer l'enregistrement utilisateur
      if (data.user) {
        await createUserRecord(data.user, supabase)
      }

      // Traiter l'abonnement si sessionId présent
      if (sessionId && data.user) {
        return await processSubscriptionAndRedirect(requestUrl, sessionId, request)
      }

      return NextResponse.redirect(`${requestUrl.origin}/dashboard?welcome=true`)
    } catch (error) {
      console.error("❌ Unexpected error in auth callback:", error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
    }
  }

  // Si pas de code mais sessionId présent, rediriger vers login avec le sessionId
  if (sessionId) {
    console.log("No code provided, redirecting to login with session_id")
    return NextResponse.redirect(`${requestUrl.origin}/login?session_id=${sessionId}&message=complete_subscription`)
  }

  // Aucun code ni sessionId - redirection normale
  console.log("No code or session_id, redirecting to dashboard")
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}

async function createUserRecord(user: any, supabase: any) {
  const userData = user.user_metadata || {}
  const plan = userData.plan || "free"
  const name = userData.name || ""

  console.log("Creating user record with:", { id: user.id, name, plan })

  const planCredits = {
    free: 50,
    pro: 500,
    business: 1500,
  }

  const { error: insertError } = await supabase.from("users").insert({
    id: user.id,
    name: name,
    plan: plan,
    credits: planCredits[plan as keyof typeof planCredits] || 0,
  })

  if (insertError) {
    console.error("❌ Error creating user record:", insertError)
  } else {
    console.log("✅ User record created")
  }
}

async function processSubscriptionAndRedirect(requestUrl: URL, sessionId: string, request: NextRequest) {
  console.log("🔄 Processing pending subscription...")
  console.log("Session ID to process:", sessionId)

  try {
    const response = await fetch(`${requestUrl.origin}/api/process-pending-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify({ sessionId }),
    })

    console.log("API response status:", response.status)
    const result = await response.json()
    console.log("API response:", result)

    if (response.ok) {
      console.log("✅ Subscription processed successfully:", result)
      return NextResponse.redirect(
        `${requestUrl.origin}/dashboard?welcome=true&plan=${result.plan}&credits=${result.credits}`,
      )
    } else {
      console.error("❌ Error processing subscription:", result)
      return NextResponse.redirect(`${requestUrl.origin}/dashboard?welcome=true&error=subscription_failed`)
    }
  } catch (error) {
    console.error("❌ Error calling process-pending-subscription:", error)
    return NextResponse.redirect(`${requestUrl.origin}/dashboard?welcome=true&error=api_failed`)
  }
}
