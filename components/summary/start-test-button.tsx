"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Play, Loader2 } from "lucide-react"
import { useWorkflow } from "@/contexts/workflow-context"
import { setCurrentTestSession } from "@/lib/test-results"

export function StartTestButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { state } = useWorkflow()

  const handleStartTest = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Validation
      if (!state.selectedModels.length) {
        throw new Error("Aucun modèle sélectionné")
      }

      if (!state.prompts.length) {
        throw new Error("Aucun prompt défini")
      }

      // Extraire tous les prompts utilisateur
      const userPrompts: string[] = []

      state.prompts.forEach((prompt) => {
        // Vérifier les différentes propriétés possibles du prompt
        let userPromptText = ""
        if (prompt.userPrompt?.trim()) {
          userPromptText = prompt.userPrompt
        } else if (prompt.content?.trim()) {
          userPromptText = prompt.content
        }

        if (userPromptText) {
          userPrompts.push(userPromptText)
        }
      })

      if (userPrompts.length === 0) {
        throw new Error("Aucun prompt utilisateur valide trouvé")
      }

      // Utiliser le system prompt du premier prompt ou du use case
      const systemPrompt = state.prompts[0]?.systemPrompt || state.selectedUseCase?.systemPrompt || ""

      console.log("Starting multi-prompt test with:", {
        models: state.selectedModels.map((m) => ({ id: m.id, name: m.name })),
        systemPrompt,
        userPrompts,
        totalPrompts: userPrompts.length,
        useCase: state.selectedUseCase,
      })

      // Appeler l'API de test avec tous les prompts
      const response = await fetch("/api/test-models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedModelIds: state.selectedModels.map((m) => m.id),
          systemPrompt,
          prompts: userPrompts, // Envoyer tous les prompts
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Test failed")
      }

      console.log("Multi-prompt test completed successfully:", data)

      // Stocker les résultats pour la page results
      const testSession = {
        id: `test-${Date.now()}`,
        results: data.results,
        systemPrompt: data.systemPrompt,
        prompts: data.prompts, // Tous les prompts
        timestamp: new Date(data.timestamp),
        stats: data.stats,
      }

      setCurrentTestSession(testSession)

      // Rediriger vers la page de résultats
      router.push("/results")
    } catch (err) {
      console.error("Error starting multi-prompt test:", err)
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <Button
        onClick={handleStartTest}
        disabled={isLoading || !state.selectedModels.length || !state.prompts.length}
        size="lg"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Testing Models...
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            Start Test ({state.selectedModels.length} models × {state.prompts.length} prompts)
          </>
        )}
      </Button>

      {isLoading && (
        <div className="text-center text-gray-400 text-sm space-y-1">
          <p>
            Running tests on {state.selectedModels.length} models with {state.prompts.length} prompts...
          </p>
          <p>• Total tests: {state.selectedModels.length * state.prompts.length}</p>
          <p>• Sending prompts to selected models</p>
          <p>• Collecting responses in parallel</p>
          <p>• Scoring each response with Claude 3 Opus</p>
          <p>• Calculating averages per model</p>
          <p>
            This may take {Math.ceil((state.selectedModels.length * state.prompts.length) / 10)} to{" "}
            {Math.ceil((state.selectedModels.length * state.prompts.length) / 5)} minutes
          </p>
        </div>
      )}
    </div>
  )
}
