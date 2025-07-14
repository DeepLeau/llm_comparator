"use client"

import { Card } from "@/components/ui/card"
import { AlertTriangle, Clock, DollarSign, TrendingDown, Zap, ArrowRight, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

const problems = [
  {
    icon: Clock,
    title: "Hours of Research",
    description: "Developers waste 40+ hours researching which AI model to use",
    stat: "40hrs",
    impact: "Time Lost",
  },
  {
    icon: DollarSign,
    title: "Expensive Mistakes",
    description: "Wrong model choice costs companies $50K+ in wasted API calls",
    stat: "$50K+",
    impact: "Money Wasted",
  },
  {
    icon: TrendingDown,
    title: "Bad First Impressions",
    description: "A slow or inaccurate AI assistant can cut conversions by up to 27%",
    stat: "-27%",
    impact: "Conversion Drop",
  },
]

export function ProblemSection() {
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

    const section = document.getElementById("problem-section")
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="problem-section" className="py-32 px-6 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-red-600/10 to-orange-600/10 rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-gradient-to-r from-orange-600/10 to-red-600/10 rounded-full blur-3xl animate-float-slow" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 backdrop-blur-xl mb-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="text-red-200 font-medium">The Problem</span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-red-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>

          <h2
            className={`text-5xl md:text-7xl font-black mb-8 text-white transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="block animate-slide-up">AI Model Selection is</span>
            <span className="block text-red-400 animate-slide-up animation-delay-300">Broken</span>
          </h2>

          <p
            className={`text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Every day, thousands of developers make costly decisions about AI models based on{" "}
            <span className="text-red-400 font-semibold animate-pulse">incomplete information</span> and{" "}
            <span className="text-orange-400 font-semibold animate-pulse">marketing hype</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {problems.map((problem, index) => (
            <Card
              key={problem.title}
              className={`group p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-red-500/20 backdrop-blur-xl hover:border-red-400/40 transition-all duration-500 hover:scale-105 rounded-2xl overflow-hidden relative ${isVisible ? "animate-slide-up" : "opacity-0 translate-y-8"}`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-red-500/30">
                  <problem.icon className="w-8 h-8 text-red-400 group-hover:animate-pulse" />
                </div>

                <div className="mb-4">
                  <div className="text-4xl font-black text-red-400 mb-2 group-hover:animate-bounce">{problem.stat}</div>
                  <div className="text-xs text-red-300/70 mb-2 uppercase tracking-wider">{problem.impact}</div>
                  <h3 className="text-xl font-bold text-white group-hover:text-red-300 transition-colors">
                    {problem.title}
                  </h3>
                </div>

                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {problem.description}
                </p>

                {/* Animated Progress Bar */}
                <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-progress-bar" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced Transition Element */}
        <div className="text-center">
          <div
            className={`relative max-w-2xl mx-auto ${isVisible ? "animate-fade-in animation-delay-800" : "opacity-0"}`}
          >
            {/* Animated Background Orb */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-violet-600/10 rounded-3xl blur-xl animate-pulse-slow" />

            {/* Main Content */}
            <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-gradient-to-r from-blue-500/20 to-violet-500/20">
              {/* Floating Elements */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-bounce" />
              <div className="absolute -top-1 -right-3 w-3 h-3 bg-violet-400 rounded-full animate-bounce animation-delay-300" />
              <div className="absolute -bottom-2 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-bounce animation-delay-500" />

              {/* Content */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 animate-spin-slow">
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent flex-1" />
                  <div className="text-blue-400 text-sm font-medium animate-pulse">SOLUTION AHEAD</div>
                  <div className="h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent flex-1" />
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-violet-500/30 animate-spin-slow">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-blue-300 to-violet-300 bg-clip-text text-transparent">
                  What if there was a smarter way?
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Imagine making AI model decisions in seconds, not weeks.
                  <span className="text-blue-400 font-semibold"> The future is here.</span>
                </p>

                {/* Animated Arrow */}
                <div className="mt-6 flex justify-center">
                  <div className="animate-bounce">
                    <ArrowRight className="w-6 h-6 text-blue-400 rotate-90" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}