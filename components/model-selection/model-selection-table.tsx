"use client"

import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, Shield, ShieldOff, Database, ServerOffIcon as DatabaseOff } from "lucide-react"
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

  const formatPrice = (price: number) => {
    if (price === 0) return "Free"
    if (price < 0.001) return `$${(price * 1000000).toFixed(2)}/1M`
    if (price < 1) return `$${(price * 1000).toFixed(3)}/1K`
    return `$${price.toFixed(4)}/1K`
  }

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
              <SortButton column="is_open_source">License</SortButton>
            </TableHead>
            <TableHead>
              <SortButton column="stores_data">Data Privacy</SortButton>
            </TableHead>
            <TableHead>
              <SortButton column="pricing_prompt">Input Price</SortButton>
            </TableHead>
            <TableHead>
              <SortButton column="pricing_completion">Output Price</SortButton>
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
                </div>
              </TableCell>
              <TableCell className="text-gray-300">{model.provider}</TableCell>
              <TableCell>
                <Badge
                  variant={model.is_open_source ? "default" : "secondary"}
                  className={
                    model.is_open_source
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  }
                >
                  {model.is_open_source ? (
                    <>
                      <Shield className="w-3 h-3 mr-1" />
                      Open Source
                    </>
                  ) : (
                    <>
                      <ShieldOff className="w-3 h-3 mr-1" />
                      Proprietary
                    </>
                  )}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={model.stores_data ? "destructive" : "default"}
                  className={
                    model.stores_data
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-green-500/20 text-green-400 border-green-500/30"
                  }
                >
                  {model.stores_data ? (
                    <>
                      <Database className="w-3 h-3 mr-1" />
                      Stores Data
                    </>
                  ) : (
                    <>
                      <DatabaseOff className="w-3 h-3 mr-1" />
                      Private
                    </>
                  )}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-300 font-mono text-sm">{formatPrice(model.pricing_prompt)}</TableCell>
              <TableCell className="text-gray-300 font-mono text-sm">{formatPrice(model.pricing_completion)}</TableCell>
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
