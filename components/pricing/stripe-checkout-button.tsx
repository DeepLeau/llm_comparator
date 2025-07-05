"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeCheckoutButtonProps {
  priceId: string
  planType: string
  billingPeriod: string
  children: React.ReactNode
  className?: string
}

export function StripeCheckoutButton({
  priceId,
  planType,
  billingPeriod,
  children,
  className,
}: StripeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setIsLoading(true)

      console.log("Starting checkout process:", { priceId, planType, billingPeriod })

      // Créer la session de checkout
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

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const { sessionId } = await response.json()
      console.log("Checkout session created:", sessionId)

      // Rediriger vers Stripe Checkout
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to load")
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (error) {
        console.error("Stripe redirect error:", error)
        throw error
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      // Vous pouvez ajouter une notification d'erreur ici
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading} className={className} size="lg">
      {isLoading ? (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
          Processing...
        </div>
      ) : (
        children
      )}
    </Button>
  )
}
