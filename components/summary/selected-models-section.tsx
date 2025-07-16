import { Badge } from "@/components/ui/badge"
import { Cpu } from "lucide-react"
import type { Model } from "@/contexts/workflow-context"

interface SelectedModelsSectionProps {
  models?: Model[]
}

export function SelectedModelsSection({ models = [] }: SelectedModelsSectionProps) {
  if (models.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Selected Models ({models.length})</h2>
      <div className="grid gap-4">
        {models.map((model) => (
          <div key={model.id} className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                  <Cpu className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{model.name}</h3>
                  <p className="text-sm text-gray-400">{model.provider}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={model.license === "open-source" ? "secondary" : "outline"}
                  className={
                    model.license === "open-source"
                      ? "bg-green-600/20 text-green-300 border-green-600/30"
                      : "bg-blue-600/20 text-blue-300 border-blue-600/30"
                  }
                >
                  {model.license === "open-source" ? "Open Source" : "Proprietary"}
                </Badge>
                <span className="text-sm text-gray-400">${model.costPer1kTokens*1000}/1k tokens</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
