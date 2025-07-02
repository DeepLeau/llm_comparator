"use client"

import { Card } from "@/components/ui/card"
import { FileText, Zap, BarChart3, Download } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "One‑Click Comparison",
    description: "Test your prompt on 15+ models simultaneously in seconds",
  },
  {
    icon: FileText,
    title: "Business Use Cases",
    description: "Ready-made templates for HR, customer support, sales, summarization, and data extraction",
  },
  {
    icon: Download,
    title: "CSV Export",
    description: "Download all your results for analysis and team sharing",
  },
  {
    icon: BarChart3,
    title: "Smart Recommendation",
    description: "An intelligent algorithm that identifies the best model based on your criteria",
  },
]

export function Features() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Key Features
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to choose the right AI model
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
