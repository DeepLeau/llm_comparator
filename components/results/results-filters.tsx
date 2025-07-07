"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, SlidersHorizontal, X } from "lucide-react"

export interface FilterState {
  license: "all" | "open-source" | "commercial"
  minQuality: number
  maxCost: number
  sortBy: "quality" | "cost" | "responseTime" | "model" | "license"
  sortOrder: "asc" | "desc"
}

interface ResultsFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function ResultsFilters({ filters, onFiltersChange }: ResultsFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const resetFilters = () => {
    onFiltersChange({
      license: "all",
      minQuality: 1,
      maxCost: 0.1,
      sortBy: "quality",
      sortOrder: "desc",
    })
  }

  const hasActiveFilters = filters.license !== "all" || filters.minQuality !== 1 || filters.maxCost !== 0.1

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Filters & Sorting</h3>
            {hasActiveFilters && (
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/30">
                <Filter className="w-3 h-3 mr-1" />
                Active
              </Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
            >
              <X className="w-4 h-4 mr-1" />
              Reset
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* License Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">License Type</Label>
            <Select
              value={filters.license}
              onValueChange={(value: "all" | "open-source" | "commercial") => updateFilter("license", value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select license" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-700">
                  All Licenses
                </SelectItem>
                <SelectItem value="open-source" className="text-white hover:bg-gray-700">
                  Open Source
                </SelectItem>
                <SelectItem value="commercial" className="text-white hover:bg-gray-700">
                  Propriétaire
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Min Quality Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-300">
              Min Quality Score: {filters.minQuality.toFixed(1)}
            </Label>
            <Slider
              value={[filters.minQuality]}
              onValueChange={(value) => updateFilter("minQuality", value[0])}
              min={1}
              max={5}
              step={0.1}
              className="w-full"
            />
            <div className="text-xs text-gray-500">Show models with quality {filters.minQuality.toFixed(1)}+ stars</div>
          </div>

          {/* Max Cost Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-300">Max Cost: ${filters.maxCost.toFixed(3)}</Label>
            <Slider
              value={[filters.maxCost]}
              onValueChange={(value) => updateFilter("maxCost", value[0])}
              min={0.001}
              max={0.1}
              step={0.001}
              className="w-full"
            />
            <div className="text-xs text-gray-500">Show models costing up to ${filters.maxCost.toFixed(3)}</div>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value: "quality" | "cost" | "responseTime" | "model" | "license") =>
                updateFilter("sortBy", value)
              }
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="quality" className="text-white hover:bg-gray-700">
                  Quality Score
                </SelectItem>
                <SelectItem value="cost" className="text-white hover:bg-gray-700">
                  Cost
                </SelectItem>
                <SelectItem value="responseTime" className="text-white hover:bg-gray-700">
                  Response Time
                </SelectItem>
                <SelectItem value="model" className="text-white hover:bg-gray-700">
                  Model Name
                </SelectItem>
                <SelectItem value="license" className="text-white hover:bg-gray-700">
                  License
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Order</Label>
            <Select
              value={filters.sortOrder}
              onValueChange={(value: "asc" | "desc") => updateFilter("sortOrder", value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="desc" className="text-white hover:bg-gray-700">
                  High to Low
                </SelectItem>
                <SelectItem value="asc" className="text-white hover:bg-gray-700">
                  Low to High
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex flex-wrap gap-2">
              {filters.license !== "all" && (
                <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-600/30">
                  {filters.license === "open-source" ? "Open Source" : "Propriétaire"}
                </Badge>
              )}
              {filters.minQuality !== 1 && (
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/30">
                  Min Quality: {filters.minQuality.toFixed(1)}+
                </Badge>
              )}
              {filters.maxCost !== 0.1 && (
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                  Max Cost: ${filters.maxCost.toFixed(3)}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
