"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle, Zap, Target, Shield } from "lucide-react"

const benefits = [
  {
    icon: CheckCircle,
    title: "No Technical Jargon",
    description: "Plain English results you can actually understand and use immediately",
    color: "from-green-500 to-emerald-600",
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
    <section className="py-24 px-6 bg-gradient-to-b from-gray-900/50 to-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Don't Get Lost in the AI Jungle
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            While others drown you in technical specs and confusing metrics, we deliver
            <span className="text-purple-400 font-semibold"> crystal-clear insights</span> that actually help you choose
            the right AI for your business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card
              key={benefit.title}
              className="p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group hover:scale-105"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Call-out Box */}
        <Card className="p-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20 backdrop-blur-sm">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Stop Wasting Time on Complex Comparisons</h3>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Every minute spent deciphering technical documentation is a minute not spent growing your business. Get{" "}
              <span className="text-purple-400 font-semibold">actionable answers</span>, not academic papers.
            </p>
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Simple Results</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Real Performance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Business Impact</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
