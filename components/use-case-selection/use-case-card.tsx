"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"

interface UseCaseCardProps {
  title: string
  description: string
  examples: string[]
  icon: React.ReactNode
  isSelected: boolean
  onClick: () => void
}

export function UseCaseCard({ title, description, examples, icon, isSelected, onClick }: UseCaseCardProps) {
  return (
    <Card
      className={`
        cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg
        ${
          isSelected
            ? "bg-blue-600/20 border-blue-500 shadow-blue-500/20"
            : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
        }
      `}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-600/30" : "bg-gray-800"}`}>{icon}</div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          {isSelected && (
            <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <p className="text-gray-400 mb-4 text-sm leading-relaxed">{description}</p>

        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Examples:</h4>
          <ul className="space-y-1">
            {examples.slice(0, 3).map((example, index) => (
              <li key={index} className="text-xs text-gray-500 flex items-start">
                <span className="w-1 h-1 bg-gray-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                {example}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
