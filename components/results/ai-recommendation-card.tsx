"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, DollarSign, Award, TrendingUp, Shield } from "lucide-react"
import type { TestResult } from "./results-page"

interface AIRecommendationCardProps {
  model: TestResult
}

export function AIRecommendationCard({ model }: AIRecommendationCardProps) {
  if (!model) return null

  const qualityStars = Math.round(model.qualityScore || 0)
  const responseTimeColor =
    (model.responseTime || 0) < 1000
      ? "text-green-400"
      : (model.responseTime || 0) < 2000
        ? "text-yellow-400"
        : "text-red-400"
  const costColor =
    (model.cost || 0) < 0.01 ? "text-green-400" : (model.cost || 0) < 0.05 ? "text-yellow-400" : "text-red-400"

  return (
    <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Award className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span>AI Recommendation</span>
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                Best Match
              </Badge>
            </div>
            <p className="text-sm text-gray-400 font-normal mt-1">
              Based on your use case and requirements, this model offers the best overall performance.
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Model Info */}
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
                  <Shield className="w-3 h-3 mr-1" />
                  {model.license === "open-source" ? "Open Source" : "Commercial"}
                </Badge>
              </div>
            </div>

            {/* Performance Metrics */}
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
                  <span className="text-white font-semibold">{(model.qualityScore || 0).toFixed(1)}/5.0</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Response Time</span>
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${responseTimeColor}`} />
                  <span className="text-white font-semibold">{(model.responseTime || 0).toFixed(0)}ms</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Cost per Request</span>
                <div className="flex items-center gap-2">
                  <DollarSign className={`w-4 h-4 ${costColor}`} />
                  <span className="text-white font-semibold">${(model.cost || 0).toFixed(4)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Why This Model */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Why This Model?</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Highest Quality Score</p>
                  <p className="text-gray-400 text-sm">
                    Achieved {(model.qualityScore || 0).toFixed(1)}/5.0 rating in our comprehensive evaluation
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Optimal Performance</p>
                  <p className="text-gray-400 text-sm">
                    Balanced combination of speed ({(model.responseTime || 0).toFixed(0)}ms) and cost-effectiveness
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Use Case Match</p>
                  <p className="text-gray-400 text-sm">
                    Specifically optimized for your selected use case requirements
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
