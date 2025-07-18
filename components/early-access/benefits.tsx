"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Clock, DollarSign, Rocket, Zap, Target, Shield } from "lucide-react"

export function Benefits() {
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

  const benefits = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Save Time",
      description:
        "Stop wasting hours testing different models manually. Compare 240+ LLMs instantly with your own prompts.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/30",
      delay: "delay-200",
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Reduce Costs",
      description: "Find the most cost-effective models for your use case. Optimize your AI spending by up to 80%.",
      color: "from-emerald-500 to-green-500",
      bgColor: "from-emerald-500/10 to-green-500/10",
      borderColor: "border-emerald-500/30",
      delay: "delay-400",
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Ship Better AI",
      description:
        "Deliver superior AI experiences to your clients with data-driven model selection and performance insights.",
      color: "from-violet-500 to-purple-500",
      bgColor: "from-violet-500/10 to-purple-500/10",
      borderColor: "border-violet-500/30",
      delay: "delay-600",
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Why join the{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">beta?</span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
            Get exclusive early access to the most comprehensive LLM comparison platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className={`relative bg-white/5 backdrop-blur-sm border-white/10 p-8 sm:p-12 hover:bg-white/10 hover:border-white/20 transition-all duration-500 group overflow-hidden transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} ${benefit.delay}`}
            >
              {/* Animated Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${benefit.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Glow Effect */}
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${benefit.color} rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
              />

              {/* Floating Icons */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                {index === 0 && <Zap className="w-6 h-6 text-blue-400 animate-pulse" />}
                {index === 1 && <Target className="w-6 h-6 text-emerald-400 animate-pulse" />}
                {index === 2 && <Shield className="w-6 h-6 text-violet-400 animate-pulse" />}
              </div>

              <div className="relative z-10">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${benefit.color} p-4 mb-8 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-white">{benefit.icon}</div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 group-hover:scale-105 transition-transform duration-300">
                  {benefit.title}
                </h3>

                <p className="text-gray-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                  {benefit.description}
                </p>
              </div>

              {/* Hover Border Effect */}
              <div
                className={`absolute inset-0 rounded-xl border-2 ${benefit.borderColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
