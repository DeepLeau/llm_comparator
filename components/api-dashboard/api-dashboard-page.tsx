"use client"

import { useState } from "react"
import { APIDashboardHeader } from "./api-dashboard-header"
import { ModelSelectionSection } from "./model-selection-section"
import { APIAnalyticsSection } from "./api-analytics-section"
import { UsageMetricsSection } from "./usage-metrics-section"
import { RecentRequestsSection } from "./recent-requests-section"

export function APIDashboardPage() {
  const [selectedModel, setSelectedModel] = useState(null)
  const [deployedModel, setDeployedModel] = useState(null)

  const handleModelChange = (model: any) => {
    setSelectedModel(model)
  }

  const handleModelDeploy = (model: any, config: any) => {
    setDeployedModel({ ...model, config })
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <APIDashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Usage Metrics */}
          <UsageMetricsSection />

          {/* Model Selection */}
          <ModelSelectionSection
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
            deployedModel={deployedModel}
            onModelDeploy={handleModelDeploy}
          />

          {/* Analytics Charts */}
          <APIAnalyticsSection />

          {/* Recent Requests */}
          <RecentRequestsSection />
        </div>
      </div>
    </div>
  )
}
