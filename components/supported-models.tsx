"use client"

import { Card } from "@/components/ui/card"

const models = [
  {
    name: "GPT-4",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    company: "OpenAI",
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Claude 3",
    logo: "https://cdn.brandfetch.io/idmJWF3N06/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B",
    company: "Anthropic",
    color: "from-orange-500 to-red-600",
  },
  {
    name: "Mistral",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Mistral_AI_logo_%282025%E2%80%93%29.svg/768px-Mistral_AI_logo_%282025%E2%80%93%29.svg.png",
    company: "Mistral AI",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "LLaMA 2",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    company: "Meta",
    color: "from-purple-500 to-pink-600",
  },
  {
    name: "Gemini",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg",
    company: "Google",
    color: "from-yellow-500 to-orange-600",
  },
  {
    name: "CodeLlama",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    company: "Meta",
    color: "from-cyan-500 to-blue-600",
  },
  {
    name: "PaLM 2",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    company: "Google",
    color: "from-indigo-500 to-purple-600",
  },
  {
    name: "Cohere",
    logo: "https://avatars.githubusercontent.com/u/59123956?s=200&v=4",
    company: "Cohere",
    color: "from-pink-500 to-rose-600",
  },
]

export function SupportedModels() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-gray-900/50 to-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Supported LLMs
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Compare the top AI models on the market</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {models.map((model, index) => (
            <Card
              key={model.name}
              className="p-4 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-110 group"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg p-2">
                <img
                  src={model.logo || "/placeholder.svg"}
                  alt={`${model.company} logo`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback en cas d'erreur de chargement
                    const target = e.target as HTMLImageElement
                    target.src = `/placeholder.svg?height=48&width=48&text=${model.company.charAt(0)}`
                  }}
                />
              </div>
              <h3 className="text-center font-medium text-white text-sm group-hover:text-purple-300 transition-colors">
                {model.name}
              </h3>
              <p className="text-center text-xs text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">
                {model.company}
              </p>
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
