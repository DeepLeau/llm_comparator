"use client"

import { Card } from "@/components/ui/card"
import { FileText, Zap, BarChart3, Download, Sparkles } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "One‑Click Comparison",
    description: "Test your prompt on 200+ models simultaneously in seconds",
    color: "from-yellow-500 to-orange-600",
  },
  {
    icon: FileText,
    title: "Business Use Cases",
    description: "Ready-made templates for HR, customer support, sales, summarization, and data extraction",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Download,
    title: "CSV Export",
    description: "Download all your results for analysis and team sharing",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Smart Recommendation",
    description: "An intelligent algorithm that identifies the best model based on your criteria",
    color: "from-purple-500 to-pink-600",
  },
]

export function Features() {
  return (
    <section className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 backdrop-blur-xl mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-200 font-medium">Powerful Features</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
            Everything You Need
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
            Powerful tools to choose the right AI model for your business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-purple-500/20 backdrop-blur-xl hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-indigo-500/10 transition-all duration-500 hover:scale-105 hover:border-purple-400/30 rounded-2xl"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
