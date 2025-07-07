"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWorkflow } from "@/contexts/workflow-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Users, MessageSquare, Zap } from "lucide-react"
import { UseCaseSection } from "./use-case-section"
import { SelectedModelsSection } from "./selected-models-section"
import { PromptsSection } from "./prompts-section"
import { StartTestButton } from "./start-test-button"

export function SummaryPage() {
  const router = useRouter()
  const { state } = useWorkflow()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render anything during SSR
  if (!isClient) {
    return null
  }

  // Safe access with fallbacks
  const selectedModels = state?.selectedModels || []
  const prompts = state?.prompts || []
  const selectedUseCase = state?.selectedUseCase

  // Redirect if no data
  if (!selectedUseCase || selectedModels.length === 0 || prompts.length === 0) {
    router.push("/use-case-selection")
    return null
  }

  const totalTests = selectedModels.length * prompts.length

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-white">Test Summary</h1>
                <p className="text-sm text-gray-400">Review your configuration before starting the test</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/30">
                <Zap className="w-3 h-3 mr-1" />
                {totalTests} Tests
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{prompts.length}</p>
                  <p className="text-sm text-gray-400">Prompts</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{selectedModels.length}</p>
                  <p className="text-sm text-gray-400">Models</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{totalTests}</p>
                  <p className="text-sm text-gray-400">Total Tests</p>
                </div>
              </div>
            </div>
          </div>

          {/* Use Case Section */}
          <UseCaseSection useCase={selectedUseCase} />

          {/* Selected Models Section */}
          <SelectedModelsSection models={selectedModels} />

          {/* Prompts Section */}
          <PromptsSection prompts={prompts} />

          {/* Start Test Button */}
          <div className="flex justify-center pt-8">
            <StartTestButton />
          </div>
        </div>
      </div>
    </div>
  )
}
