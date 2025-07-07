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
  const { state, setCurrentStep } = useWorkflow()
  const [testResults, setTestResults] = useState<any>(null)

  const handleBack = () => {
    router.push("/prompt-input")
  }

  const handleTestComplete = (results: any) => {
    console.log("Test completed:", results)
    setTestResults(results)

    // Rediriger vers la page de résultats avec les données
    // Pour l'instant, on stocke dans le localStorage
    localStorage.setItem("testResults", JSON.stringify(results))
    router.push("/results")
  }

  const handleEditModels = () => {
    setCurrentStep(2)
    router.push("/model-selection")
  }

  const handleEditPrompts = () => {
    setCurrentStep(3)
    router.push("/prompt-input")
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <PageHeader title="Test Summary" onBack={handleBack} />

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <ProgressIndicator currentStep={4} totalSteps={4} stepNames={stepNames} />

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Ready to Test</h1>
            <p className="mt-4 text-lg text-gray-400">Review your configuration and start the comparison test</p>
          </div>

          <div className="space-y-8">
            {/* Use Case Section */}
            <UseCaseSection useCase={state.selectedUseCase} />

            {/* Selected Models Section */}
            <SelectedModelsSection models={state.selectedModels} onEdit={handleEditModels} />

            {/* Prompts Section */}
            <PromptsSection prompts={state.prompts} onEdit={handleEditPrompts} />

            {/* Start Test Button */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Start Comparison Test</h3>
              <p className="text-gray-400 mb-6">
                This will test all {state.selectedModels.length} selected models with your {state.prompts.length} prompt
                {state.prompts.length !== 1 ? "s" : ""} and provide detailed comparison results.
              </p>

              <StartTestButton
                selectedModels={state.selectedModels}
                systemPrompt={state.prompts[0]?.systemPrompt || ""}
                userPrompt={state.prompts[0]?.userPrompt || ""}
                onTestComplete={handleTestComplete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
