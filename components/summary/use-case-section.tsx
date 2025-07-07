import { PenTool, Code, BarChart, MessageCircle, Globe, Search } from "lucide-react"

interface UseCase {
  id: string
  name: string
  description: string
}

interface UseCaseSectionProps {
  useCase?: UseCase | null
}

const useCaseIcons = {
  "content-generation": PenTool,
  "code-assistance": Code,
  "data-analysis": BarChart,
  "customer-support": MessageCircle,
  translation: Globe,
  research: Search,
}

export function UseCaseSection({ useCase }: UseCaseSectionProps) {
  if (!useCase) {
    return null
  }

  const IconComponent = useCaseIcons[useCase.id as keyof typeof useCaseIcons] || PenTool

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Use Case</h2>
      <div className="rounded-lg border border-gray-800 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
            <IconComponent className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{useCase.name}</h3>
            <p className="text-gray-400">{useCase.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
