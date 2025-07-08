"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWorkflow } from "@/contexts/workflow-context"
import { setCurrentTestSession } from "@/lib/test-results"
import { Play, AlertTriangle, Loader2 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export function StartTestButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showInsufficientCreditsDialog, setShowInsufficientCreditsDialog] = useState(false)
  const [creditInfo, setCreditInfo] = useState<{
    current: number
    required: number
  } | null>(null)
  const { state } = useWorkflow()
  const router = useRouter()

  const getAuthToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session?.access_token
  }

  const handleStartTest = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Validation
      if (!state.selectedModels?.length) {
        throw new Error("No models selected")
      }

      if (!state.prompts?.length) {
        throw new Error("No prompts defined")
      }

      // Extraire tous les prompts utilisateur
      const userPrompts: string[] = []
      state.prompts.forEach((prompt) => {
        let userPromptText = ""
        if (typeof prompt === "string") {
          userPromptText = prompt
        } else if (prompt.userPrompt?.trim()) {
          userPromptText = prompt.userPrompt
        } else if (prompt.content?.trim()) {
          userPromptText = prompt.content
        }

        if (userPromptText) {
          userPrompts.push(userPromptText)
        }
      })

      if (userPrompts.length === 0) {
        throw new Error("No valid user prompts found")
      }

      // Calculer les crédits requis (modèles × prompts)
      const creditsRequired = state.selectedModels.length * userPrompts.length

      // Obtenir le token d'authentification
      const token = await getAuthToken()
      if (!token) {
        throw new Error("Authentication required")
      }

      // Vérifier les crédits avant de commencer le test
      const creditResponse = await fetch("/api/check-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ creditsRequired }),
      })

      if (!creditResponse.ok) {
        const errorData = await creditResponse.json()
        throw new Error(errorData.error || "Failed to check credits")
      }

      const creditData = await creditResponse.json()

      if (!creditData.hasEnoughCredits) {
        setCreditInfo({
          current: creditData.currentCredits,
          required: creditData.creditsRequired,
        })
        setShowInsufficientCreditsDialog(true)
        return
      }

      // Utiliser le prompt système du premier prompt ou du cas d'usage
      const systemPrompt =
        (typeof state.prompts[0] === "object" ? state.prompts[0].systemPrompt : "") ||
        state.selectedUseCase?.systemPrompt ||
        ""

      console.log("Starting multi-prompt test with:", {
        models: state.selectedModels.map((m) => ({ id: m.id, name: m.name })),
        systemPrompt,
        userPrompts,
        totalPrompts: userPrompts.length,
        creditsRequired,
        useCase: state.selectedUseCase,
      })

      // Appeler l'API de test avec tous les prompts
      const response = await fetch("/api/test-models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selectedModelIds: state.selectedModels.map((m) => m.id),
          systemPrompt,
          prompts: userPrompts,
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

      // Consommer les crédits après un test réussi
      const consumeResponse = await fetch("/api/consume-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ creditsToConsume: data.stats.successfulTests }),
      })

      if (!consumeResponse.ok) {
        console.warn("Failed to consume credits, but test was successful")
      } else {
        const consumeData = await consumeResponse.json()
        console.log("Credits consumed:", consumeData)
      }

      // Stocker les résultats pour la page results
      const testSession = {
        id: data.testId || `test-${Date.now()}`,
        results: data.results,
        systemPrompt: data.systemPrompt,
        prompts: data.prompts,
        timestamp: new Date(data.timestamp),
        stats: data.stats,
      }

      setCurrentTestSession(testSession)

      // Rediriger vers la page de résultats
      router.push("/results")
    } catch (err) {
      console.error("Error starting multi-prompt test:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const creditsRequired = (state.selectedModels?.length || 0) * (state.prompts?.length || 0)

  return (
    <>
      <div className="space-y-4">
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={handleStartTest}
          disabled={isLoading || !state.selectedModels?.length || !state.prompts?.length}
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
              Start Test ({creditsRequired} credits)
            </>
          )}
        </Button>

        {isLoading && (
          <div className="text-center text-gray-400 text-sm space-y-1">
            <p>
              Running tests on {state.selectedModels?.length || 0} models with {state.prompts?.length || 0} prompts...
            </p>
            <p>• Total tests: {creditsRequired}</p>
            <p>• Credits will be consumed: {creditsRequired}</p>
            <p>• Sending prompts to selected models</p>
            <p>• Collecting responses in parallel</p>
            <p>• Scoring each response</p>
            <p>• Calculating averages per model</p>
            <p>• Saving results to database</p>
            <p>
              This may take {Math.ceil(creditsRequired / 10)} to {Math.ceil(creditsRequired / 5)} minutes
            </p>
          </div>
        )}
      </div>

      {/* Credit Dialog */}
      <Dialog open={showInsufficientCreditsDialog} onOpenChange={setShowInsufficientCreditsDialog}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Insufficient Credits
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              You don't have enough credits to run this test.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current Credits:</span>
                <span className="text-white font-medium">{creditInfo?.current || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Required Credits:</span>
                <span className="text-red-400 font-medium">{creditInfo?.required || 0}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-700 pt-2">
                <span className="text-gray-400">Missing Credits:</span>
                <span className="text-red-400 font-medium">
                  {(creditInfo?.required || 0) - (creditInfo?.current || 0)}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              <p className="mb-2">To reduce the required credits, you can:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Select fewer models</li>
                <li>Reduce the number of prompts</li>
                <li>Purchase more credits from your account settings</li>
              </ul>
            </div>
            <Button
              onClick={() => setShowInsufficientCreditsDialog(false)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Understood
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
