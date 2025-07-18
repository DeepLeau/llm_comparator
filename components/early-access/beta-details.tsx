"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Phone, MessageSquare, Gift, Star, Zap } from "lucide-react"

export function BetaDetails() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const includes = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Limited Usage Access",
      description: "500 free tests per month during beta period",
      badge: "Free Credits",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Personal Onboarding Call",
      description: "15-minute 1-on-1 session to optimize your setup",
      badge: "VIP Support",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Direct Feedback Loop",
      description: "Shape the product roadmap with your input",
      badge: "Exclusive",
      color: "from-violet-500 to-purple-500",
    },
  ]

  const bonuses = [
    { icon: <Gift className="w-5 h-5" />, text: "50% lifetime discount", color: "text-emerald-400" },
    { icon: <Star className="w-5 h-5" />, text: "Priority feature requests", color: "text-blue-400" },
    { icon: <Zap className="w-5 h-5" />, text: "Beta tester badge", color: "text-violet-400" },
  ]

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <Badge className="bg-[#201435] text-violet-300 border-violet-500/30 px-6 py-3 text-lg font-bold mb-8 hover:scale-110 hover:bg-[#201435] transition-transform duration-300">
            Beta Program Details
          </Badge>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            What's{" "}
            <span className="bg-gradient-to-r from-violet-400 to-rose-400 bg-clip-text text-transparent">
              included?
            </span>
          </h2>

          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
            Get exclusive access to premium features and personalized support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {includes.map((item, index) => (
            <Card
              key={index}
              className={`relative bg-white/5 backdrop-blur-sm border-white/10 p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 group transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} p-3 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <Badge className={`bg-gradient-to-r ${item.color} text-white border-white/20 px-3 py-1 text-sm`}>
                    {item.badge}
                  </Badge>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:scale-105 transition-transform duration-300">
                  {item.title}
                </h3>

                <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
