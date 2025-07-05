"use client"

import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, Star } from "lucide-react"
import type { LLMModel } from "./model-data"

interface ModelSelectionTableProps {
  models: LLMModel[]
  selectedModels: string[]
  onModelToggle: (modelId: string) => void
  onSelectAll: () => void
  sortBy: string
  sortOrder: "asc" | "desc"
  onSort: (column: string) => void
  isAllSelected: boolean
  isIndeterminate: boolean
}

export function ModelSelectionTable({
  models,
  selectedModels,
  onModelToggle,
  onSelectAll,
  sortBy,
  sortOrder,
  onSort,
  isAllSelected,
  isIndeterminate,
}: ModelSelectionTableProps) {
  const SortButton = ({ column, children }: { column: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      className="h-auto p-0 font-semibold text-gray-300 hover:text-white"
      onClick={() => onSort(column)}
    >
      <span className="flex items-center gap-1">
        {children}
        {sortBy === column && (
          <span className="ml-1">
            {sortOrder === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </span>
        )}
      </span>
    </Button>
  )

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800 hover:bg-gray-800/50">
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onSelectAll}
                aria-label="Select all models on this page"
                className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                ref={(el) => {
                  if (el) {
                    el.indeterminate = isIndeterminate
                  }
                }}
              />
            </TableHead>
            <TableHead>
              <SortButton column="name">Model Name</SortButton>
            </TableHead>
            <TableHead>
              <SortButton column="provider">Provider</SortButton>
            </TableHead>
            <TableHead>
              <SortButton column="license">License</SortButton>
            </TableHead>
            <TableHead>
              <SortButton column="speedScore">Speed</SortButton>
            </TableHead>
            <TableHead>
              <SortButton column="costPer1kTokens">Cost</SortButton>
            </TableHead>
            <TableHead>
              <SortButton column="qualityScore">Quality</SortButton>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.id} className="border-gray-800 hover:bg-gray-800/30 transition-colors">
              <TableCell>
                <Checkbox
                  checked={selectedModels.includes(model.id)}
                  onCheckedChange={() => onModelToggle(model.id)}
                  aria-label={`Select ${model.name}`}
                  className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{model.name}</span>
                  {model.recommended && (
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      <Star className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-gray-300">{model.provider}</TableCell>
              <TableCell>
                <Badge
                  variant={model.license === "Open Source" ? "default" : "secondary"}
                  className={
                    model.license === "Open Source"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  }
                >
                  {model.license}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i < model.speedScore ? "bg-blue-500" : "bg-gray-700"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-400">{model.speedScore}/5</span>
                </div>
              </TableCell>
              <TableCell className="text-gray-300">${model.costPer1kTokens.toFixed(4)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i < model.qualityScore ? "bg-green-500" : "bg-gray-700"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-400">{model.qualityScore}/5</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {models.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No models found matching your criteria.</p>
          <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  )
}
