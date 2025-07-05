"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { ProgressIndicator } from "@/components/use-case-selection/progress-indicator"
import { UseCaseSection } from "./use-case-section"
import { SelectedModelsSection } from "./selected-models-section"
import { PromptsSection } from "./prompts-section"
import { StartTestButton } from "./start-test-button"
import { useWorkflow } from "@/contexts/workflow-context"

const stepNames = ["Use Case", "Models", "Prompts", "Summary"]

export function SummaryPage() {
  const router = useRouter()
  const { state, getEstimatedCost } = useWorkflow()
  const [isStartingTest, setIsStartingTest] = useState(false)

  const handleBack = () => {
    router.push("/prompt-input")
  }

  const handleStartTest = async () => {
    setIsStartingTest(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // Navigate to results page
    router.push("/results")
  }

  // Redirect if no data
  if (!state.selectedUseCase || state.selectedModels.length === 0 || state.prompts.length === 0) {
    router.push("/use-case-selection")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <PageHeader title="Test Summary" onBack={handleBack} estimatedCost={getEstimatedCost()} />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={4} totalSteps={4} stepNames={stepNames} />

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Summary of your test setup</h1>
          <p className="mt-2 text-gray-400">Review your configuration before starting the batch test</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          <UseCaseSection useCase={state.selectedUseCase} />
          <SelectedModelsSection models={state.selectedModels} />
          <PromptsSection prompts={state.prompts} />
        </div>

        {/* Start Test Button */}
        <div className="mt-12">
          <StartTestButton
            onStartTest={handleStartTest}
            isLoading={isStartingTest}
            modelCount={state.selectedModels.length}
            promptCount={state.prompts.length}
          />
        </div>
      </div>
    </div>
  )
}