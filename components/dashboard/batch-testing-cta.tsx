"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, ArrowRight, Layers, Clock, BarChart3 } from "lucide-react"

export function BatchTestingCTA() {
  const handleStartBatchTest = () => {
    window.location.href = "/use-case-selection"
  }

  const handleLearnMore = () => {
    window.location.href = "/pricing"
  }

  return (
    <Card className="bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20 border-purple-600/30 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl" />

      <CardContent className="p-8 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                Launch a New Multi-Model Test
              </Badge>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Ready for Batch Testing?</h3>
            <p className="text-gray-300 mb-4 max-w-2xl">
              Enter multiple prompts and test them across dozens of models simultaneously. Perfect for comprehensive
              evaluations and A/B testing at scale.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Layers className="w-4 h-4 text-blue-400" />
                Specific Use Cases
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4 text-green-400" />
                Parallel Processing
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                Advanced Analytics
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleStartBatchTest}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
            >
              Start Batch Test
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={handleLearnMore}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}