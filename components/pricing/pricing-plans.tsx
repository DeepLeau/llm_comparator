"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { StripeCheckoutButton } from "./stripe-checkout-button"
import {
  Check,
  Star,
  Zap,
  Building,
  X,
  Users,
  BarChart3,
  Clock,
  Shield,
  Mail,
  Phone,
  Database,
  Download,
  History,
  Sparkles,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Price IDs - remplace par tes vrais IDs Stripe
const STRIPE_PRICE_IDS = {
  pro_monthly: "price_1RhZ8OGffKn97RRDrfcJkRji", // Remplace par ton vrai Price ID
  pro_yearly: "price_1RhZYAGffKn97RRDilMbCpJ1", // Remplace par ton vrai Price ID
  business_monthly: "price_1RhZ9TGffKn97RRDgoGudWxM", // Remplace par ton vrai Price ID
  business_yearly: "price_1RhZYsGffKn97RRDXkTwoE7s", // Remplace par ton vrai Price ID
}

interface PricingPlan {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  monthlyPriceId: string
  yearlyPriceId: string
  description: string
  features: PricingFeature[]
  buttonText: string
  buttonVariant: "default" | "outline" | "secondary"
  popular?: boolean
  accentColor: string
  icon: any
  bgGradient: string
  testLimit: string
  modelAccess: string
  credits: number
}

interface PricingFeature {
  text: string
  included: boolean
  icon?: any
  highlight?: boolean
}

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyPriceId: "",
    yearlyPriceId: "",
    description: "Perfect for getting started with LLM benchmarking",
    testLimit: "50 tests/month",
    modelAccess: "Open-source models only",
    credits: 50,
    features: [
      { text: "50 tests per month", included: true, icon: Zap },
      { text: "Open-source models only", included: true, icon: Shield },
      { text: "Basic interface access", included: true, icon: Check },
      { text: "Community support", included: true, icon: Users },
      { text: "No credit rollover", included: false, icon: X },
      { text: "Premium models (GPT-4, Claude)", included: false, icon: X },
      { text: "Test history", included: false, icon: X },
      { text: "Smart scoring", included: false, icon: X },
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline",
    accentColor: "blue",
    icon: Zap,
    bgGradient: "from-blue-500/10 to-blue-600/5",
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 39.99,
    yearlyPrice: 399.99,
    monthlyPriceId: STRIPE_PRICE_IDS.pro_monthly,
    yearlyPriceId: STRIPE_PRICE_IDS.pro_yearly,
    description: "Ideal for professionals and growing teams",
    testLimit: "500 tests/month",
    modelAccess: "All models including premium",
    credits: 500,
    features: [
      { text: "500 tests per month", included: true, icon: Zap, highlight: true },
      { text: "Access to premium models", included: true, icon: Sparkles, highlight: true },
      { text: "GPT-4, Claude, Gemini Pro", included: true, icon: Check },
      { text: "Smart scoring with metrics", included: true, icon: BarChart3, highlight: true },
      { text: "Save and view test history", included: true, icon: History },
      { text: "Credit rollover (1 month)", included: true, icon: Clock },
      { text: "Email support", included: true, icon: Mail },
      { text: "Advanced analytics", included: false, icon: X },
      { text: "API access", included: false, icon: X },
      { text: "Multi-user access", included: false, icon: X },
    ],
    buttonText: "Start Pro Trial",
    buttonVariant: "default",
    popular: true,
    accentColor: "yellow",
    icon: Star,
    bgGradient: "from-yellow-500/10 to-yellow-600/5",
  },
  {
    id: "business",
    name: "Business",
    monthlyPrice: 99.99,
    yearlyPrice: 999.99,
    monthlyPriceId: STRIPE_PRICE_IDS.business_monthly,
    yearlyPriceId: STRIPE_PRICE_IDS.business_yearly,
    description: "Complete solution for teams and enterprises",
    testLimit: "1,500 tests/month",
    modelAccess: "All models + API access",
    credits: 1500,
    features: [
      { text: "1,500 tests per month", included: true, icon: Zap, highlight: true },
      { text: "All Pro features included", included: true, icon: Check },
      { text: "Multi-user team dashboard", included: true, icon: Users, highlight: true },
      { text: "API access for automation", included: true, icon: Database, highlight: true },
      { text: "Advanced analytics & export", included: true, icon: Download, highlight: true },
      { text: "Priority support", included: true, icon: Phone, highlight: true },
      { text: "Custom integrations", included: true, icon: Building },
      { text: "Dedicated account manager", included: true, icon: Users },
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline",
    accentColor: "purple",
    icon: Building,
    bgGradient: "from-purple-500/10 to-purple-600/5",
  },
]

export function PricingPlans() {
  const [isYearly, setIsYearly] = useState(false)
  const router = useRouter()

  const getAccentClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          border: "border-blue-500/30",
          button: "border-blue-500/50 text-blue-300 hover:bg-blue-500/10",
          icon: "text-blue-400",
          badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        }
      case "yellow":
        return {
          border: "border-yellow-500/30",
          button: "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700",
          icon: "text-yellow-400",
          badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
        }
      case "purple":
        return {
          border: "border-purple-500/30",
          button: "border-purple-500/50 text-purple-300 hover:bg-purple-500/10",
          icon: "text-purple-400",
          badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        }
      default:
        return {
          border: "border-white/20",
          button: "border-white/20 text-white hover:bg-white/10",
          icon: "text-white",
          badge: "bg-white/20 text-white border-white/30",
        }
    }
  }

  const handlePlanSelection = (planId: string) => {
    if (planId === "free") {
      router.push(`/signup?plan=${planId}`)
    } else if (planId === "business") {
      window.location.href = "/contact?type=business"
    }
    // For pro plan, the StripeCheckoutButton will handle the checkout
  }

  const formatPrice = (plan: PricingPlan) => {
    if (plan.monthlyPrice === 0) return "$0"
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
    const monthlyEquivalent = isYearly ? plan.yearlyPrice / 12 : plan.monthlyPrice
    return isYearly ? `$${monthlyEquivalent.toFixed(2)}/mo` : `$${price}/mo`
  }

  const getYearlySavings = (plan: PricingPlan) => {
    if (plan.monthlyPrice === 0) return 0
    const yearlyTotal = plan.monthlyPrice * 12
    const savings = yearlyTotal - plan.yearlyPrice
    return Math.round(savings)
  }

  return (
    <div className="mb-20">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-4 p-1 bg-gray-800/50 rounded-lg border border-gray-700">
          <Label
            htmlFor="billing-toggle"
            className={`px-4 py-2 rounded-md cursor-pointer transition-all ${!isYearly ? "bg-white/10 text-white" : "text-gray-400"}`}
          >
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-green-600"
          />
          <Label
            htmlFor="billing-toggle"
            className={`px-4 py-2 rounded-md cursor-pointer transition-all flex items-center gap-2 ${isYearly ? "bg-white/10 text-white" : "text-gray-400"}`}
          >
            Yearly
            <Badge className="bg-green-600/20 text-green-300 border-green-600/30 text-xs">2 months free</Badge>
          </Label>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const accentClasses = getAccentClasses(plan.accentColor)
          const isPro = plan.id === "pro"
          const yearlySavings = getYearlySavings(plan)
          const priceId = isYearly ? plan.yearlyPriceId : plan.monthlyPriceId

          return (
            <Card
              key={plan.id}
              className={`relative p-8 bg-gradient-to-br ${plan.bgGradient} via-white/5 to-transparent border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 ${
                isPro ? "scale-105 shadow-2xl shadow-yellow-500/10 ring-2 ring-yellow-500/20" : "hover:scale-105"
              } ${accentClasses.border}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className={`px-4 py-1 ${accentClasses.badge}`}>⭐ Most Popular</Badge>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center`}>
                  <plan.icon className={`w-8 h-8 ${accentClasses.icon}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">{formatPrice(plan)}</span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-gray-400 text-lg">{isYearly ? " billed annually" : " per month"}</span>
                    )}
                  </div>
                  {isYearly && yearlySavings > 0 && (
                    <div className="text-green-400 text-sm mt-1">Save ${yearlySavings}/year</div>
                  )}
                </div>
                {/* Key Metrics */}
                <div className="space-y-2 mb-6 p-4 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-300">
                    <span className="font-medium text-white">{plan.testLimit}</span>
                  </div>
                  <div className="text-xs text-gray-400">{plan.modelAccess}</div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                        feature.included ? "bg-green-500/20" : "bg-red-500/20"
                      }`}
                    >
                      {feature.included ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <X className="w-3 h-3 text-red-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      {feature.icon && (
                        <feature.icon className={`w-4 h-4 ${feature.included ? "text-gray-300" : "text-gray-500"}`} />
                      )}
                      <span
                        className={`text-sm leading-relaxed ${
                          feature.included
                            ? feature.highlight
                              ? "text-white font-medium"
                              : "text-gray-300"
                            : "text-gray-500 line-through"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              {plan.id === "free" ? (
                <Button
                  onClick={() => handlePlanSelection(plan.id)}
                  variant={plan.buttonVariant}
                  size="lg"
                  className={`w-full font-semibold rounded-xl transition-all duration-300 ${accentClasses.button} bg-transparent hover:scale-105`}
                >
                  {plan.buttonText}
                </Button>
              ) : plan.id === "business" ? (
                <Button
                  onClick={() => handlePlanSelection(plan.id)}
                  variant={plan.buttonVariant}
                  size="lg"
                  className={`w-full font-semibold rounded-xl transition-all duration-300 ${accentClasses.button} bg-transparent hover:scale-105`}
                >
                  {plan.buttonText}
                </Button>
              ) : (
                <StripeCheckoutButton
                  priceId={priceId}
                  planType={plan.id}
                  billingPeriod={isYearly ? "yearly" : "monthly"}
                  className={`w-full font-semibold rounded-xl transition-all duration-300 ${
                    plan.buttonVariant === "default"
                      ? accentClasses.button
                      : `${accentClasses.button} bg-transparent hover:scale-105`
                  }`}
                >
                  {plan.buttonText}
                </StripeCheckoutButton>
              )}

              {/* Additional Info for Business Plan */}
              {plan.id === "business" && (
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-400">Custom pricing available for enterprise needs</p>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Additional Info */}
      <div className="text-center mt-12 space-y-4">
        <p className="text-gray-400 text-sm">
          All plans include secure data handling • Cancel anytime • 14-day free trial on paid plans
        </p>
        <div className="flex items-center justify-center gap-8 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span>SOC 2 Compliant</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>99.9% Uptime SLA</span>
          </div>
          <div className="flex items-center gap-1">
            <Database className="w-4 h-4" />
            <span>Data Export Available</span>
          </div>
        </div>
      </div>
    </div>
  )
}
