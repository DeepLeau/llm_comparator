"use client"

import { PromptCard } from "./prompt-card"
import type { Prompt } from "@/contexts/workflow-context"

interface PromptListProps {
  prompts: Prompt[]
  onDeletePrompt: (id: string) => void
}

export function PromptList({ prompts, onDeletePrompt }: PromptListProps) {
  if (prompts.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-8 text-center">
        <p className="text-gray-400">No prompts added yet. Create your first prompt above to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Your Prompts</h2>
        <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400">
          {prompts.length} prompt{prompts.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-4">
        {prompts.map((prompt, index) => (
          <PromptCard key={prompt.id} prompt={prompt} index={index} onDelete={() => onDeletePrompt(prompt.id)} />
        ))}
      </div>
    </div>
  )
}
