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
import { getCurrentTestSession } from "@/lib/test-results"

const ITEMS_PER_PAGE = 10

export function ResultsPage() {
  const router = useRouter()
  const [testSession, setTestSession] = useState<any>(null)

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

  // Load test session
  useEffect(() => {
    const session = getCurrentTestSession()
    if (session) {
      setTestSession(session)
    } else {
      console.log("No test session found, redirecting to use case selection")
      router.push("/use-case-selection")
    }
  }, [router])

  // Convert test results to individual prompt results for Model Outputs section
  const allIndividualResults = useMemo(() => {
    if (!testSession?.results) return []

    return testSession.results.flatMap((result: any) => {
      if (!result.promptResults || result.promptResults.length === 0) {
        // Si pas de promptResults, créer un résultat unique
        return [
          {
            id: result.id,
            modelName: result.modelName,
            provider: result.provider,
            prompt: testSession.prompts?.[0] || "No prompt",
            response: result.error || "No response available",
            qualityScore: result.averageScore || 0,
            responseTime: result.averageResponseTime || 0,
            cost: result.averageCost || 0,
            license: result.isOpenSource ? "open-source" : "commercial",
            timestamp: new Date(),
          },
        ]
      }

      // Créer un résultat pour chaque prompt
      return result.promptResults.map((promptResult: any, index: number) => ({
        id: `${result.id}-${index}`,
        modelName: result.modelName,
        provider: result.provider,
        prompt: promptResult.prompt,
        response: promptResult.error || promptResult.response,
        qualityScore: promptResult.score || 0,
        responseTime: promptResult.responseTime || 0,
        cost: promptResult.cost || 0,
        license: result.isOpenSource ? "open-source" : "commercial",
        timestamp: new Date(),
      }))
    })
  }, [testSession])

  // Convert test results to aggregated model results for Results Overview table
  const aggregatedModelResults = useMemo(() => {
    if (!testSession?.results) return []

    return testSession.results.map((result: any) => {
      // Calculer les moyennes à partir des promptResults
      let avgQuality = 0
      let avgResponseTime = 0
      let avgCost = 0
      let totalCost = 0
      let successfulPrompts = 0

      if (result.promptResults && result.promptResults.length > 0) {
        const validResults = result.promptResults.filter((pr: any) => !pr.error)
        successfulPrompts = validResults.length

        if (validResults.length > 0) {
          avgQuality = validResults.reduce((sum: number, pr: any) => sum + (pr.score || 0), 0) / validResults.length
          avgResponseTime =
            validResults.reduce((sum: number, pr: any) => sum + (pr.responseTime || 0), 0) / validResults.length
          avgCost = validResults.reduce((sum: number, pr: any) => sum + (pr.cost || 0), 0) / validResults.length
          totalCost = validResults.reduce((sum: number, pr: any) => sum + (pr.cost || 0), 0)
        }
      } else {
        // Fallback sur les données agrégées du résultat
        avgQuality = result.averageScore || 0
        avgResponseTime = result.averageResponseTime || 0
        avgCost = result.averageCost || 0
        totalCost = result.totalCost || 0
        successfulPrompts = 1
      }

      return {
        id: result.id,
        modelName: result.modelName,
        provider: result.provider,
        qualityScore: avgQuality,
        responseTime: avgResponseTime,
        cost: avgCost,
        totalCost: totalCost,
        license: result.isOpenSource ? "open-source" : "commercial",
        successfulPrompts: successfulPrompts,
        totalPrompts: result.promptResults?.length || 1,
        timestamp: new Date(),
      }
    })
  }, [testSession])

  // Apply filters and sorting to aggregated results
  const filteredAggregatedResults = useMemo(() => {
    if (!aggregatedModelResults.length) return []

    const filtered = aggregatedModelResults.filter((result: any) => {
      // License filter
      if (filters.license !== "all") {
        if (result.license !== filters.license) {
          return false
        }
      }

      // Min quality filter
      if (result.qualityScore < filters.minQuality) {
        return false
      }

      // Max cost filter
      if (result.cost > filters.maxCost) {
        return false
      }

      return true
    })

    // Apply sorting
    filtered.sort((a: any, b: any) => {
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
  }, [aggregatedModelResults, filters])

  // Apply filters to individual results for Model Outputs
  const filteredIndividualResults = useMemo(() => {
    if (!allIndividualResults.length) return []

    const filtered = allIndividualResults.filter((result: any) => {
      // License filter
      if (filters.license !== "all") {
        if (result.license !== filters.license) {
          return false
        }
      }

      // Min quality filter
      if (result.qualityScore < filters.minQuality) {
        return false
      }

      // Max cost filter
      if (result.cost > filters.maxCost) {
        return false
      }

      return true
    })

    // Apply sorting
    filtered.sort((a: any, b: any) => {
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
  }, [allIndividualResults, filters])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
    setOutputCurrentPage(1)
  }, [filters])

  // Pagination for results table (aggregated)
  const paginatedAggregatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAggregatedResults.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredAggregatedResults, currentPage])

  // Pagination for model outputs (individual)
  const paginatedIndividualOutputs = useMemo(() => {
    const startIndex = (outputCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredIndividualResults.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredIndividualResults, outputCurrentPage])

  // Find recommended model (highest quality score from aggregated results)
  const recommendedModel = useMemo(() => {
    if (filteredAggregatedResults.length === 0) return null
    return filteredAggregatedResults.reduce((best: any, current: any) =>
      current.qualityScore > best.qualityScore ? current : best,
    )
  }, [filteredAggregatedResults])

  const totalPagesAggregated = Math.ceil(filteredAggregatedResults.length / ITEMS_PER_PAGE)
  const totalPagesIndividual = Math.ceil(filteredIndividualResults.length / ITEMS_PER_PAGE)

  const exportResults = () => {
    const csvContent = [
      ["Model", "Provider", "Avg Quality Score", "Avg Response Time (ms)", "Avg Cost ($)", "Total Cost ($)", "License"],
      ...filteredAggregatedResults.map((result: any) => [
        result.modelName,
        result.provider,
        result.qualityScore.toFixed(2),
        result.responseTime.toFixed(0),
        result.cost.toFixed(4),
        result.totalCost.toFixed(4),
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

  if (!testSession) {
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
                  {testSession.stats?.totalModels || testSession.results?.length || 0} models •{" "}
                  {testSession.stats?.successfulTests || 0} successful • {filteredAggregatedResults.length} results
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
                onClick={() => router.push("/compare")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Advanced Compare
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
                  {filteredAggregatedResults.length} Models
                </Badge>
                <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-600/30">
                  Avg Quality:{" "}
                  {filteredAggregatedResults.length > 0
                    ? (
                        filteredAggregatedResults.reduce((sum: number, r: any) => sum + r.qualityScore, 0) /
                        filteredAggregatedResults.length
                      ).toFixed(1)
                    : "0"}
                </Badge>
                <Badge variant="secondary" className="bg-orange-600/20 text-orange-300 border-orange-600/30">
                  Avg Cost: $
                  {filteredAggregatedResults.length > 0
                    ? (
                        filteredAggregatedResults.reduce((sum: number, r: any) => sum + r.cost, 0) /
                        filteredAggregatedResults.length
                      ).toFixed(4)
                    : "0"}
                </Badge>
              </div>
            </div>
            <ResultsTable results={paginatedAggregatedResults} />
            {totalPagesAggregated > 1 && (
              <ResultsPagination
                currentPage={currentPage}
                totalPages={totalPagesAggregated}
                onPageChange={setCurrentPage}
              />
            )}
          </div>

          {/* Model Outputs */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Model Outputs</h2>
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                {filteredIndividualResults.length} Outputs
              </Badge>
            </div>
            <div className="space-y-6">
              {paginatedIndividualOutputs.map((result: any) => (
                <ModelOutputSection key={result.id} result={result} />
              ))}
            </div>
            {totalPagesIndividual > 1 && (
              <ResultsPagination
                currentPage={outputCurrentPage}
                totalPages={totalPagesIndividual}
                onPageChange={setOutputCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}