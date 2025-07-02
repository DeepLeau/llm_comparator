"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Star, DollarSign, Calendar, Play } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import type { LLMModel } from "@/app/models/page"

interface ModelsGridProps {
  models: LLMModel[]
}

export function ModelsGrid({ models }: ModelsGridProps) {
  const getBadgeConfig = (badge: string) => {
    switch (badge) {
      case "new":
        return { text: "🔥 Nouveau", className: "bg-red-500/20 text-red-300 border-red-500/30" }
      case "top-quality":
        return { text: "⭐ Top qualité", className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" }
      case "ultra-fast":
        return { text: "⚡ Ultra rapide", className: "bg-blue-500/20 text-blue-300 border-blue-500/30" }
      default:
        return { text: badge, className: "bg-gray-500/20 text-gray-300 border-gray-500/30" }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount)
  }

  const handleTestModel = (modelId: string) => {
    // Navigate to compare page with model preselected
    window.location.href = `/compare?model=${modelId}`
  }

  if (models.length === 0) {
    return (
      <Card className="p-12 bg-white/5 border-white/10 backdrop-blur-sm text-center">
        <div className="text-gray-400">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-white mb-2">Aucun modèle trouvé</h3>
          <p>Aucun modèle ne correspond à vos critères de recherche.</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">
          {models.length} modèle{models.length > 1 ? "s" : ""} disponible{models.length > 1 ? "s" : ""}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {models.map((model) => (
          <Card
            key={model.id}
            className="p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${model.color} rounded-xl flex items-center justify-center text-xl`}
                >
                  {model.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                  <p className="text-sm text-gray-400">{model.provider}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-col gap-1">
                {model.badges.map((badge) => {
                  const config = getBadgeConfig(badge)
                  return (
                    <Badge key={badge} variant="outline" className={`text-xs ${config.className}`}>
                      {config.text}
                    </Badge>
                  )
                })}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">{model.description}</p>

            {/* Metrics */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Ajouté le</span>
                </div>
                <span className="text-white">{format(new Date(model.dateAdded), "dd MMM yyyy", { locale: fr })}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Temps moyen</span>
                </div>
                <span className="text-white">{model.avgResponseTime}s</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Score qualité</span>
                </div>
                <span className="text-white font-medium">{model.qualityScore}/10</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <DollarSign className="w-4 h-4" />
                  <span>Coût / 1k tokens</span>
                </div>
                <span className="text-white">{formatCurrency(model.costPer1kTokens)}</span>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={() => handleTestModel(model.id)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Play className="mr-2 w-4 h-4" />
              Tester ce modèle
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}