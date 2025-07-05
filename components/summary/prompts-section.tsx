import { Badge } from "@/components/ui/badge"
import { MessageSquare, User } from "lucide-react"

interface Prompt {
  id: string
  systemPrompt: string
  userPrompt: string
}

interface PromptsSectionProps {
  prompts: Prompt[]
}

export function PromptsSection({ prompts }: PromptsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Prompts</h2>
        <Badge variant="secondary" className="bg-gray-800 text-gray-300">
          {prompts.length} prompt{prompts.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="space-y-4">
        {prompts.map((prompt, index) => (
          <div key={prompt.id} className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-white">Prompt #{index + 1}</h3>
            </div>

            <div className="space-y-4">
              {/* System Prompt */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-400">System Prompt</span>
                </div>
                <div className="rounded-md bg-purple-500/10 p-3">
                  <p className="text-sm text-gray-300 leading-relaxed">{prompt.systemPrompt}</p>
                </div>
              </div>

              {/* User Prompt */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">User Prompt</span>
                </div>
                <div className="rounded-md bg-green-500/10 p-3">
                  <p className="text-sm text-gray-300 leading-relaxed">{prompt.userPrompt}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}