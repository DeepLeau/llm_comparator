"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Clock, DollarSign, Sparkles, ArrowRight } from "lucide-react"

interface AIRecommendationCardProps {
  model: any
}

export function AIRecommendationCard({ model }: AIRecommendationCardProps) {
  const qualityStars = Math.round(model.qualityScore)

  return (
    <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Trophy className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              AI Recommendation
            </span>
            <p className="text-sm text-gray-400 font-normal mt-1">
              Based on your test criteria, this model offers the best balance of quality, speed, and cost
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">{model.modelName}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-gray-300">{model.provider}</span>
                <Badge
                  variant="secondary"
                  className={`${
                    model.license === "open-source"
                      ? "bg-green-600/20 text-green-300 border-green-600/30"
                      : "bg-blue-600/20 text-blue-300 border-blue-600/30"
                  }`}
                >
                  {model.license === "open-source" ? "Open Source" : "Proprietary"}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Quality Score</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < qualityStars ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                      />
                    ))}
                  </div>
                  <span className="text-white font-semibold">{model.qualityScore.toFixed(1)}/5.0</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Response Time</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-semibold">{model.responseTime.toFixed(0)}ms</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Average Cost</span>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-white font-semibold">${model.cost.toFixed(4)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Why This Model?</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-300 text-sm">
                    <span className="font-medium text-white">Highest Quality:</span> Achieved the best average score
                    across all test prompts
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-300 text-sm">
                    <span className="font-medium text-white">Optimal Performance:</span> Balanced response time and cost
                    efficiency
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-300 text-sm">
                    <span className="font-medium text-white">Reliable Results:</span> Consistent performance across
                    different prompt types
                  </p>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
