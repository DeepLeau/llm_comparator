"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { supabase } from "@/lib/supabase"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeCheckoutButtonProps {
  priceId: string
  planType: string
  billingPeriod: "monthly" | "yearly"
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export function StripeCheckoutButton({
  priceId,
  planType,
  billingPeriod,
  children,
  className,
  disabled = false,
}: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setLoading(true)
      console.log("=== CHECKOUT BUTTON DEBUG ===")
      console.log("Price ID:", priceId)
      console.log("Plan Type:", planType)
      console.log("Billing Period:", billingPeriod)

      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to load")
      }
      console.log("✅ Stripe loaded successfully")

      // Vérifier si l'utilisateur est connecté
      const {
        data: { user },
      } = await supabase.auth.getUser()
      console.log("User authenticated:", !!user)

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          planType,
          billingPeriod,
        }),
      })

      const data = await response.json()
      console.log("API Response:", data)

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.sessionId) {
        throw new Error("No session ID returned")
      }

      console.log("✅ Session created:", data.sessionId)

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }
    } catch (error) {
      console.error("❌ Checkout error:", error)
      alert(`Erreur: ${error instanceof Error ? error.message : "Une erreur est survenue"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={disabled || loading} className={className}>
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  )
}
