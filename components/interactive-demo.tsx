"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Play, Zap, Trophy, Clock, Brain, Star } from "lucide-react"

const demoResults = [
  { model: "GPT-4", score: 94, speed: "1.2s", cost: "$0.03", color: "from-green-500 to-emerald-500" },
  { model: "Claude 3", score: 91, speed: "0.8s", cost: "$0.025", color: "from-blue-500 to-cyan-500" },
  { model: "Gemini Pro", score: 87, speed: "0.6s", cost: "$0.02", color: "from-violet-500 to-purple-500" },
  { model: "Mistral Large", score: 85, speed: "0.4s", cost: "$0.015", color: "from-orange-500 to-red-500" },
]

export function InteractiveDemo() {
  const [isRunning, setIsRunning] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  const steps = [
    "Initializing AI engines...",
    "Loading 300+ models...",
    "Processing your prompt...",
    "Running comparisons...",
    "Analyzing results...",
    "Generating recommendations...",
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const section = document.getElementById("demo-section")
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  const runDemo = () => {
    setIsRunning(true)
    setShowResults(false)
    setProgress(0)

    let stepIndex = 0
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(steps[stepIndex])
        setProgress(((stepIndex + 1) / steps.length) * 100)
        stepIndex++
      } else {
        clearInterval(stepInterval)
        setTimeout(() => {
          setIsRunning(false)
          setShowResults(true)
        }, 500)
      }
    }, 500)
  }

  return (
    <section id="demo-section" className="py-32 px-6 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-violet-600/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-violet-600/10 to-blue-600/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 backdrop-blur-xl mb-8 transition-all duration-1000 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Brain className="w-5 h-5 text-blue-400 animate-pulse" />
            <span className="text-blue-200 font-medium">Interactive Demo</span>
            <Play className="w-5 h-5 text-violet-400 animate-bounce" />
          </div>

          <h2
            className={`text-5xl md:text-7xl font-black mb-8 text-white transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="block animate-slide-up">See The Magic</span>
            <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent animate-slide-up animation-delay-300">
              In Action
            </span>
          </h2>

          <p
            className={`text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Watch how LLM Comparator analyzes your prompt across 300+ models and delivers instant recommendations.
          </p>
        </div>

        {/* Enhanced Demo Interface */}
        <div className="max-w-4xl mx-auto">
          <Card
            className={`p-8 bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-blue-500/30 backdrop-blur-xl rounded-2xl mb-8 hover:border-blue-400/50 transition-all duration-500 ${isVisible ? "animate-scale-in" : "opacity-0 scale-95"}`}
          >
            <div className="mb-6">
              <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-400 animate-spin-slow" />
                Your Prompt:
              </label>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/30 transition-colors duration-300">
                <p className="text-gray-300 font-mono leading-relaxed">
                  "Write a professional email to a client explaining a project delay and proposing solutions."
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {isRunning && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-300 text-sm font-medium">{currentStep}</span>
                  <span className="text-blue-300 text-sm">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-300 animate-pulse"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="text-center">
              <Button
                onClick={runDemo}
                disabled={isRunning}
                size="lg"
                className="group relative bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
                {isRunning ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3" />
                    Analyzing Models...
                  </>
                ) : (
                  <>
                    <Play className="mr-3 w-5 h-5 group-hover:animate-bounce" />
                    Run Comparison
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Enhanced Results */}
          {showResults && (
            <Card className="p-8 bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-blue-500/30 backdrop-blur-xl rounded-2xl animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                <h3 className="text-xl font-bold text-white">Analysis Complete</h3>
                <span className="text-blue-400 text-sm animate-fade-in">in 2.3 seconds</span>
                <div className="flex gap-1 ml-auto">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                {demoResults.map((result, index) => (
                  <div
                    key={result.model}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all duration-500 hover:scale-105 ${
                      index === 0
                        ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 animate-glow"
                        : "bg-gray-800/50 border border-gray-700/30 hover:border-blue-500/30"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      {index === 0 && <Trophy className="w-5 h-5 text-yellow-400 animate-bounce" />}
                      <div className={`w-3 h-3 bg-gradient-to-r ${result.color} rounded-full animate-pulse`} />
                      <span className="font-semibold text-white">{result.model}</span>
                      {index === 0 && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full font-medium animate-pulse">
                          RECOMMENDED
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
                        <span className="text-gray-300">Score: {result.score}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-400 animate-pulse" />
                        <span className="text-gray-300">{result.speed}</span>
                      </div>
                      <div className="text-gray-300 font-mono">{result.cost}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-xl border border-blue-500/20 animate-fade-in animation-delay-500">
                <p className="text-blue-300 text-sm font-medium flex items-start gap-2 leading-relaxed">
                  <Brain className="w-4 h-4 mt-0.5 animate-pulse flex-shrink-0" />
                  <span>
                    <strong className="text-blue-200">AI Recommendation:</strong> GPT-4 is optimal for this professional
                    communication task due to its superior tone and structure capabilities.
                  </span>
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
