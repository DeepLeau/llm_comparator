"use client"

import { Card } from "@/components/ui/card"
import { Cpu } from "lucide-react"

const models = [
  {
    name: "GPT-4",
    company: "OpenAI",
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Claude 3",
    company: "Anthropic",
    color: "from-orange-500 to-red-600",
  },
  {
    name: "Mistral",
    company: "Mistral AI",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "LLaMA 2",
    company: "Meta",
    color: "from-purple-500 to-pink-600",
  },
  {
    name: "Gemini",
    company: "Google",
    color: "from-yellow-500 to-orange-600",
  },
  {
    name: "CodeLlama",
    company: "Meta",
    color: "from-cyan-500 to-blue-600",
  },
  {
    name: "PaLM 2",
    company: "Google",
    color: "from-indigo-500 to-purple-600",
  },
  {
    name: "Cohere",
    company: "Cohere",
    color: "from-pink-500 to-rose-600",
  },
]

export function SupportedModels() {
  return (
    <section className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 backdrop-blur-xl mb-6">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-200 font-medium">AI Models</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
            200+ Models
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Supported
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
            Compare the top AI models from leading companies
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 mb-16">
          {models.map((model, index) => (
            <Card
              key={model.name}
              className="group p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-purple-500/20 backdrop-blur-xl hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-indigo-500/10 transition-all duration-500 hover:scale-110 hover:border-purple-400/30 rounded-2xl"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${model.color} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <span className="text-white font-bold text-lg">{model.company.charAt(0)}</span>
              </div>
              <h3 className="text-center font-bold text-white text-sm group-hover:text-purple-300 transition-colors mb-1">
                {model.name}
              </h3>
              <p className="text-center text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                {model.company}
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 backdrop-blur-xl">
            <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              200+
            </span>
            <span className="text-slate-300 font-medium">models supported and growing</span>
          </div>
        </div>
      </div>
    </section>
  )
}
