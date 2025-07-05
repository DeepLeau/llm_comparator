"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface DashboardFiltersProps {
  onFilterChange: (useCaseFilter: string, dateRange: { from: Date | null; to: Date | null }) => void
}

export function DashboardFilters({ onFilterChange }: DashboardFiltersProps) {
  const [useCaseFilter, setUseCaseFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  })

  const updateFilter = (key: "useCase" | "dateRange", value: any) => {
    if (key === "useCase") {
      setUseCaseFilter(value)
      onFilterChange(value, dateRange)
    } else if (key === "dateRange") {
      setDateRange(value)
      onFilterChange(useCaseFilter, value)
    }
  }

  const resetFilters = () => {
    setUseCaseFilter("all")
    setDateRange({ from: null, to: null })
    onFilterChange("all", { from: null, to: null })
  }

  const hasActiveFilters = useCaseFilter !== "all" || dateRange.from || dateRange.to

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Filters</h3>
            {hasActiveFilters && (
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/30">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Use Case Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Use Case</Label>
            <Select value={useCaseFilter} onValueChange={(value) => updateFilter("useCase", value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="All use cases" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-700">
                  All Use Cases
                </SelectItem>
                <SelectItem value="Content Generation" className="text-white hover:bg-gray-700">
                  Content Generation
                </SelectItem>
                <SelectItem value="Code Assistance" className="text-white hover:bg-gray-700">
                  Code Assistance
                </SelectItem>
                <SelectItem value="Customer Support" className="text-white hover:bg-gray-700">
                  Customer Support
                </SelectItem>
                <SelectItem value="Data Analysis" className="text-white hover:bg-gray-700">
                  Data Analysis
                </SelectItem>
                <SelectItem value="Translation" className="text-white hover:bg-gray-700">
                  Translation
                </SelectItem>
                <SelectItem value="Research and Summarization" className="text-white hover:bg-gray-700">
                  Research and Summarization
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.from || undefined}
                  onSelect={(date) => updateFilter("dateRange", { ...dateRange, from: date || null })}
                  initialFocus
                  className="bg-gray-800 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">To Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.to || undefined}
                  onSelect={(date) => updateFilter("dateRange", { ...dateRange, to: date || null })}
                  initialFocus
                  className="bg-gray-800 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex flex-wrap gap-2">
              {useCaseFilter !== "all" && (
                <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-600/30">
                  {useCaseFilter}
                </Badge>
              )}
              {dateRange.from && (
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/30">
                  From: {format(dateRange.from, "MMM dd")}
                </Badge>
              )}
              {dateRange.to && (
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                  To: {format(dateRange.to, "MMM dd")}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}