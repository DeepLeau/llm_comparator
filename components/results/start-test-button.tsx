"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Loader2 } from "lucide-react"

interface StartTestButtonProps {
  onStartTest: () => void
  modelCount: number
  promptCount: number
}

export function StartTestButton({ onStartTest, modelCount, promptCount }: StartTestButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await onStartTest()
    } finally {
      setIsLoading(false)
    }
  }

  const totalTests = modelCount * promptCount

  return (
    <div className="text-center space-y-4">
      <div className="text-sm text-gray-400">
        Ready to run <span className="font-semibold text-white">{totalTests} tests</span> ({modelCount} models ×{" "}
        {promptCount} prompts)
      </div>

      <Button
        onClick={handleClick}
        disabled={isLoading}
        size="lg"
        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 font-semibold rounded-lg disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Running Tests...
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            Start Test
          </>
        )}
      </Button>
    </div>
  )
}