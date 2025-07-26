import { supabase } from "./supabase"

export interface Model {
  id: string
  name: string
  provider: string
  context_length: number
  is_open_source: boolean
  stores_data: boolean
  pricing_prompt: number
  pricing_completion: number
  subscription_plan: string
}

export interface ModelWithSelection extends Model {
  selected?: boolean
}

export interface TestResult {
  id: string
  modelId: string
  modelName: string
  provider: string
  response: string
  responseTime: number
  cost: number
  score: number
  timestamp: Date
  error?: string
}

export async function fetchModels(): Promise<Model[]> {
  try {
    const { data, error } = await supabase
  .from("models")
  .select("*")
  .gt("request_price", 0)
  .lte("request_price", 0.021)
  .order("name")


    if (error) {
      console.error("Error fetching models:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch models:", error)
    throw error
  }
}

export async function searchModels(filters: {
  searchQuery?: string
  licenseFilter?: "all" | "open_source" | "proprietary"
  providerFilter?: string
  storesDataFilter?: "all" | "yes" | "no"
  maxInputPrice?: number
  maxOutputPrice?: number
}): Promise<Model[]> {
  try {
    let query = supabase.from("models").select("*")

    // Filtre de recherche textuelle
    if (filters.searchQuery && filters.searchQuery.trim()) {
      query = query.or(`name.ilike.%${filters.searchQuery}%,provider.ilike.%${filters.searchQuery}%`)
    }

    // Filtre licence (open source vs propriétaire)
    if (filters.licenseFilter && filters.licenseFilter !== "all") {
      const isOpenSource = filters.licenseFilter === "open_source"
      query = query.eq("is_open_source", isOpenSource)
    }

    // Filtre provider
    if (filters.providerFilter && filters.providerFilter !== "all") {
      query = query.eq("provider", filters.providerFilter)
    }

    // Filtre stockage des données
    if (filters.storesDataFilter && filters.storesDataFilter !== "all") {
      const storesData = filters.storesDataFilter === "yes"
      query = query.eq("stores_data", storesData)
    }

    // Filtres de prix
    if (filters.maxInputPrice !== undefined) {
      query = query.lte("pricing_prompt", filters.maxInputPrice)
    }

    if (filters.maxOutputPrice !== undefined) {
      query = query.lte("pricing_completion", filters.maxOutputPrice)
    }

    query = query.order("name")

    const { data, error } = await query

    if (error) {
      console.error("Error searching models:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Failed to search models:", error)
    throw error
  }
}

export async function getUniqueProviders(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("models").select("provider").order("provider")

    if (error) {
      console.error("Error fetching providers:", error)
      throw error
    }

    // Extraire les providers uniques
    const uniqueProviders = [...new Set(data?.map((item) => item.provider) || [])]
    return uniqueProviders
  } catch (error) {
    console.error("Failed to fetch providers:", error)
    return []
  }
}

export function formatPrice(price: number): string {
  if (price === 0) return "Free"
  if (price < 0.001) return `$${(price * 1000000).toFixed(2)}/1M`
  if (price < 1) return `$${(price * 1000).toFixed(3)}/1K`
  return `$${price.toFixed(2)}/1K`
}

export function calculateCost(
  promptTokens: number,
  completionTokens: number,
  pricingPrompt: number,
  pricingCompletion: number,
): number {
  const promptCost = (promptTokens) * pricingPrompt
  const completionCost = (completionTokens) * pricingCompletion
  return Math.round((promptCost + completionCost) * 10000) / 10000
}
