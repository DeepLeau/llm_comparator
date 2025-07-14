"use client"

import { ArrowLeft } from "lucide-react"

interface PromptInputHeaderProps {
  estimatedCost: number
  onBack: () => void
}

export function PromptInputHeader({ estimatedCost, onBack }: PromptInputHeaderProps) {
  return (
    <div className="bg-gray-900/50 border-b border-gray-800 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Back button */}
          <div className="flex items-center gap-6">
            {/* Logo placeholder */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="rounded" />
              </div>
              <span className="text-white font-semibold text-lg hidden sm:block">LLM Comparator</span>
            </div>

            {/* Back button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back</span>
            </button>
          </div>

          {/* Right side - Estimated Cost */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Estimated Cost:</span>
            <div className="bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700">
              <span className="text-green-400 font-semibold">${estimatedCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
