"use client"

import { useEffect, useState } from "react"
import { Sparkles, Zap } from "lucide-react"

export function PricingHeader() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="text-center mb-20 relative">
      {/* Animated Badge */}
      <div
        className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 backdrop-blur-xl mb-8 transition-all duration-1000 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
        <span className="text-blue-200 font-medium">Transparent Pricing</span>
        <Zap className="w-5 h-5 text-violet-400 animate-bounce" />
      </div>

      {/* Main Title */}
      <h1
        className={`text-5xl md:text-7xl font-black mb-8 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <span className="block text-white mb-4 animate-slide-up">Simple,</span>
        <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent animate-slide-up animation-delay-300">
          Transparent Pricing
        </span>
      </h1>

      {/* Description */}
      <p
        className={`text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        Choose the perfect plan for your LLM benchmarking needs. Test{" "}
        <span className="text-blue-400 font-semibold">GPT-4</span>,{" "}
        <span className="text-violet-400 font-semibold">Claude</span>,{" "}
        <span className="text-blue-300 font-semibold">Mistral</span>, and more with batch prompt testing and smart
        analytics.
      </p>

      {/* Feature Pills */}
      <div
        className={`flex flex-wrap items-center justify-center gap-6 text-sm transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-xl">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-300 font-medium">No setup fees</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 backdrop-blur-xl">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-blue-300 font-medium">Cancel anytime</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 backdrop-blur-xl">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <span className="text-purple-300 font-medium">14-day free trial</span>
        </div>
      </div>
    </div>
  )
}
