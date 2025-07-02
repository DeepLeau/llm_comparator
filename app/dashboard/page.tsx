"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { TestHistoryTable } from "@/components/dashboard/test-history-table"
import { BatchTestingCTA } from "@/components/dashboard/batch-testing-cta"

export interface TestRun {
  id: string
  date: string
  prompt: string
  bestModel: {
    name: string
    score: number
    icon: string
    color: string
  }
  averageScore: number
  averageTime: number
  totalCost: number
}

// Mock data for demonstration
const mockTestRuns: TestRun[] = [
  {
    id: "1",
    date: "2024-01-15",
    prompt:
      "Rédigez un email professionnel pour informer les employés d'une nouvelle politique de télétravail hybride, en expliquant les avantages et les modalités pratiques pour l'équipe.",
    bestModel: {
      name: "GPT-4",
      score: 9.2,
      icon: "🧠",
      color: "from-green-500 to-emerald-600",
    },
    averageScore: 8.1,
    averageTime: 1450,
    totalCost: 0.24,
  },
  {
    id: "2",
    date: "2024-01-14",
    prompt:
      "Créez un pitch de vente convaincant pour une solution SaaS de gestion de projet destinée aux équipes de développement de 10-50 personnes.",
    bestModel: {
      name: "Claude 3",
      score: 8.9,
      icon: "💬",
      color: "from-orange-500 to-red-600",
    },
    averageScore: 7.8,
    averageTime: 1200,
    totalCost: 0.18,
  },
  {
    id: "3",
    date: "2024-01-13",
    prompt:
      "Résumez cette conversation client : Le client se plaint que son produit ne fonctionne plus après 6 mois d'utilisation.",
    bestModel: {
      name: "Mistral Large",
      score: 8.7,
      icon: "⚡",
      color: "from-blue-500 to-indigo-600",
    },
    averageScore: 7.9,
    averageTime: 980,
    totalCost: 0.15,
  },
  {
    id: "4",
    date: "2024-01-12",
    prompt:
      "Extrayez les informations clés de ce texte : 'La réunion du 15 mars à 14h30 en salle de conférence A portera sur le budget Q2 2024. Participants : Marie Dupont (CFO), Jean Martin (CEO), Sophie Bernard (CMO).'",
    bestModel: {
      name: "GPT-4",
      score: 9.1,
      icon: "🧠",
      color: "from-green-500 to-emerald-600",
    },
    averageScore: 8.3,
    averageTime: 1100,
    totalCost: 0.21,
  },
  {
    id: "5",
    date: "2024-01-11",
    prompt:
      "Générez une description produit attractive pour un casque audio sans fil haut de gamme avec réduction de bruit active.",
    bestModel: {
      name: "Claude 3",
      score: 8.8,
      icon: "💬",
      color: "from-orange-500 to-red-600",
    },
    averageScore: 7.6,
    averageTime: 1350,
    totalCost: 0.19,
  },
  {
    id: "6",
    date: "2024-01-10",
    prompt:
      "Rédigez une réponse empathique à un client mécontent qui demande un remboursement pour un service défaillant.",
    bestModel: {
      name: "GPT-4",
      score: 9.0,
      icon: "🧠",
      color: "from-green-500 to-emerald-600",
    },
    averageScore: 8.0,
    averageTime: 1250,
    totalCost: 0.22,
  },
]

export default function DashboardPage() {
  const [testRuns, setTestRuns] = useState<TestRun[]>(mockTestRuns)
  const [filteredRuns, setFilteredRuns] = useState<TestRun[]>(mockTestRuns)

  const handleFilterChange = (modelFilter: string, dateRange: { from: Date | null; to: Date | null }) => {
    let filtered = testRuns

    // Filter by model
    if (modelFilter && modelFilter !== "all") {
      filtered = filtered.filter((run) => run.bestModel.name === modelFilter)
    }

    // Filter by date range
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((run) => {
        const runDate = new Date(run.date)
        if (dateRange.from && runDate < dateRange.from) return false
        if (dateRange.to && runDate > dateRange.to) return false
        return true
      })
    }

    setFilteredRuns(filtered)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <DashboardHeader />

        <div className="space-y-8">
          <DashboardFilters onFilterChange={handleFilterChange} />
          <TestHistoryTable testRuns={filteredRuns} />
          <BatchTestingCTA />
        </div>
      </div>
    </div>
  )
}