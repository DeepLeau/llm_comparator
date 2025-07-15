"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWorkflow } from "@/contexts/workflow-context"
import { setCurrentTestSession } from "@/lib/test-results"
import { Play, AlertTriangle, Loader2, Crown, X } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Définition des limites de tests par batch selon le plan
const PLAN_LIMITS = {
  free: 3,
  start: 10,
  scale: 50,
} as const

type PlanType = keyof typeof PLAN_LIMITS

export function StartTestButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showInsufficientCreditsDialog, setShowInsufficientCreditsDialog] = useState(false)
  const [showPlanLimitDialog, setShowPlanLimitDialog] = useState(false)
  const [creditInfo, setCreditInfo] = useState<{
    current: number
    required: number
  } | null>(null)
  const [planInfo, setPlanInfo] = useState<{
    currentPlan: PlanType
    testLimit: number
    requestedTests: number
  } | null>(null)
  const { state } = useWorkflow()
  const router = useRouter()

  const getAuthToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session?.access_token
  }

  const checkUserPlan = async (token: string): Promise<{ plan: PlanType }> => {
    const response = await fetch("/api/user-plan", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user plan")
    }

    return await response.json()
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

      // Calculer le nombre total de tests (modèles × prompts)
      const totalTests = state.selectedModels.length * userPrompts.length

      // Obtenir le token d'authentification
      const token = await getAuthToken()
      if (!token) {
        throw new Error("Authentication required")
      }

      // PREMIÈRE VÉRIFICATION : Limite de tests par batch selon le plan
      const { plan } = await checkUserPlan(token)
      const testLimit = PLAN_LIMITS[plan]

      if (totalTests > testLimit) {
        setPlanInfo({
          currentPlan: plan,
          testLimit,
          requestedTests: totalTests,
        })
        setShowPlanLimitDialog(true)
        setIsLoading(false) // Important : arrêter le loading
        return // Empêcher complètement la continuation
      }

      // DEUXIÈME VÉRIFICATION : Crédits disponibles
      const creditsRequired = totalTests

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
        setIsLoading(false) // Important : arrêter le loading
        return // Empêcher complètement la continuation
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
        totalTests,
        creditsRequired,
        useCase: state.selectedUseCase,
        userPlan: plan,
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
          useCase: state.selectedUseCase.id,
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

  const getPlanDisplayName = (plan: PlanType) => {
    const names = {
      free: "Free",
      start: "Start",
      scale: "Scale",
    }
    return names[plan]
  }

  const getPlanColor = (plan: PlanType) => {
    const colors = {
      free: "text-gray-400",
      start: "text-blue-400",
      scale: "text-purple-400",
    }
    return colors[plan]
  }

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

      {/* Plan Limit Dialog - Limite de tests par batch - BLOQUE COMPLÈTEMENT */}
      <Dialog open={showPlanLimitDialog} onOpenChange={() => {}}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              Test Batch Limit Exceeded
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Your current plan limits the number of tests you can run in a single batch.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current Plan:</span>
                <span className={`font-medium ${getPlanColor(planInfo?.currentPlan || "free")}`}>
                  {getPlanDisplayName(planInfo?.currentPlan || "free")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Max Tests per Batch:</span>
                <span className="text-white font-medium">{planInfo?.testLimit || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Requested Tests:</span>
                <span className="text-red-400 font-medium">{planInfo?.requestedTests || 0}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-700 pt-2">
                <span className="text-gray-400">Excess Tests:</span>
                <span className="text-red-400 font-medium">
                  {(planInfo?.requestedTests || 0) - (planInfo?.testLimit || 0)}
                </span>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
              <p className="text-red-300 text-sm font-medium mb-1">⚠️ Test Blocked:</p>
              <p className="text-red-200 text-xs">
                You cannot start this test because it exceeds your plan's batch limit. Please reduce the number of tests
                or upgrade your plan.
              </p>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
              <p className="text-yellow-300 text-sm font-medium mb-1">Note:</p>
              <p className="text-yellow-200 text-xs">
                This limit is per test batch, not total credits. You can run multiple smaller batches to use all your
                available credits.
              </p>
            </div>

            <div className="text-sm text-gray-400">
              <p className="mb-2">To run this test batch, you can:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Select fewer models ({Math.ceil((planInfo?.testLimit || 0) / (state.prompts?.length || 1))} max with
                  current prompts)
                </li>
                <li>
                  Reduce the number of prompts (
                  {Math.ceil((planInfo?.testLimit || 0) / (state.selectedModels?.length || 1))} max with current models)
                </li>
                <li>Split into multiple smaller batches</li>
                <li>Upgrade your plan to increase the batch limit</li>
              </ul>
            </div>

            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
              <p className="text-blue-300 text-sm font-medium mb-1">Batch Limits by Plan:</p>
              <div className="text-xs text-blue-200 space-y-1">
                <div>• Free: {PLAN_LIMITS.free} tests per batch</div>
                <div>• Start: {PLAN_LIMITS.start} tests per batch</div>
                <div>• Scale: {PLAN_LIMITS.scale} tests per batch</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowPlanLimitDialog(false)
                  setPlanInfo(null)
                }}
                variant="outline"
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowPlanLimitDialog(false)
                  // Rediriger vers la page de mise à niveau du plan
                  router.push("/settings")
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Credit Dialog - Système de crédits existant */}
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
