"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Check,
  Star,
  Zap,
  Building,
  X,
  BarChart3,
  Clock,
  Shield,
  Mail,
  Phone,
  Database,
  Sparkles,
  TestTube,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface PricingPlan {
  id: string
  name: string
  emoji: string
  price: string
  priceDetail: string
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
  stripePriceId?: string
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
    name: "Free Trial",
    emoji: "🧪",
    price: "€0",
    priceDetail: "for 7 days",
    description: "Perfect for getting started with LLM evaluation",
    testLimit: "50 scorings/month",
    modelAccess: "Open-source models only",
    credits: 50,
    features: [
      { text: "50 scorings", included: true, icon: Zap },
      { text: "Manual trigger", included: true, icon: Shield },
      { text: "Basic dashboard", included: true, icon: BarChart3 },
      { text: "Summary emails", included: false, icon: X },
      { text: "Queue priority", included: false, icon: X },
      { text: "Routing API access", included: false, icon: X },
      { text: "AI automations", included: false, icon: X },
      { text: "Support", included: false, icon: X },
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "outline",
    accentColor: "blue",
    icon: TestTube,
    bgGradient: "from-blue-500/10 to-blue-600/5",
  },
  {
    id: "start",
    name: "Start",
    emoji: "🟢",
    price: "€29.99",
    priceDetail: "per month",
    description: "Ideal for individual developers and small teams",
    testLimit: "500 scorings/month",
    modelAccess: "All models including premium",
    credits: 500,
    stripePriceId: "price_1RixTrGffKn97RRDKSYDuywj",
    features: [
      { text: "500 scorings", included: true, icon: Zap, highlight: true },
      { text: "Manual trigger", included: true, icon: Shield },
      { text: "Test history", included: true, icon: BarChart3 },
      { text: "Summary emails", included: false, icon: X },
      { text: "Queue priority", included: false, icon: X },
      { text: "Routing API access", included: false, icon: X },
      { text: "AI automations", included: false, icon: X },
      { text: "Standard email support", included: true, icon: Mail },
    ],
    buttonText: "Choose Start Plan",
    buttonVariant: "default",
    accentColor: "green",
    icon: Zap,
    bgGradient: "from-green-500/10 to-green-600/5",
  },
  {
    id: "scale",
    name: "Scale",
    emoji: "🟡",
    price: "€79.99",
    priceDetail: "per month",
    description: "Complete solution for growing teams and businesses",
    testLimit: "1,500 scorings/month",
    modelAccess: "All models + extended history",
    credits: 1500,
    stripePriceId: "price_1RixEiGffKn97RRDrqTLy46a",
    features: [
      { text: "1,500 scorings", included: true, icon: Zap, highlight: true },
      { text: "Manual trigger", included: true, icon: Shield },
      { text: "Test history", included: true, icon: BarChart3 },
      { text: "Weekly summary emails", included: true, icon: Mail, highlight: true },
      { text: "Medium queue priority", included: true, icon: Clock },
      { text: "Routing API access", included: false, icon: X },
      { text: "AI automations", included: false, icon: X },
      { text: "Priority email support", included: true, icon: Mail },
    ],
    buttonText: "Choose Scale Plan",
    buttonVariant: "default",
    popular: true,
    accentColor: "yellow",
    icon: Star,
    bgGradient: "from-yellow-500/10 to-yellow-600/5",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    emoji: "🔵",
    price: "Custom",
    priceDetail: "pricing",
    description: "Advanced automation and dedicated support for enterprises",
    testLimit: "Custom volume",
    modelAccess: "All models + API access",
    credits: 0,
    features: [
      { text: "Custom scoring volume", included: true, icon: Zap, highlight: true },
      { text: "Automated testing", included: true, icon: Clock, highlight: true },
      { text: "Test history", included: true, icon: Database, highlight: true },
      { text: "Custom frequency emails", included: true, icon: Mail },
      { text: "Maximum queue priority", included: true, icon: Sparkles },
      { text: "Full routing API access", included: true, icon: Database, highlight: true },
      { text: "Intelligent routing", included: true, icon: Building, highlight: true },
      { text: "Dedicated Slack", included: true, icon: Phone, highlight: true },
    ],
    buttonText: "Contact Us",
    buttonVariant: "outline",
    accentColor: "purple",
    icon: Building,
    bgGradient: "from-purple-500/10 to-purple-600/5",
  },
]

export function PricingPlans() {
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
      case "green":
        return {
          border: "border-green-500/30",
          button: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
          icon: "text-green-400",
          badge: "bg-green-500/20 text-green-300 border-green-500/30",
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

  const handlePlanSelection = async (plan: PricingPlan) => {
    if (plan.id === "free") {
      router.push(`/signup?plan=${plan.id}`)
    } else if (plan.id === "enterprise") {
      window.location.href = "/contact?type=enterprise"
    } else if (plan.stripePriceId) {
      // Redirect to Stripe Checkout for paid plans
      try {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId: plan.stripePriceId,
            planType: plan.id,
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const { url } = await response.json()

        if (url) {
          window.location.href = url
        } else {
          console.error("No checkout URL received")
          // Fallback: redirect to signup with plan info
          router.push(`/signup?plan=${plan.id}`)
        }
      } catch (error) {
        console.error("Error creating checkout session:", error)
        // Fallback: redirect to signup with plan info
        router.push(`/signup?plan=${plan.id}`)
      }
    }
  }

  return (
    <div className="mb-20">
      <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const accentClasses = getAccentClasses(plan.accentColor)
          const isScale = plan.id === "scale"

          return (
            <Card
              key={plan.id}
              className={`relative p-8 bg-gradient-to-br ${plan.bgGradient} via-white/5 to-transparent border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 ${
                isScale ? "scale-105 shadow-2xl shadow-yellow-500/10 ring-2 ring-yellow-500/20" : "hover:scale-105"
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
                {/* Plan Name with Emoji - No Icon Container */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <span className="text-2xl">{plan.emoji}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 text-lg">{plan.priceDetail}</span>
                  </div>
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
                    <div className="flex items-start gap-2 flex-1">
                      {feature.icon && (
                        <feature.icon
                          className={`w-4 h-4 mt-0.5 ${feature.included ? "text-gray-300" : "text-gray-500"}`}
                        />
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
              <Button
                onClick={() => handlePlanSelection(plan)}
                variant={plan.buttonVariant}
                size="lg"
                className={`w-full font-semibold rounded-xl transition-all duration-300 ${accentClasses.button} ${
                  plan.buttonVariant === "outline" ? "bg-transparent hover:scale-105" : ""
                }`}
              >
                {plan.buttonText}
              </Button>

              {/* Additional Info for Enterprise Plan */}
              {plan.id === "enterprise" && (
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
