"use client"

import { PricingHeader } from "@/components/pricing/pricing-header"
import { PricingPlans } from "@/components/pricing/pricing-plans"
import { PricingFAQ } from "@/components/pricing/pricing-faq"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <PricingHeader />
        <PricingPlans />
        <PricingFAQ />
      </div>
    </div>
  )
}