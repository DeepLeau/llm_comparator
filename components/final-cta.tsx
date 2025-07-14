"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Rocket } from "lucide-react"

export function FinalCTA() {
  const router = useRouter()

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-violet-900/20 to-indigo-900/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />

      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 backdrop-blur-xl mb-8">
          <Rocket className="w-5 h-5 text-purple-400" />
          <span className="text-purple-200 font-medium">Ready to get started?</span>
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>

        <h2 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
          Find Your Ideal
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">AI Model</span>
        </h2>

        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Join <span className="text-purple-400 font-semibold">10,000+ developers</span>, agencies, and startups using
          WhichLLMs to optimize their AI projects.
        </p>

        <Button
          size="lg"
          onClick={() => router.push("/login")}
          className="group bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl shadow-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40 border border-purple-400/20"
        >
          <Sparkles className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
          Compare Your Prompt Now
          <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Button>

        <div className="text-center text-slate-400 mt-8 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Free Version Available</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Beta Access</span>
          </div>
        </div>
      </div>
    </section>
  )
}
