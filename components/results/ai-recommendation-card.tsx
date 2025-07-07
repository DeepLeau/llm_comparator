"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Clock, DollarSign, TrendingUp, Award, Zap } from "lucide-react"

interface AIRecommendationCardProps {
  model: any
}

export function AIRecommendationCard({ model }: AIRecommendationCardProps) {
  const qualityStars = Math.round(model.qualityScore)

  const getPerformanceInsight = () => {
    if (model.qualityScore >= 4.5 && model.responseTime < 1000) {
      return {
        icon: <Award className="w-5 h-5 text-yellow-400" />,
        title: "Excellent Performance",
        description: "This model delivers exceptional quality with fast response times.",
      }
    } else if (model.qualityScore >= 4.0) {
      return {
        icon: <TrendingUp className="w-5 h-5 text-green-400" />,
        title: "High Quality",
        description: "This model consistently produces high-quality responses.",
      }
    } else if (model.responseTime < 500) {
      return {
        icon: <Zap className="w-5 h-5 text-blue-400" />,
        title: "Lightning Fast",
        description: "This model offers the fastest response times in your test.",
      }
    } else {
      return {
        icon: <Trophy className="w-5 h-5 text-purple-400" />,
        title: "Best Overall",
        description: "This model offers the best balance of quality, speed, and cost.",
      }
    }
  }

  const insight = getPerformanceInsight()

  return (
    <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Trophy className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <span>🤖 AI Recommendation</span>
            <p className="text-sm text-gray-400 font-normal mt-1">Based on your test results and criteria</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  {model.license === "open-source" ? "Open Source" : "Propriétaire"}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Average Quality</span>
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
                <span className="text-gray-300">Average Response Time</span>
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

              {model.totalCost && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Cost</span>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-white font-semibold">${model.totalCost.toFixed(4)}</span>
                  </div>
                </div>
              )}

              {model.successfulPrompts && model.totalPrompts && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Success Rate</span>
                  <span className="text-white font-semibold">
                    {model.successfulPrompts}/{model.totalPrompts} (
                    {((model.successfulPrompts / model.totalPrompts) * 100).toFixed(0)}%)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* AI Insight */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              {insight.icon}
              <div>
                <h4 className="text-lg font-semibold text-white">{insight.title}</h4>
                <p className="text-gray-400 text-sm">{insight.description}</p>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <h5 className="text-white font-medium mb-2">Why this model?</h5>
              <ul className="text-gray-300 text-sm space-y-1">
                {model.qualityScore >= 4.0 && <li>• Consistently high-quality responses across all test prompts</li>}
                {model.responseTime < 1000 && <li>• Fast response times for better user experience</li>}
                {model.cost < 0.01 && <li>• Cost-effective solution for your use case</li>}
                {model.license === "open-source" && <li>• Open source model with flexible licensing</li>}
                {model.successfulPrompts === model.totalPrompts && (
                  <li>• 100% success rate across all test scenarios</li>
                )}
              </ul>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Use This Model</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
