"use client"

import { Card } from "@/components/ui/card"
import { Brain, MessageSquare, Zap, Cpu, Globe, Code, Sparkles, Bot } from "lucide-react"

const models = [
  { name: "GPT-4", icon: Brain, color: "from-green-500 to-emerald-600" },
  { name: "Claude 3", icon: MessageSquare, color: "from-orange-500 to-red-600" },
  { name: "Mistral", icon: Zap, color: "from-blue-500 to-indigo-600" },
  { name: "LLaMA 2", icon: Cpu, color: "from-purple-500 to-pink-600" },
  { name: "Gemini", icon: Globe, color: "from-yellow-500 to-orange-600" },
  { name: "CodeLlama", icon: Code, color: "from-cyan-500 to-blue-600" },
  { name: "PaLM 2", icon: Sparkles, color: "from-indigo-500 to-purple-600" },
  { name: "Cohere", icon: Bot, color: "from-pink-500 to-rose-600" },
]

export function SupportedModels() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-gray-900/50 to-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            LLMs Supportés
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Comparez les meilleurs modèles d'IA du marché</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {models.map((model, index) => (
            <Card
              key={model.name}
              className="p-4 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-110 group"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${model.color} rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`}
              >
                <model.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-center font-medium text-white text-sm group-hover:text-purple-300 transition-colors">
                {model.name}
              </h3>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400">
            <span className="text-purple-400 font-semibold">15+ modèles</span> supportés et en croissance
          </p>
        </div>
      </div>
    </section>
  )
}
