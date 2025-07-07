import { supabase } from "./supabase"
import type { LLMModel } from "@/components/model-selection/model-data"

export async function fetchModels(): Promise<LLMModel[]> {
  try {
    const { data, error } = await supabase.from("models").select("*").order("name")

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
}): Promise<LLMModel[]> {
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
