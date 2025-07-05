"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, ChevronDown, ChevronUp, MessageSquare, User, Calendar } from "lucide-react"
import type { Prompt } from "@/contexts/workflow-context"

interface PromptCardProps {
  prompt: Prompt
  index: number
  onDelete: () => void
}

export function PromptCard({ prompt, index, onDelete }: PromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-colors hover:bg-gray-900/70">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-sm font-medium text-blue-400">
            {index + 1}
          </span>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="h-4 w-4" />
            {formatDate(prompt.createdAt)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-300"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* System Prompt */}
        {prompt.systemPrompt && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">System Prompt</span>
              <span className="text-xs text-gray-500">({prompt.systemPrompt.length} chars)</span>
            </div>
            <div className="rounded-md bg-purple-500/10 p-3">
              <p className="text-sm text-gray-300 leading-relaxed">
                {isExpanded ? prompt.systemPrompt : truncateText(prompt.systemPrompt, 150)}
              </p>
            </div>
          </div>
        )}

        {/* User Prompt */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">User Prompt</span>
            <span className="text-xs text-gray-500">({prompt.userPrompt.length} chars)</span>
          </div>
          <div className="rounded-md bg-green-500/10 p-3">
            <p className="text-sm text-gray-300 leading-relaxed">
              {isExpanded ? prompt.userPrompt : truncateText(prompt.userPrompt, 150)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

