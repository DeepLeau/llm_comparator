import { MessageSquare } from "lucide-react"
import type { Prompt } from "@/contexts/workflow-context"

interface PromptsSectionProps {
  prompts?: Prompt[]
}

export function PromptsSection({ prompts = [] }: PromptsSectionProps) {
  if (prompts.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Test Prompts ({prompts.length})</h2>
      <div className="space-y-3">
        {prompts.map((prompt, index) => (
          <div key={prompt.id} className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 mt-1">
                <MessageSquare className="h-4 w-4 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white mb-2">Prompt {index + 1}</h3>
                {prompt.systemPrompt && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">System Prompt</p>
                    <p className="text-sm text-gray-300 bg-gray-800/50 rounded p-2">{prompt.systemPrompt}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">User Prompt</p>
                  <p className="text-sm text-gray-300 bg-gray-800/50 rounded p-2">{prompt.userPrompt}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
