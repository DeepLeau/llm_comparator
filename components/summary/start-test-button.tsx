"use client"

import { Button } from "@/components/ui/button"
import { Play, Loader2 } from "lucide-react"

interface StartTestButtonProps {
  onStartTest: () => void
  isLoading: boolean
  modelCount: number
  promptCount: number
}

export function StartTestButton({ onStartTest, isLoading, modelCount, promptCount }: StartTestButtonProps) {
  const totalTests = modelCount * promptCount

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-6 text-center">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-white">Ready to start testing</h3>
          <p className="text-gray-400">
            This will run <span className="font-semibold text-white">{totalTests} tests</span> ({modelCount} models ×{" "}
            {promptCount} prompts)
          </p>
        </div>

        <Button
          onClick={onStartTest}
          disabled={isLoading}
          size="lg"
          className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto sm:px-12"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Starting test...
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Start Test
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
