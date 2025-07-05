"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface ModelSelectionFooterProps {
  selectedCount: number
  onBack: () => void
  onContinue: () => void
}

export function ModelSelectionFooter({ selectedCount, onBack, onContinue }: ModelSelectionFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            {selectedCount > 0 ? (
              <>
                <span className="text-blue-400 font-medium">{selectedCount}</span> model
                {selectedCount !== 1 ? "s" : ""} selected
              </>
            ) : (
              "Select models to continue"
            )}
          </p>
        </div>

        <Button
          onClick={onContinue}
          disabled={selectedCount === 0}
          className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
