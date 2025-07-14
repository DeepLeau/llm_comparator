// Stripe Price IDs - remplace par tes vrais IDs depuis ton dashboard Stripe
export const STRIPE_PRICE_IDS = {
  start: "price_1Rkq0iGffKn97RRDLsMgyf5b", // Remplace par ton vrai Price ID
  scale: "price_1Rkq0mGffKn97RRDPnQzD0v1", // Remplace par ton vrai Price ID
}

// Types pour TypeScript
export interface StripeConfig {
  publishableKey: string
  secretKey: string
  webhookSecret: string
}

export interface PricingPlan {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  monthlyPriceId: string
  yearlyPriceId: string
  features: string[]
}
