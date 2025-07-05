// Stripe Price IDs - remplace par tes vrais IDs depuis ton dashboard Stripe
export const STRIPE_PRICE_IDS = {
  pro_monthly: "prod_ScolB9FUTEA1tl", // Remplace par ton vrai Price ID
  pro_yearly: "prod_ScpCDPTqN1pkZv", // Remplace par ton vrai Price ID
  business_monthly: "prod_SconNe3s2bB3WW", // Remplace par ton vrai Price ID
  business_yearly: "prod_ScpDVkf8THJJfu", // Remplace par ton vrai Price ID
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
