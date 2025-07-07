"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWorkflow } from "@/contexts/workflow-context"
import { Play, AlertTriangle } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export function StartTestButton() {
  const [isLoading, setIsLoading] = useState(false)
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
    setIsLoading(true)

    try {
      const creditsRequired = (state.selectedModels?.length || 0) * (state.prompts?.length || 0)

      if (creditsRequired === 0) {
        throw new Error("No models or prompts selected")
      }

      // Get auth token
      const token = await getAuthToken()
      if (!token) {
        throw new Error("Not authenticated")
      }

      // Check credits
      const creditResponse = await fetch("/api/check-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ creditsRequired }),
      })

      if (!creditResponse.ok) {
        throw new Error("Failed to check credits")
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

      // Start the test (simulate API call)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Consume credits after successful test
      const consumeResponse = await fetch("/api/consume-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ creditsToConsume: creditsRequired }),
      })

      if (!consumeResponse.ok) {
        console.error("Failed to consume credits, but test completed")
      }

      // Navigate to results
      router.push("/results")
    } catch (error) {
      console.error("Error starting test:", error)
      alert("Failed to start test. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const creditsRequired = (state.selectedModels?.length || 0) * (state.prompts?.length || 0)

  return (
    <>
      <Button
        onClick={handleStartTest}
        disabled={isLoading || creditsRequired === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        size="lg"
      >
        <Play className="w-4 h-4 mr-2" />
        {isLoading ? "Starting Test..." : `Start Test (${creditsRequired} credits)`}
      </Button>

      <Dialog open={showInsufficientCreditsDialog} onOpenChange={setShowInsufficientCreditsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Insufficient Credits
            </DialogTitle>
            <DialogDescription className="space-y-3">
              <p>
                You need <strong>{creditInfo?.required}</strong> credits to run this test, but you only have{" "}
                <strong>{creditInfo?.current}</strong> credits available.
              </p>
              <p>To reduce the number of credits required, you can:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Select fewer models</li>
                <li>Use fewer prompts</li>
                <li>Purchase more credits from your account settings</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowInsufficientCreditsDialog(false)}>
              Close
            </Button>
            <Button onClick={() => router.push("/settings")}>Buy Credits</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
