"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Zap, DollarSign, Star } from "lucide-react"

// Mock data - same as in summary page
const mockSelectedModels = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    speed: "medium",
    cost: "high",
    quality: "excellent",
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    speed: "fast",
    cost: "medium",
    quality: "excellent",
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    speed: "fast",
    cost: "low",
    quality: "good",
  },
  {
    id: "llama-2-70b",
    name: "Llama 2 70B",
    provider: "Meta",
    speed: "medium",
    cost: "medium",
    quality: "good",
  },
  {
    id: "mistral-7b",
    name: "Mistral 7B",
    provider: "Mistral AI",
    speed: "fast",
    cost: "low",
    quality: "good",
  },
  {
    id: "palm-2",
    name: "PaLM 2",
    provider: "Google",
    speed: "medium",
    cost: "medium",
    quality: "good",
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    speed: "fast",
    cost: "low",
    quality: "good",
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    speed: "fast",
    cost: "low",
    quality: "good",
  },
]

const speedConfig = {
  slow: { label: "Slow", color: "bg-red-500/10 text-red-400" },
  medium: { label: "Medium", color: "bg-yellow-500/10 text-yellow-400" },
  fast: { label: "Fast", color: "bg-green-500/10 text-green-400" },
}

const costConfig = {
  low: { label: "Low", color: "bg-green-500/10 text-green-400" },
  medium: { label: "Medium", color: "bg-yellow-500/10 text-yellow-400" },
  high: { label: "High", color: "bg-red-500/10 text-red-400" },
}

const qualityConfig = {
  good: { label: "Good", color: "bg-blue-500/10 text-blue-400" },
  excellent: { label: "Excellent", color: "bg-purple-500/10 text-purple-400" },
}

export function SelectedModelsPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push("/summary")
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <PageHeader title="Selected Models" onBack={handleBack} />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">Selected Models</h1>
              <p className="mt-2 text-gray-400">Complete list of models selected for testing</p>
            </div>
            <Badge variant="secondary" className="bg-gray-800 text-gray-300">
              {mockSelectedModels.length} models
            </Badge>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockSelectedModels.map((model) => (
            <div
              key={model.id}
              className="rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-colors hover:bg-gray-900/70"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white">{model.name}</h3>
                  <p className="text-sm text-gray-400">{model.provider}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Speed:</span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${speedConfig[model.speed as keyof typeof speedConfig]?.color || "bg-gray-500/10 text-gray-400"}`}
                    >
                      {speedConfig[model.speed as keyof typeof speedConfig]?.label || model.speed}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Cost:</span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${costConfig[model.cost as keyof typeof costConfig]?.color || "bg-gray-500/10 text-gray-400"}`}
                    >
                      {costConfig[model.cost as keyof typeof costConfig]?.label || model.cost}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Quality:</span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${qualityConfig[model.quality as keyof typeof qualityConfig]?.color || "bg-gray-500/10 text-gray-400"}`}
                    >
                      {qualityConfig[model.quality as keyof typeof qualityConfig]?.label || model.quality}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
