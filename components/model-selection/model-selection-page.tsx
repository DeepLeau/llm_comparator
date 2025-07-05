"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { ProgressIndicator } from "@/components/use-case-selection/progress-indicator"
import { ModelFilters } from "./model-filters"
import { ModelSelectionTable } from "./model-selection-table"
import { ModelSelectionFooter } from "./model-selection-footer"
import { ModelPagination } from "./model-pagination"
import { generateMockModels } from "./model-data"
import { useWorkflow } from "@/contexts/workflow-context"

const stepNames = ["Use Case", "Models", "Prompts", "Summary"]
const MODELS_PER_PAGE = 20

export function ModelSelectionPage() {
  const router = useRouter()
  const { state, setModels, setCurrentStep, getEstimatedCost } = useWorkflow()
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>(state.selectedModels.map((m) => m.id) || [])
  const [searchQuery, setSearchQuery] = useState("")
  const [licenseFilter, setLicenseFilter] = useState("all")
  const [providerFilter, setProviderFilter] = useState("all")
  const [maxCostFilter, setMaxCostFilter] = useState(100)
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)

  const models = useMemo(() => generateMockModels(), [])

  const filteredAndSortedModels = useMemo(() => {
    const filtered = models.filter((model) => {
      const matchesSearch =
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.provider.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLicense = licenseFilter === "all" || model.license === licenseFilter
      const matchesProvider = providerFilter === "all" || model.provider === providerFilter
      const matchesCost = model.costPer1kTokens * 1000 <= maxCostFilter

      return matchesSearch && matchesLicense && matchesProvider && matchesCost
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a]
      let bValue: any = b[sortBy as keyof typeof b]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [models, searchQuery, licenseFilter, providerFilter, maxCostFilter, sortBy, sortOrder])

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedModels.length / MODELS_PER_PAGE)
  const startIndex = (currentPage - 1) * MODELS_PER_PAGE
  const endIndex = startIndex + MODELS_PER_PAGE
  const currentPageModels = filteredAndSortedModels.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, licenseFilter, providerFilter, maxCostFilter])

  const handleModelToggle = (modelId: string) => {
    setSelectedModelIds((prev) => (prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]))
  }

  const handleSelectAll = () => {
    const currentPageModelIds = currentPageModels.map((model) => model.id)
    const allCurrentPageSelected = currentPageModelIds.every((id) => selectedModelIds.includes(id))

    if (allCurrentPageSelected) {
      // Deselect all models from current page
      setSelectedModelIds((prev) => prev.filter((id) => !currentPageModelIds.includes(id)))
    } else {
      // Select all models from current page
      setSelectedModelIds((prev) => {
        const newSelected = [...prev]
        currentPageModelIds.forEach((id) => {
          if (!newSelected.includes(id)) {
            newSelected.push(id)
          }
        })
        return newSelected
      })
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleBack = () => {
    router.push("/use-case-selection")
  }

  const handleContinue = () => {
    if (selectedModelIds.length > 0) {
      const selectedModels = models.filter((model) => selectedModelIds.includes(model.id))
      setModels(selectedModels)
      setCurrentStep(3)
      router.push("/prompt-input")
    }
  }

  // Check if all models on current page are selected
  const currentPageModelIds = currentPageModels.map((model) => model.id)
  const isAllCurrentPageSelected =
    currentPageModelIds.length > 0 && currentPageModelIds.every((id) => selectedModelIds.includes(id))
  const isSomeCurrentPageSelected = currentPageModelIds.some((id) => selectedModelIds.includes(id))

  return (
    <div className="min-h-screen bg-gray-950">
      <PageHeader title="Model Selection" onBack={handleBack} estimatedCost={getEstimatedCost()} />

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ProgressIndicator currentStep={2} totalSteps={4} stepNames={stepNames} />

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Select Models to Compare</h1>
            <p className="mt-4 text-lg text-gray-400">
              Choose from {models.length}+ AI models to find the best fit for your use case
            </p>
          </div>

          <div className="mb-6">
            <ModelFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              licenseFilter={licenseFilter}
              onLicenseChange={setLicenseFilter}
              providerFilter={providerFilter}
              onProviderChange={setProviderFilter}
              maxCostFilter={maxCostFilter}
              onMaxCostChange={setMaxCostFilter}
              resultCount={filteredAndSortedModels.length}
              totalCount={models.length}
            />
          </div>

          {/* Results and pagination info */}
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedModels.length)} of{" "}
              {filteredAndSortedModels.length} models
              {selectedModelIds.length > 0 && (
                <span className="ml-4 text-blue-400">
                  {selectedModelIds.length} model{selectedModelIds.length !== 1 ? "s" : ""} selected
                </span>
              )}
            </div>
            <div className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          <div className="mb-6">
            <ModelSelectionTable
              models={currentPageModels}
              selectedModels={selectedModelIds}
              onModelToggle={handleModelToggle}
              onSelectAll={handleSelectAll}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={(column) => {
                if (sortBy === column) {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                } else {
                  setSortBy(column)
                  setSortOrder("asc")
                }
              }}
              isAllSelected={isAllCurrentPageSelected}
              isIndeterminate={isSomeCurrentPageSelected && !isAllCurrentPageSelected}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mb-20">
              <ModelPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>

      <ModelSelectionFooter selectedCount={selectedModelIds.length} onBack={handleBack} onContinue={handleContinue} />
    </div>
  )
}
