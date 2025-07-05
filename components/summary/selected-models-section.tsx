"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, DollarSign, Star, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface Model {
  id: string
  name: string
  provider: string
  speed: string
  cost: string
  quality: string
}

interface SelectedModelsSectionProps {
  models: Model[]
}

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

export function SelectedModelsSection({ models }: SelectedModelsSectionProps) {
  const router = useRouter()
  const displayedModels = models.slice(0, 6) // Show only first 6 models
  const hasMoreModels = models.length > 6

  const handleViewAllModels = () => {
    router.push("/summary/selected-models")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Selected Models</h2>
        <Badge variant="secondary" className="bg-gray-800 text-gray-300">
          {models.length} model{models.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayedModels.map((model) => (
          <div
            key={model.id}
            className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:bg-gray-900/70"
          >
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-white">{model.name}</h3>
                <p className="text-sm text-gray-400">{model.provider}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-gray-400" />
                  <Badge
                    variant="secondary"
                    className={`text-xs ${speedConfig[model.speed as keyof typeof speedConfig]?.color || "bg-gray-500/10 text-gray-400"}`}
                  >
                    {speedConfig[model.speed as keyof typeof speedConfig]?.label || model.speed}
                  </Badge>
                </div>

                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-gray-400" />
                  <Badge
                    variant="secondary"
                    className={`text-xs ${costConfig[model.cost as keyof typeof costConfig]?.color || "bg-gray-500/10 text-gray-400"}`}
                  >
                    {costConfig[model.cost as keyof typeof costConfig]?.label || model.cost}
                  </Badge>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-gray-400" />
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

      {hasMoreModels && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={handleViewAllModels}
            className="border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Voir plus ({models.length - 6} modèles restants)
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
