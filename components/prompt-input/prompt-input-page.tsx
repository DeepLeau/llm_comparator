"use client"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { ProgressIndicator } from "@/components/use-case-selection/progress-indicator"
import { PromptForm } from "./prompt-form"
import { PromptList } from "./prompt-list"
import { useWorkflow } from "@/contexts/workflow-context"

const stepNames = ["Use Case", "Models", "Prompts", "Summary"]

export function PromptInputPage() {
  const router = useRouter()
  const { state, addPrompt, removePrompt, setCurrentStep, getEstimatedCost } = useWorkflow()

  const handleAddPrompt = (systemPrompt: string, userPrompt: string) => {
    const newPrompt = {
      id: Date.now().toString(),
      systemPrompt,
      userPrompt,
      createdAt: new Date(),
    }
    addPrompt(newPrompt)
  }

  const handleDeletePrompt = (id: string) => {
    removePrompt(id)
  }

  const handleBack = () => {
    router.push("/model-selection")
  }

  const handleContinue = () => {
    if (state.prompts.length > 0) {
      setCurrentStep(4)
      router.push("/summary")
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <PageHeader title="Prompt Input" onBack={handleBack} estimatedCost={getEstimatedCost()} />

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <ProgressIndicator currentStep={3} totalSteps={4} stepNames={stepNames} />

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Add Your Test Prompts</h1>
            <p className="mt-4 text-lg text-gray-400">Create prompts to test across your selected models</p>
          </div>

          <PromptForm onAddPrompt={handleAddPrompt} />

          <PromptList prompts={state.prompts} onDeletePrompt={handleDeletePrompt} />

          {state.prompts.length > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleContinue}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-indigo-700"
              >
                Continue to Summary ({state.prompts.length} prompt{state.prompts.length !== 1 ? "s" : ""})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
