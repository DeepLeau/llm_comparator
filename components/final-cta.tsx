"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function FinalCTA() {
  const router = useRouter()
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-gray-300">Ready to get started ?</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
          Find Your Ideal AI Model
        </h2>

        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join thousands of developers, agencies, and startups using LLM Comparator to optimize their AI projects.
        </p>

        <Button
          size="lg"
          onClick={() => router.push("/login")}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl shadow-purple-500/25 transition-all duration-300 hover:scale-105"
        >
          Compare your prompt now
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>

        <div className="text-center text-gray-500 mt-8">
          <p>Free Version available • Beta</p>
        </div>
      </div>
    </section>
  )
}
