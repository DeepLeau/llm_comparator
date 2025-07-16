"use client"

import { Calendar, User, Clock, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export function BlogHeader() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 relative">
      {/* Animated Badge */}
      <div
        className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 backdrop-blur-xl mb-8 transition-all duration-1000 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
        <span className="text-blue-200 font-medium">Technical Deep Dive</span>
      </div>

      {/* Title */}
      <h1
        className={`text-4xl md:text-6xl font-black mb-8 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <span className="block text-white mb-4 animate-slide-up">Automated Scoring and</span>
        <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent animate-slide-up animation-delay-300">
          Scheduled Benchmarking for LLMs
        </span>
      </h1>

      {/* Subtitle */}
      <p
        className={`text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        How automated evaluation pipelines are revolutionizing LLM selection and monitoring in production environments.
      </p>

      {/* Article Meta */}
      <div
        className={`flex flex-wrap items-center gap-6 text-gray-400 transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          <span>WhichLLMs Team</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-violet-400" />
          <span>July 16, 2025</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-green-400" />
          <span>8 min read</span>
        </div>
      </div>
    </div>
  )
}
