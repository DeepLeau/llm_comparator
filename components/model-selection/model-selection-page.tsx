"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { ProgressIndicator } from "@/components/use-case-selection/progress-indicator"
import { ModelFilters } from "./model-filters"
import { ModelSelectionTable } from "./model-selection-table"
import { ModelSelectionFooter } from "./model-selection-footer"
import { ModelPagination } from "./model-pagination"
import { fetchModels } from "@/lib/models"
import { useWorkflow } from "@/contexts/workflow-context"
import type { LLMModel } from "./model-data"
import { supabase } from "@/lib/supabase"

const stepNames = ["Use Case", "Models", "Prompts", "Summary"]
const MODELS_PER_PAGE = 20

export function ModelSelectionPage() {
  const router = useRouter()
  const { state, setModels, setCurrentStep } = useWorkflow()

  // State pour les modèles et le chargement
  const [allModels, setAllModels] = useState<LLMModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize with previously selected models
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>(state.selectedModels.map((m) => m.id) || [])

  // Filtres
  const [searchQuery, setSearchQuery] = useState("")
  const [licenseFilter, setLicenseFilter] = useState("all")
  const [providerFilter, setProviderFilter] = useState("all")
  const [storesDataFilter, setStoresDataFilter] = useState("all")
  const [maxInputPriceFilter, setMaxInputPriceFilter] = useState(1)
  const [maxOutputPriceFilter, setMaxOutputPriceFilter] = useState(1)

  // Tri et pagination
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)

  const [userPlan, setUserPlan] = useState<string | null>(null)

  // Fonction pour récupérer le plan de l'utilisateur
  const loadUserPlan = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase.from("users").select("plan").eq("id", user.id).single()

        if (error) {
          console.error("Failed to load user plan:", error)
          setUserPlan("free") // Fallback to free plan
        } else {
          setUserPlan(data?.plan || "free")
        }
      } else {
        setUserPlan("free") // Non-authenticated users see free models only
      }
    } catch (err) {
      console.error("Error loading user plan:", err)
      setUserPlan("free") // Fallback to free plan
    }
  }

  // Charger les modèles depuis Supabase
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const models = await fetchModels()
        setAllModels(models)

        // Charger aussi le plan utilisateur
        await loadUserPlan()
      } catch (err) {
        console.error("Failed to load models:", err)
        setError("Failed to load models. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadModels()
  }, [])

  // Filtrage et tri des modèles
  const filteredAndSortedModels = useMemo(() => {
    const filtered = allModels.filter((model) => {
      // Filtre par plan utilisateur - si l'utilisateur a un plan "free", ne montrer que les modèles gratuits
      if (userPlan === "free" && model.subscription_plan !== "free") {
        return false
      }

      // Filtre de recherche
      const matchesSearch =
        !searchQuery ||
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.provider.toLowerCase().includes(searchQuery.toLowerCase())

      // Filtre licence
      const matchesLicense =
        licenseFilter === "all" ||
        (licenseFilter === "open_source" && model.is_open_source) ||
        (licenseFilter === "proprietary" && !model.is_open_source)

      // Filtre provider
      const matchesProvider = providerFilter === "all" || model.provider === providerFilter

      // Filtre stockage des données
      const matchesStoresData =
        storesDataFilter === "all" ||
        (storesDataFilter === "yes" && model.stores_data) ||
        (storesDataFilter === "no" && !model.stores_data)

      // Filtres de prix
      const matchesInputPrice = model.pricing_prompt <= maxInputPriceFilter
      const matchesOutputPrice = model.pricing_completion <= maxOutputPriceFilter

      return (
        matchesSearch &&
        matchesLicense &&
        matchesProvider &&
        matchesStoresData &&
        matchesInputPrice &&
        matchesOutputPrice
      )
    })

    // Tri
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof LLMModel]
      let bValue: any = b[sortBy as keyof LLMModel]

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
  }, [
    allModels,
    userPlan, // Ajouter userPlan aux dépendances
    searchQuery,
    licenseFilter,
    providerFilter,
    storesDataFilter,
    maxInputPriceFilter,
    maxOutputPriceFilter,
    sortBy,
    sortOrder,
  ])

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedModels.length / MODELS_PER_PAGE)
  const startIndex = (currentPage - 1) * MODELS_PER_PAGE
  const endIndex = startIndex + MODELS_PER_PAGE
  const currentPageModels = filteredAndSortedModels.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, licenseFilter, providerFilter, storesDataFilter, maxInputPriceFilter, maxOutputPriceFilter])

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
      // Get the full model objects for the selected IDs
      const selectedModels = allModels.filter((model) => selectedModelIds.includes(model.id))

      // Convert to the format expected by WorkflowContext
      const workflowModels = selectedModels.map((model) => ({
        id: model.id,
        name: model.name,
        provider: model.provider,
        license: model.is_open_source ? ("open-source" as const) : ("commercial" as const),
        costPer1kTokens: model.pricing_prompt,
        contextWindow: model.context_length,
        description: `${model.provider} model with ${model.context_length.toLocaleString()} token context`,
        strengths: [],
        inputCost: model.pricing_prompt,
        outputCost: model.pricing_completion,
      }))

      // Save to context
      setModels(workflowModels)
      setCurrentStep(3)

      console.log("Selected models saved to context:", workflowModels)

      router.push("/prompt-input")
    }
  }

  // Check if all models on current page are selected
  const currentPageModelIds = currentPageModels.map((model) => model.id)
  const isAllCurrentPageSelected =
    currentPageModelIds.length > 0 && currentPageModelIds.every((id) => selectedModelIds.includes(id))
  const isSomeCurrentPageSelected = currentPageModelIds.some((id) => selectedModelIds.includes(id))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading models...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <PageHeader title="Model Selection" onBack={handleBack} />

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ProgressIndicator currentStep={2} totalSteps={4} stepNames={stepNames} />

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Select Models to Compare</h1>
            <p className="mt-4 text-lg text-gray-400">
              Choose from {allModels.length}+ AI models to find the best fit for your use case
              {userPlan === "free" && (
                <span className="block mt-2 text-amber-400">
                  🆓 Free plan: Showing free models only. Upgrade to access premium models.
                </span>
              )}
            </p>
            {state.selectedUseCase && (
              <p className="mt-2 text-blue-400">Selected use case: {state.selectedUseCase.name}</p>
            )}
          </div>

          <div className="mb-6">
            <ModelFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              licenseFilter={licenseFilter}
              onLicenseChange={setLicenseFilter}
              providerFilter={providerFilter}
              onProviderChange={setProviderFilter}
              storesDataFilter={storesDataFilter}
              onStoresDataChange={setStoresDataFilter}
              maxInputPriceFilter={maxInputPriceFilter}
              onMaxInputPriceChange={setMaxInputPriceFilter}
              maxOutputPriceFilter={maxOutputPriceFilter}
              onMaxOutputPriceChange={setMaxOutputPriceFilter}
              resultCount={filteredAndSortedModels.length}
              totalCount={allModels.length}
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

