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
  FlaskConical,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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
    price: "$0",
    priceDetail: "for 7 days",
    description: "Perfect for getting started with LLM evaluation",
    testLimit: "50 scorings/month",
    modelAccess: "Open-source models only",
    credits: 50,
    features: [
      { text: "50 scorings", included: true, icon: Zap },
      { text: "Manual trigger", included: true, icon: Shield },
      { text: "Basic dashboard", included: true, icon: BarChart3 },
      { text: "3 tests per batch", included: true, icon: FlaskConical },
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
    price: "$29.99",
    priceDetail: "per month",
    description: "Ideal for individual developers and small teams",
    testLimit: "500 scorings/month",
    modelAccess: "All models including premium",
    credits: 500,
    stripePriceId: "price_1Rkq0iGffKn97RRDLsMgyf5b",
    features: [
      { text: "500 scorings", included: true, icon: Zap, highlight: true },
      { text: "Manual trigger", included: true, icon: Shield },
      { text: "Test history", included: true, icon: BarChart3 },
      { text: "10 tests per batch", included: true, icon: FlaskConical },
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
    price: "$79.99",
    priceDetail: "per month",
    description: "Complete solution for growing teams and businesses",
    testLimit: "1,500 scorings/month",
    modelAccess: "All models + extended history",
    credits: 1500,
    stripePriceId: "price_1Rkq0mGffKn97RRDPnQzD0v1",
    features: [
      { text: "1,500 scorings", included: true, icon: Zap, highlight: true },
      { text: "Manual trigger", included: true, icon: Shield },
      { text: "Test history", included: true, icon: BarChart3 },
      { text: "50 tests per batch", included: true, icon: FlaskConical },
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
      { text: "Custom tests per batch", included: true, icon: FlaskConical },
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
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const section = document.getElementById("pricing-plans")
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  const getAccentClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          border: "border-blue-500/30 hover:border-blue-400/50",
          button: "border-blue-500/50 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400/70",
          icon: "text-blue-400",
          badge: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30",
          glow: "hover:shadow-blue-500/20",
        }
      case "green":
        return {
          border: "border-green-500/30 hover:border-green-400/50",
          button:
            "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/25",
          icon: "text-green-400",
          badge: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30",
          glow: "hover:shadow-green-500/20",
        }
      case "yellow":
        return {
          border: "border-yellow-500/30 hover:border-yellow-400/50",
          button:
            "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 shadow-lg shadow-yellow-500/25",
          icon: "text-yellow-400",
          badge: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30",
          glow: "hover:shadow-yellow-500/20",
        }
      case "purple":
        return {
          border: "border-purple-500/30 hover:border-purple-400/50",
          button: "border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400/70",
          icon: "text-purple-400",
          badge: "bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300 border-purple-500/30",
          glow: "hover:shadow-purple-500/20",
        }
      default:
        return {
          border: "border-white/20 hover:border-white/30",
          button: "border-white/20 text-white hover:bg-white/10",
          icon: "text-white",
          badge: "bg-white/20 text-white border-white/30",
          glow: "hover:shadow-white/10",
        }
    }
  }

  const handlePlanSelection = async (plan: PricingPlan) => {
    if (plan.id === "free") {
      router.push(`/signup?plan=${plan.id}`)
    } else if (plan.id === "enterprise") {
      window.location.href = "/contact?type=enterprise"
    } else if (plan.stripePriceId) {
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
          router.push(`/signup?plan=${plan.id}`)
        }
      } catch (error) {
        console.error("Error creating checkout session:", error)
        router.push(`/signup?plan=${plan.id}`)
      }
    }
  }

  return (
    <div id="pricing-plans" className="mb-20">
      {/* Container avec espace pour le badge qui saute */}
      <div className="pt-8 pb-4">
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const accentClasses = getAccentClasses(plan.accentColor)
            const isScale = plan.id === "scale"

            return (
              <div key={plan.id} className="relative">
                {/* Popular Badge - Positionné au-dessus de la card */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-50">
                    <Badge
                      className={`px-4 py-2 bg-gradient-to-r from-yellow-500/95 to-orange-500/95 text-white border-2 border-yellow-400/60 backdrop-blur-xl shadow-2xl shadow-yellow-500/40 animate-bounce font-semibold whitespace-nowrap`}
                    >
                      <Star className="w-4 h-4 mr-1 text-yellow-200 animate-spin-slow" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <Card
                  className={`group relative p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border backdrop-blur-xl transition-all duration-500 rounded-2xl ${
                    isScale
                      ? "scale-105 shadow-2xl shadow-yellow-500/20 ring-2 ring-yellow-500/30 border-yellow-500/40"
                      : `${accentClasses.border} hover:scale-105 shadow-xl ${accentClasses.glow}`
                  } ${isVisible ? "animate-slide-up" : "opacity-0 translate-y-8"}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Animated Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                          {plan.name}
                        </h3>
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          {plan.emoji}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-6 group-hover:text-gray-300 transition-colors leading-relaxed">
                        {plan.description}
                      </p>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-black text-white group-hover:text-blue-300 transition-colors">
                            {plan.price}
                          </span>
                          <span className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors">
                            {plan.priceDetail}
                          </span>
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div className="space-y-3 mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-xl border border-blue-500/20 group-hover:border-blue-400/30 transition-colors duration-300">
                        <div className="text-sm text-gray-300 group-hover:text-white transition-colors">
                          <span className="font-semibold text-white">{plan.testLimit}</span>
                        </div>
                        <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                          {plan.modelAccess}
                        </div>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 transition-all duration-300 ${
                              feature.included
                                ? "bg-green-500/20 group-hover:bg-green-500/30 group-hover:scale-110"
                                : "bg-red-500/20"
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
                                className={`w-4 h-4 mt-0.5 transition-colors duration-300 ${
                                  feature.included ? "text-gray-300 group-hover:text-white" : "text-gray-500"
                                }`}
                              />
                            )}
                            <span
                              className={`text-sm leading-relaxed transition-colors duration-300 ${
                                feature.included
                                  ? feature.highlight
                                    ? "text-white font-medium group-hover:text-blue-300"
                                    : "text-gray-300 group-hover:text-white"
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
                      className={`w-full font-semibold rounded-xl transition-all duration-300 hover:scale-105 ${accentClasses.button} ${
                        plan.buttonVariant === "outline" ? "bg-transparent" : ""
                      }`}
                    >
                      {plan.buttonText}
                    </Button>

                    {/* Additional Info for Enterprise Plan */}
                    {plan.id === "enterprise" && (
                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                          Custom pricing available for enterprise needs
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      {/* Additional Info */}
      <div className="text-center mt-16 space-y-6">
        <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
          All plans include secure data handling • Cancel anytime • 14-day free trial on paid plans
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 text-xs">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 backdrop-blur-xl">
            <Shield className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-blue-300">SOC 2 Compliant</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-xl">
            <Clock className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-green-300">99.9% Uptime SLA</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 backdrop-blur-xl">
            <Database className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-purple-300">Data Export Available</span>
          </div>
        </div>
      </div>
    </div>
  )
}
