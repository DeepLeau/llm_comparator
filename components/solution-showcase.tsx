"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Zap, Target, Shield, ArrowRight, Sparkles, Star } from "lucide-react"
import { useEffect, useState } from "react"

const solutions = [
  {
    icon: Zap,
    title: "Instant Comparison",
    description: "Test 300+ models simultaneously in seconds",
    benefit: "Save 40+ hours of research",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Target,
    title: "Smart Recommendations",
    description: "AI-powered analysis finds the perfect model for your use case",
    benefit: "Eliminate guesswork completely",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Real-Time Benchmarks",
    description: "Up-to-date model tests, not marketing hype or outdated reviews",
    benefit: "Decide with facts, not fiction",
    color: "from-blue-600 to-violet-600",
  },
]

export function SolutionShowcase() {
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

    const section = document.getElementById("solution-section")
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="solution-section" className="py-32 px-6 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/15 to-violet-600/15 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-violet-600/15 to-blue-600/15 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 backdrop-blur-xl mb-8 transition-all duration-1000 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Star className="w-5 h-5 text-blue-400 animate-spin-slow" />
            <span className="text-blue-200 font-medium">The Solution</span>
            <CheckCircle className="w-5 h-5 text-violet-400 animate-pulse" />
          </div>

          <h2
            className={`text-5xl md:text-7xl font-black mb-8 text-white transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="block animate-slide-up">Meet Your AI</span>
            <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent animate-slide-up animation-delay-300">
              Decision Engine
            </span>
          </h2>

          <p
            className={`text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            LLM Comparator eliminates the guesswork with{" "}
            <span className="text-blue-400 font-semibold animate-pulse">real-time testing</span>,{" "}
            <span className="text-violet-400 font-semibold animate-pulse">intelligent analysis</span>, and{" "}
            <span className="text-blue-300 font-semibold animate-pulse">actionable recommendations</span>.
          </p>
        </div>

        {/* Solution Cards with Stagger Animation */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {solutions.map((solution, index) => (
            <Card
              key={solution.title}
              className={`group p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-blue-500/20 backdrop-blur-xl hover:border-blue-400/40 transition-all duration-500 hover:scale-105 rounded-2xl overflow-hidden relative ${isVisible ? "animate-slide-up" : "opacity-0 translate-y-8"}`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Animated Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Floating Particles */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-blue-400/50 rounded-full animate-float"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${20 + i * 10}%`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${solution.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
                >
                  <solution.icon className="w-8 h-8 text-white group-hover:animate-pulse" />
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                  {solution.title}
                </h3>

                <p className="text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {solution.description}
                </p>

                <div className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-xl p-4 border border-blue-500/20 group-hover:border-blue-400/30 transition-colors duration-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span className="text-blue-300 text-sm font-medium">{solution.benefit}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced Before/After Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Before */}
          <Card
            className={`p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-red-500/20 backdrop-blur-xl rounded-2xl hover:scale-105 transition-all duration-500 group ${isVisible ? "animate-slide-right" : "opacity-0 translate-x-8"}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span className="text-red-400 font-bold">✗</span>
              </div>
              <h3 className="text-2xl font-bold text-red-300">Before LLM Comparator</h3>
            </div>
            <ul className="space-y-4">
              {[
                "Spend weeks researching models",
                "Read biased marketing materials",
                "Make expensive wrong choices",
                "Waste time on trial and error",
                "Constantly track new models & updates",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-gray-400 group-hover:text-gray-300 transition-colors"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          {/* After */}
          <Card
            className={`p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-blue-500/20 backdrop-blur-xl rounded-2xl hover:scale-105 transition-all duration-500 group ${isVisible ? "animate-slide-left" : "opacity-0 translate-x-8"}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-blue-300">With LLM Comparator</h3>
            </div>
            <ul className="space-y-4">
              {[
                "Get results in seconds",
                "See real performance data",
                "Make confident decisions",
                "Start building immediately",
                "Always up-to-date, we add the latest models for you",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-gray-300 group-hover:text-white transition-colors"
                >
                  <CheckCircle className="w-5 h-5 text-blue-400 animate-pulse" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Animated CTA */}
        <div className="text-center">
          <Button
            size="lg"
            className={`group relative bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 overflow-hidden ${isVisible ? "animate-bounce-in animation-delay-1000" : "opacity-0"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
            <Sparkles className="mr-3 w-6 h-6 group-hover:animate-spin" />
            See It In Action
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  )
}
