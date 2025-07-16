"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Search, Filter, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { getUniqueProviders } from "@/lib/models"

interface ModelFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  licenseFilter: string
  onLicenseChange: (license: string) => void
  providerFilter: string
  onProviderChange: (provider: string) => void
  storesDataFilter: string
  onStoresDataChange: (storesData: string) => void
  maxInputPriceFilter: number
  onMaxInputPriceChange: (price: number) => void
  maxOutputPriceFilter: number
  onMaxOutputPriceChange: (price: number) => void
  resultCount: number
  totalCount: number
}

const LICENSE_OPTIONS = [
  { value: "all", label: "All Licenses" },
  { value: "open_source", label: "Open Source" },
  { value: "proprietary", label: "Proprietary" },
]

const STORES_DATA_OPTIONS = [
  { value: "all", label: "All Models" },
  { value: "no", label: "Private (No Data Storage)" },
  { value: "yes", label: "Stores Data" },
]

export function ModelFilters({
  searchQuery,
  onSearchChange,
  licenseFilter,
  onLicenseChange,
  providerFilter,
  onProviderChange,
  storesDataFilter,
  onStoresDataChange,
  maxInputPriceFilter,
  onMaxInputPriceChange,
  maxOutputPriceFilter,
  onMaxOutputPriceChange,
  resultCount = 0,
  totalCount = 0,
}: ModelFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [providers, setProviders] = useState<string[]>([])

  // Charger les providers depuis Supabase
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const uniqueProviders = await getUniqueProviders()
        setProviders(uniqueProviders)
      } catch (error) {
        console.error("Failed to load providers:", error)
      }
    }
    loadProviders()
  }, [])

  const activeFiltersCount = [
    licenseFilter !== "all",
    providerFilter !== "all",
    storesDataFilter !== "all",
    maxInputPriceFilter < 1,
    maxOutputPriceFilter < 1,
  ].filter(Boolean).length

  const clearAllFilters = () => {
    onLicenseChange("all")
    onProviderChange("all")
    onStoresDataChange("all")
    onMaxInputPriceChange(1)
    onMaxOutputPriceChange(1)
    onSearchChange("")
  }

  const hasActiveFilters = searchQuery || activeFiltersCount > 0

  const formatPriceLabel = (value: number) => {
    if (value >= 1) return `$${value.toFixed(3)}`
    if (value >= 0.001) return `$${(value).toFixed(2)}/1K`
    return `$${(value * 1000000).toFixed(1)}/1M`
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search models or providers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 bg-blue-600 text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-400">
          Showing {resultCount.toLocaleString()} of {totalCount.toLocaleString()} models
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-gray-400 hover:text-white">
            <X className="w-3 h-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isFiltersOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-800/30 rounded-lg border border-gray-700">
          {/* License Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-300">License Type</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700"
                >
                  {LICENSE_OPTIONS.find((opt) => opt.value === licenseFilter)?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full bg-gray-800 border-gray-700">
                {LICENSE_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onLicenseChange(option.value)}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Provider Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-300">Provider</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700"
                >
                  {providerFilter === "all" ? "All Providers" : providerFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full bg-gray-800 border-gray-700 max-h-60 overflow-y-auto">
                <DropdownMenuLabel className="text-gray-400">Select Provider</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem
                  onClick={() => onProviderChange("all")}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  All Providers
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                {providers.map((provider) => (
                  <DropdownMenuItem
                    key={provider}
                    onClick={() => onProviderChange(provider)}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    {provider}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Data Privacy Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-300">Data Privacy</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700"
                >
                  {STORES_DATA_OPTIONS.find((opt) => opt.value === storesDataFilter)?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full bg-gray-800 border-gray-700">
                {STORES_DATA_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onStoresDataChange(option.value)}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Input Price Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-300">
              Max Input Price: {formatPriceLabel(maxInputPriceFilter)}
            </Label>
            <Slider
              value={[maxInputPriceFilter]}
              onValueChange={(value) => onMaxInputPriceChange(value[0])}
              max={5}
              min={0}
              step={0.000001}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$0</span>
              <span>$5</span>
            </div>
          </div>

          {/* Output Price Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-300">
              Max Output Price: {formatPriceLabel(maxOutputPriceFilter)}
            </Label>
            <Slider
              value={[maxOutputPriceFilter]}
              onValueChange={(value) => onMaxOutputPriceChange(value[0])}
              max={5}
              min={0}
              step={0.000001}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$0</span>
              <span>$5</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
