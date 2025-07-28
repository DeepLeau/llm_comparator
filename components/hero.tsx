"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Brain } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

export function Hero() {
  const [mounted, setMounted] = useState(false)
  const [currentModel, setCurrentModel] = useState(0)
  const [typedText, setTypedText] = useState("")

  const models = ["GPT-4", "Claude", "Gemini", "Mistral", "LLaMA"]
  const fullText = "Which AI model is perfect for your project?"

  // Positions fixes pour les particules pour éviter l'erreur d'hydratation
  const particlePositions = [
    { left: 10, top: 20, delay: 0.5, duration: 3 },
    { left: 80, top: 15, delay: 1.2, duration: 4 },
    { left: 25, top: 70, delay: 0.8, duration: 3.5 },
    { left: 90, top: 60, delay: 1.8, duration: 2.5 },
    { left: 15, top: 85, delay: 0.3, duration: 4.2 },
    { left: 70, top: 25, delay: 2.1, duration: 3.8 },
    { left: 45, top: 90, delay: 1.5, duration: 2.8 },
    { left: 85, top: 35, delay: 0.7, duration: 3.2 },
    { left: 30, top: 45, delay: 1.9, duration: 4.5 },
    { left: 60, top: 80, delay: 0.4, duration: 3.7 },
    { left: 5, top: 55, delay: 2.3, duration: 2.9 },
    { left: 95, top: 40, delay: 1.1, duration: 3.4 },
    { left: 40, top: 10, delay: 0.9, duration: 4.1 },
    { left: 75, top: 75, delay: 1.7, duration: 2.6 },
    { left: 20, top: 30, delay: 2.5, duration: 3.9 },
    { left: 65, top: 65, delay: 0.6, duration: 3.3 },
    { left: 35, top: 95, delay: 1.4, duration: 2.7 },
    { left: 88, top: 20, delay: 2.2, duration: 4.3 },
    { left: 12, top: 75, delay: 0.2, duration: 3.6 },
    { left: 55, top: 50, delay: 1.6, duration: 2.4 },
    { left: 78, top: 85, delay: 2.4, duration: 3.1 },
    { left: 22, top: 60, delay: 0.1, duration: 4.4 },
    { left: 92, top: 30, delay: 1.3, duration: 2.3 },
    { left: 48, top: 15, delay: 2.0, duration: 3.8 },
    { left: 8, top: 40, delay: 0.8, duration: 4.0 },
    { left: 68, top: 90, delay: 1.8, duration: 2.2 },
    { left: 38, top: 25, delay: 2.6, duration: 3.5 },
    { left: 82, top: 70, delay: 0.5, duration: 2.8 },
    { left: 28, top: 80, delay: 1.0, duration: 4.2 },
    { left: 58, top: 35, delay: 2.1, duration: 3.0 },
    { left: 18, top: 50, delay: 0.7, duration: 3.7 },
    { left: 72, top: 45, delay: 1.5, duration: 2.5 },
    { left: 42, top: 85, delay: 2.3, duration: 4.1 },
    { left: 87, top: 55, delay: 0.3, duration: 2.9 },
    { left: 32, top: 15, delay: 1.7, duration: 3.4 },
    { left: 62, top: 75, delay: 2.5, duration: 2.6 },
    { left: 2, top: 65, delay: 0.9, duration: 3.8 },
    { left: 77, top: 20, delay: 1.2, duration: 4.3 },
    { left: 47, top: 95, delay: 2.0, duration: 2.1 },
    { left: 97, top: 80, delay: 0.4, duration: 3.6 },
    { left: 27, top: 35, delay: 1.6, duration: 2.7 },
    { left: 67, top: 60, delay: 2.2, duration: 4.0 },
    { left: 37, top: 40, delay: 0.6, duration: 3.2 },
    { left: 83, top: 90, delay: 1.4, duration: 2.4 },
    { left: 13, top: 25, delay: 2.4, duration: 3.9 },
    { left: 53, top: 70, delay: 0.2, duration: 2.8 },
    { left: 73, top: 10, delay: 1.8, duration: 4.4 },
    { left: 43, top: 55, delay: 2.6, duration: 3.1 },
    { left: 93, top: 45, delay: 0.8, duration: 2.3 },
    { left: 23, top: 85, delay: 1.1, duration: 3.7 },
  ]

  useEffect(() => {
    setMounted(true)

    // Typing animation
    let i = 0
    const typeTimer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(typeTimer)
      }
    }, 50)

    // Model rotation
    const modelTimer = setInterval(() => {
      setCurrentModel((prev) => (prev + 1) % models.length)
    }, 2000)

    return () => {
      clearInterval(typeTimer)
      clearInterval(modelTimer)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Particles - Seulement après le montage */}
      {mounted && (
        <div className="absolute inset-0">
          {particlePositions.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Orbs with Advanced Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-violet-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-gradient-to-r from-violet-600/15 to-blue-600/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-gradient-to-r from-blue-700/25 to-violet-700/25 rounded-full blur-3xl animate-float-slow" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Animated Badge */}
        <div
          className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 backdrop-blur-xl mb-8 transition-all duration-1000 hover:scale-105 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-violet-500/20 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Brain className="w-5 h-5 text-blue-400 animate-pulse" />
          <span className="text-blue-200 font-medium">AI-Powered Comparison Engine</span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-violet-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Main Title with Stagger Animation */}
        <h1
          className={`text-6xl md:text-8xl font-black mb-8 transition-all duration-1000 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="overflow-hidden">
            <span className="block text-white mb-4 animate-slide-up">Stop Guessing.</span>
          </div>
          <div className="overflow-hidden">
            <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-blue-300 bg-clip-text text-transparent animate-slide-up animation-delay-300">
              Start Knowing.
            </span>
          </div>
          <div className="text-4xl md:text-5xl mt-8 text-gray-300 font-bold min-h-[4rem]">
            <span className="animate-fade-in animation-delay-600">{typedText}</span>
            <span className="animate-blink">|</span>
          </div>
        </h1>

        {/* Rotating Model Display */}
        <div
          className={`mb-12 transition-all duration-1000 delay-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="text-2xl md:text-3xl text-gray-300 mb-4">Currently analyzing:</div>
          <div className="relative h-16 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-2xl backdrop-blur-xl border border-blue-500/20 animate-pulse-slow" />
            <span
              key={currentModel}
              className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent animate-scale-in"
            >
              {models[currentModel]}
            </span>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div
          className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 transition-all duration-1000 delay-600 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Link href={`/early-access${typeof window !== "undefined" && window.location.search ? window.location.search : ""}`}>
            <Button
              size="lg"
              className="group relative bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
              <Sparkles className="mr-3 w-6 h-6 group-hover:animate-spin-slow" />
              Try for Free
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-blue-400/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-blue-400 rounded-full mt-2 animate-scroll-indicator" />
        </div>
      </div>
    </section>
  )
}
