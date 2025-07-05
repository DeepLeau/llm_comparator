"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, ExternalLink } from "lucide-react"
import { AIRecommendationCard } from "./ai-recommendation-card"
import { ResultsFilters, type FilterState } from "./results-filters"
import { ResultsTable } from "./results-table"
import { ModelOutputSection } from "./model-output-section"
import { ResultsPagination } from "./results-pagination"
import { useWorkflow } from "@/contexts/workflow-context"

export interface TestResult {
  id: string
  modelName: string
  provider: string
  prompt: string
  response: string
  qualityScore: number
  responseTime: number
  cost: number
  license: "open-source" | "commercial"
  timestamp: Date
}

const ITEMS_PER_PAGE = 10

export function ResultsPage() {
  const router = useRouter()
  const { state } = useWorkflow()

  // Initialize filters with default values
  const [filters, setFilters] = useState<FilterState>({
    license: "all",
    minQuality: 1,
    maxCost: 0.1,
    sortBy: "quality",
    sortOrder: "desc",
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [outputCurrentPage, setOutputCurrentPage] = useState(1)

  // Redirect if no data
  useEffect(() => {
    if (!state.selectedModels.length || !state.prompts.length) {
      console.log("No data found, redirecting to use case selection")
      router.push("/use-case-selection")
    }
  }, [state.selectedModels, state.prompts, router])

  // Generate test results based on user selections - one result per model (not per prompt)
  const allResults = useMemo(() => {
    if (!state.selectedModels.length || !state.prompts.length) {
      console.log("No models or prompts available for results generation")
      return []
    }

    console.log("Generating results for:", {
      models: state.selectedModels.map((m) => ({
        id: m.id,
        name: m.name,
        license: m.license,
      })),
      prompts: state.prompts.length,
      useCase: state.selectedUseCase?.name,
    })

    const results: TestResult[] = []

    // Generate one result per model (using the first prompt as representative)
    state.selectedModels.forEach((model) => {
      const representativePrompt = state.prompts[0] // Use first prompt as representative

      // Ensure license is properly mapped
      let modelLicense: "open-source" | "commercial" = "commercial"
      if (model.license === "open-source" || model.license === "Open-source" || model.license === "Open Source") {
        modelLicense = "open-source"
      } else if (model.license === "commercial" || model.license === "Commercial") {
        modelLicense = "commercial"
      }

      // Generate contextual responses based on use case
      const response = generateContextualResponse(
        state.selectedUseCase?.id || "content-generation",
        model.name,
        representativePrompt.content || representativePrompt.userPrompt || "No prompt content",
      )

      const result: TestResult = {
        id: `${model.id}-summary`,
        modelName: model.name,
        provider: model.provider,
        prompt: representativePrompt.content || representativePrompt.userPrompt || "No prompt content",
        response,
        qualityScore: Math.random() * 2 + 3, // 3-5 range
        responseTime: Math.random() * 2000 + 500, // 500-2500ms
        cost: (model.costPer1kTokens * (Math.random() * 500 + 100)) / 1000, // Simulate token usage
        license: modelLicense,
        timestamp: new Date(),
      }

      results.push(result)
    })

    console.log(
      "Generated unique results:",
      results.map((r) => ({
        model: r.modelName,
        license: r.license,
        cost: r.cost.toFixed(4),
        quality: r.qualityScore.toFixed(1),
      })),
    )

    return results
  }, [state.selectedModels, state.prompts, state.selectedUseCase])

  // Apply filters and sorting
  const filteredResults = useMemo(() => {
    console.log("Applying filters:", filters)
    console.log("All results before filtering:", allResults.length)

    const filtered = allResults.filter((result) => {
      // License filter
      if (filters.license !== "all") {
        console.log(`Filtering by license: ${filters.license}, result license: ${result.license}`)
        if (result.license !== filters.license) {
          return false
        }
      }

      // Min quality filter (show models with quality >= minQuality)
      if (result.qualityScore < filters.minQuality) {
        return false
      }

      // Max cost filter (show models that cost LESS than or equal to the max cost)
      if (result.cost > filters.maxCost) {
        return false
      }

      return true
    })

    console.log("Filtered results:", filtered.length)

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (filters.sortBy) {
        case "quality":
          aValue = a.qualityScore
          bValue = b.qualityScore
          break
        case "cost":
          aValue = a.cost
          bValue = b.cost
          break
        case "responseTime":
          aValue = a.responseTime
          bValue = b.responseTime
          break
        case "model":
          aValue = a.modelName
          bValue = b.modelName
          break
        case "license":
          aValue = a.license
          bValue = b.license
          break
        default:
          return 0
      }

      if (typeof aValue === "string") {
        return filters.sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return filters.sortOrder === "asc" ? aValue - bValue : bValue - aValue
    })

    return filtered
  }, [allResults, filters])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
    setOutputCurrentPage(1)
  }, [filters])

  // Pagination for results table
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredResults.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredResults, currentPage])

  // Pagination for model outputs
  const paginatedOutputs = useMemo(() => {
    const startIndex = (outputCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredResults.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredResults, outputCurrentPage])

  // Find recommended model (highest quality score)
  const recommendedModel = useMemo(() => {
    if (filteredResults.length === 0) return null
    return filteredResults.reduce((best, current) => (current.qualityScore > best.qualityScore ? current : best))
  }, [filteredResults])

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE)

  const exportResults = () => {
    const csvContent = [
      ["Model", "Provider", "Prompt", "Quality Score", "Response Time (ms)", "Cost ($)", "License"],
      ...filteredResults.map((result) => [
        result.modelName,
        result.provider,
        result.prompt.replace(/,/g, ";"), // Replace commas to avoid CSV issues
        result.qualityScore.toFixed(2),
        result.responseTime.toFixed(0),
        result.cost.toFixed(4),
        result.license,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `llm-comparison-results-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!state.selectedModels.length || !state.prompts.length) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-white">Test Results</h1>
                <p className="text-sm text-gray-400">
                  {state.selectedModels.length} models • {state.prompts.length} prompts • {filteredResults.length}{" "}
                  results
                  {state.selectedUseCase && ` • ${state.selectedUseCase.name}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={exportResults}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* AI Recommendation */}
          {recommendedModel && <AIRecommendationCard model={recommendedModel} />}

          {/* Filters */}
          <ResultsFilters filters={filters} onFiltersChange={setFilters} />

          {/* Results Overview */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Results Overview</h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/30">
                  {filteredResults.length} Results
                </Badge>
                <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-600/30">
                  Avg Quality:{" "}
                  {filteredResults.length > 0
                    ? (filteredResults.reduce((sum, r) => sum + r.qualityScore, 0) / filteredResults.length).toFixed(1)
                    : "0"}
                </Badge>
                <Badge variant="secondary" className="bg-orange-600/20 text-orange-300 border-orange-600/30">
                  Avg Cost: $
                  {filteredResults.length > 0
                    ? (filteredResults.reduce((sum, r) => sum + r.cost, 0) / filteredResults.length).toFixed(4)
                    : "0"}
                </Badge>
              </div>
            </div>

            <ResultsTable results={paginatedResults} />

            {totalPages > 1 && (
              <ResultsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}
          </div>

          {/* Model Outputs */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Model Outputs</h2>
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                {filteredResults.length} Outputs
              </Badge>
            </div>

            <div className="space-y-6">
              {paginatedOutputs.map((result) => (
                <ModelOutputSection key={result.id} result={result} />
              ))}
            </div>

            {totalPages > 1 && (
              <ResultsPagination
                currentPage={outputCurrentPage}
                totalPages={totalPages}
                onPageChange={setOutputCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function generateContextualResponse(useCaseId: string, modelName: string, prompt: string): string {
  const responses: Record<string, string[]> = {
    "content-generation": [
      `Here's a compelling product description that highlights key features and benefits, crafted to engage your target audience and drive conversions.`,
      `I've created engaging social media content that balances informative value with entertainment, optimized for maximum reach and engagement.`,
      `This blog post combines SEO best practices with valuable insights, structured to keep readers engaged from introduction to conclusion.`,
      `Here's a professional newsletter that maintains brand voice while delivering valuable content to your subscribers.`,
    ],
    "code-assistance": [
      `\`\`\`python\ndef optimize_function(data):\n    # Optimized implementation with error handling\n    try:\n        result = process_data(data)\n        return result\n    except Exception as e:\n        logger.error(f"Error processing: {e}")\n        return None\n\`\`\``,
      `I've identified the bug in your code. The issue is in the loop condition. Here's the corrected version with proper error handling and optimization.`,
      `Here's comprehensive documentation for your function, including parameter descriptions, return values, and usage examples.`,
      `\`\`\`python\ndef test_function():\n    assert function_name(test_input) == expected_output\n    assert function_name(edge_case) == edge_result\n\`\`\``,
    ],
    "data-analysis": [
      `Based on the sales data analysis, I've identified a 23% increase in Q3 performance, with the highest growth in the mobile segment. Key trends show seasonal patterns that suggest optimal timing for future campaigns.`,
      `Customer feedback analysis reveals 87% satisfaction rate with three main improvement areas: response time, product variety, and pricing transparency. Detailed breakdown shows regional variations in preferences.`,
      `Financial report analysis indicates strong revenue growth of 15% YoY, with improved profit margins in core business segments. Risk factors include market volatility and supply chain dependencies.`,
      `The data visualization reveals clear correlations between marketing spend and customer acquisition, with optimal ROI achieved at $2.3K monthly budget allocation.`,
    ],
    "customer-support": [
      `Thank you for contacting us! I understand your concern about the product delivery. I've checked your order status and can confirm it's currently in transit. You should receive it within 2-3 business days. I'll send you tracking information shortly.`,
      `I apologize for the inconvenience you've experienced. Let me help resolve this issue immediately. I've escalated your case to our technical team and you can expect a resolution within 24 hours. Here's your reference number: CS-2024-001.`,
      `Here's a comprehensive FAQ response that addresses the most common questions about our service, including step-by-step troubleshooting guides and contact information for additional support.`,
      `I've created an automated email response template that maintains a personal touch while efficiently addressing common customer inquiries and providing relevant resources.`,
    ],
    translation: [
      `Voici la traduction française de votre contenu marketing, adaptée culturellement pour le marché francophone avec les nuances appropriées et le ton professionnel requis.`,
      `Here's the English localization of your content, adapted for the US market with appropriate cultural references and business terminology that resonates with your target audience.`,
      `Esta es la traducción al español de su documentación técnica, manteniendo la precisión técnica mientras se adapta a las convenciones lingüísticas del mercado hispanohablante.`,
      `I've translated your marketing materials with cultural adaptation, ensuring the message resonates with local audiences while maintaining brand consistency and compliance with regional regulations.`,
    ],
    research: [
      `Based on comprehensive research analysis, the academic literature shows strong consensus on this topic with 89% of studies supporting the primary hypothesis. Key findings include methodological improvements and practical applications.`,
      `Market research indicates significant growth potential in the target segment, with projected 34% CAGR over the next 5 years. Competitive analysis reveals three main market leaders and emerging opportunities.`,
      `Executive summary: The research findings support strategic expansion into new markets, with recommended investment of $2.5M over 18 months. Risk mitigation strategies and success metrics are outlined in the detailed report.`,
      `Industry trend analysis reveals shifting consumer preferences toward sustainable solutions, with 67% of surveyed customers willing to pay premium prices for environmentally conscious products.`,
    ],
  }

  const useCaseResponses = responses[useCaseId] || responses["content-generation"]
  const randomResponse = useCaseResponses[Math.floor(Math.random() * useCaseResponses.length)]

  return `${randomResponse}\n\n[Generated by ${modelName}]`
}
