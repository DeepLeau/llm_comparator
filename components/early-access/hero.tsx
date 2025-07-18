"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Crown, Sparkles } from "lucide-react"

export function Hero() {
  const [seatsLeft, setSeatsLeft] = useState(47)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    // Simulate real-time seat counter
    const interval = setInterval(() => {
      setSeatsLeft((prev) => {
        const change = Math.random() > 0.7 ? -1 : 0
        return Math.max(30, prev + change)
      })
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const scrollToForm = () => {
    document.getElementById("access-form")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-float">
        <Zap className="w-8 h-8 text-blue-400" />
      </div>
      <div className="absolute top-32 right-16 opacity-15 animate-float-delayed">
        <Crown className="w-12 h-12 text-violet-400" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-25 animate-float-slow">
        <Sparkles className="w-6 h-6 text-emerald-400" />
      </div>

      <div className="max-w-6xl mx-auto text-center">
        {/* Limited Seats Badge */}
        <div
          className={`transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <Badge className="bg-[#361e22] text-red-300 border-red-500/30 px-6 py-3 text-lg font-bold mb-8 hover:scale-110 hover:bg-[#361e22] transition-transform duration-300 shadow-lg shadow-red-500/25">
            <Crown className="w-5 h-5 mr-2 animate-pulse" />
            Only 46 seats left
          </Badge>
        </div>

        {/* Main Headline */}
        <div
          className={`transform transition-all duration-1000 delay-200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-8 leading-tight hover:scale-105 transition-transform duration-500">
            Join the{" "}
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-rose-400 bg-clip-text text-transparent">
              private beta
            </span>
          </h1>

          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Compare{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              240+ LLMs
            </span>{" "}
            on your own prompts
          </p>
        </div>

        {/* Subheading */}
        <div
          className={`transform transition-all duration-1000 delay-400 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Save time. Cut costs. Deliver better AI to your clients.
          </p>
        </div>

        {/* CTA Button */}
        <div
          className={`transform transition-all duration-1000 delay-600 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <Button
            onClick={scrollToForm}
            className="bg-gradient-to-r from-blue-600 via-violet-600 to-rose-600 hover:from-blue-700 hover:via-violet-700 hover:to-rose-700 text-white px-12 py-6 text-xl font-bold rounded-2xl hover:scale-110 transition-all duration-300 shadow-2xl shadow-blue-500/25 group"
          >
            Request Access
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
        </div>

        {/* Stats */}
        <div
          className={`mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 transform transition-all duration-1000 delay-800 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          {[
            { number: "240+", label: "LLM Models", color: "from-blue-400 to-cyan-400" },
            { number: "Fast", label: "Optimized response", color: "from-violet-400 to-purple-400" },
            { number: "99.9%", label: "Uptime SLA", color: "from-emerald-400 to-green-400" },
          ].map((stat, index) => (
            <div key={index} className="group hover:scale-110 transition-transform duration-300">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div
                  className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                >
                  {stat.number}
                </div>
                <div className="text-gray-300 text-lg font-medium group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
