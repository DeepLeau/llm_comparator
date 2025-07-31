"use client"

import { useState } from "react"
import { APIAnalyticsSection } from "@/components/api-dashboard/api-analytics-section"
import { ModelSelectionSection } from "@/components/api-dashboard/model-selection-section"
import { RecentRequestsSection } from "@/components/api-dashboard/recent-requests-section"
import { UsageMetricsSection } from "@/components/api-dashboard/usage-metrics-section"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, FileText } from "lucide-react"
import Link from "next/link"

export default function APIDashboard() {
  const [selectedModel, setSelectedModel] = useState(null)
  const [deployedModel, setDeployedModel] = useState(null)

  const handleModelChange = (model: any) => {
    setSelectedModel(model)
  }

  const handleModelDeploy = (model: any, config: any) => {
    setDeployedModel({ ...model, config })
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-950">
        {/* Header */}
        <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl font-semibold text-white">API Dashboard</h1>
                  <p className="text-sm text-gray-400">Manage your AI models and monitor API usage</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  New Endpoint
                </Button>
              </div>
            </div>
          </div>
        </div>

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

            {/* Analytics */}
            <APIAnalyticsSection />

            {/* Recent Requests */}
            <RecentRequestsSection />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
