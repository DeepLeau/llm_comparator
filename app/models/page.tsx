"use client"

import { useState } from "react"
import { ModelsHeader } from "@/components/models/models-header"
import { ModelsFilters } from "@/components/models/models-filters"
import { ModelsGrid } from "@/components/models/models-grid"
import { SuggestModelCTA } from "@/components/models/suggest-model-cta"

export interface LLMModel {
  id: string
  name: string
  provider: string
  icon: string
  color: string
  dateAdded: string
  avgResponseTime: number
  qualityScore: number
  costPer1kTokens: number
  badges: Array<"new" | "top-quality" | "ultra-fast">
  description: string
}

// Mock data for LLM models
const mockModels: LLMModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    icon: "🧠",
    color: "from-green-500 to-emerald-600",
    dateAdded: "2024-01-10",
    avgResponseTime: 1.2,
    qualityScore: 9.2,
    costPer1kTokens: 0.03,
    badges: ["top-quality"],
    description: "Le modèle le plus avancé d'OpenAI avec des capacités multimodales exceptionnelles",
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    icon: "💬",
    color: "from-orange-500 to-red-600",
    dateAdded: "2024-01-08",
    avgResponseTime: 1.8,
    qualityScore: 9.1,
    costPer1kTokens: 0.015,
    badges: ["top-quality"],
    description: "Le modèle le plus puissant d'Anthropic, excellent pour les tâches complexes",
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    icon: "💬",
    color: "from-orange-500 to-red-600",
    dateAdded: "2024-01-08",
    avgResponseTime: 1.1,
    qualityScore: 8.7,
    costPer1kTokens: 0.003,
    badges: ["ultra-fast"],
    description: "Équilibre parfait entre performance et rapidité pour un usage quotidien",
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral AI",
    icon: "⚡",
    color: "from-blue-500 to-indigo-600",
    dateAdded: "2024-01-12",
    avgResponseTime: 0.9,
    qualityScore: 8.8,
    costPer1kTokens: 0.008,
    badges: ["new", "ultra-fast"],
    description: "Le modèle français de référence, optimisé pour les langues européennes",
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    icon: "🌟",
    color: "from-yellow-500 to-orange-600",
    dateAdded: "2024-01-05",
    avgResponseTime: 1.4,
    qualityScore: 8.5,
    costPer1kTokens: 0.0005,
    badges: [],
    description: "Modèle multimodal de Google avec d'excellentes capacités de raisonnement",
  },
  {
    id: "llama-2-70b",
    name: "LLaMA 2 70B",
    provider: "Meta",
    icon: "🦙",
    color: "from-purple-500 to-pink-600",
    dateAdded: "2023-12-20",
    avgResponseTime: 2.1,
    qualityScore: 8.3,
    costPer1kTokens: 0.0008,
    badges: [],
    description: "Modèle open-source performant de Meta, idéal pour l'auto-hébergement",
  },
  {
    id: "cohere-command-r",
    name: "Command R+",
    provider: "Cohere",
    icon: "🔮",
    color: "from-pink-500 to-rose-600",
    dateAdded: "2024-01-15",
    avgResponseTime: 1.3,
    qualityScore: 8.4,
    costPer1kTokens: 0.003,
    badges: ["new"],
    description: "Modèle spécialisé dans la génération de contenu et l'analyse de données",
  },
  {
    id: "palm-2",
    name: "PaLM 2",
    provider: "Google",
    icon: "🌴",
    color: "from-indigo-500 to-purple-600",
    dateAdded: "2023-12-15",
    avgResponseTime: 1.6,
    qualityScore: 8.1,
    costPer1kTokens: 0.001,
    badges: [],
    description: "Modèle de Google optimisé pour le raisonnement et la logique",
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    icon: "💬",
    color: "from-orange-500 to-red-600",
    dateAdded: "2024-01-08",
    avgResponseTime: 0.7,
    qualityScore: 8.2,
    costPer1kTokens: 0.00025,
    badges: ["ultra-fast"],
    description: "Version ultra-rapide de Claude 3, parfaite pour les applications temps réel",
  },
]

export default function ModelsPage() {
  const [models, setModels] = useState<LLMModel[]>(mockModels)
  const [filteredModels, setFilteredModels] = useState<LLMModel[]>(mockModels)

  const handleFilterChange = (
    searchTerm: string,
    providerFilter: string,
    showNewOnly: boolean,
    showTopQualityOnly: boolean,
  ) => {
    let filtered = models

    // Search by name
    if (searchTerm) {
      filtered = filtered.filter((model) => model.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by provider
    if (providerFilter && providerFilter !== "all") {
      filtered = filtered.filter((model) => model.provider === providerFilter)
    }

    // Show new models only
    if (showNewOnly) {
      filtered = filtered.filter((model) => model.badges.includes("new"))
    }

    // Show top quality only
    if (showTopQualityOnly) {
      filtered = filtered.filter((model) => model.badges.includes("top-quality"))
    }

    setFilteredModels(filtered)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ModelsHeader />

        <div className="space-y-8">
          <ModelsFilters onFilterChange={handleFilterChange} />
          <ModelsGrid models={filteredModels} />
          <SuggestModelCTA />
        </div>
      </div>
    </div>
  )
}