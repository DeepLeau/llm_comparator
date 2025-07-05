"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeCheckoutButtonProps {
  priceId: string
  planType: string
  billingPeriod: "monthly" | "yearly"
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

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Rediriger vers Stripe Checkout
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to load")
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading} className={className}>
      {isLoading ? "Loading..." : children}
    </Button>
  )
}
