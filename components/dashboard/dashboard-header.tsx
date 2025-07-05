"use client"

import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Test History</h1>
        <p className="text-gray-400">View and manage your previous LLM comparison tests</p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>

        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => (window.location.href = "/compare")}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Test
        </Button>
      </div>
    </div>
  )
}
