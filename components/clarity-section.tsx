"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle, Zap, Target, Shield, TrendingUp } from "lucide-react"

const benefits = [
  {
    icon: CheckCircle,
    title: "No Technical Jargon",
    description: "Plain English results you can actually understand and use immediately",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Zap,
    title: "Instant Clarity",
    description: "See which AI works best for your specific needs in seconds, not hours",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Target,
    title: "Business-Focused",
    description: "Real-world comparisons that matter to your bottom line and productivity",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: Shield,
    title: "Cut Through the Noise",
    description: "Skip the marketing hype and get straight to what actually performs",
    color: "from-orange-500 to-red-600",
  },
]

export function ClaritySection() {
  return (
    <section className="py-32 px-6 relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 backdrop-blur-xl mb-6">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-200 font-medium">Why Choose Us</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
            Don't Get Lost in the
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              AI Jungle
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            While others drown you in technical specs and confusing metrics, we deliver
            <span className="text-purple-400 font-semibold"> crystal-clear insights</span> that actually help you choose
            the right AI for your business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <Card
              key={benefit.title}
              className="group p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-purple-500/20 backdrop-blur-xl hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-indigo-500/10 transition-all duration-500 hover:scale-105 hover:border-purple-400/30"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                {benefit.title}
              </h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Enhanced Call-out Box */}
        <Card className="p-12 bg-gradient-to-r from-purple-900/30 via-violet-900/20 to-indigo-900/30 border border-purple-500/30 backdrop-blur-xl rounded-3xl shadow-2xl">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-6">
              Stop Wasting Time on Complex Comparisons
            </h3>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Every minute spent deciphering technical documentation is a minute not spent growing your business. Get{" "}
              <span className="text-purple-400 font-semibold">actionable answers</span>, not academic papers.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-300 font-medium">Simple Results</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-300 font-medium">Real Performance</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-purple-300 font-medium">Business Impact</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
