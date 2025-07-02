"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface DashboardFiltersProps {
  onFilterChange: (modelFilter: string, dateRange: { from: Date | null; to: Date | null }) => void
}

export function DashboardFilters({ onFilterChange }: DashboardFiltersProps) {
  const [modelFilter, setModelFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  })

  const handleModelChange = (value: string) => {
    setModelFilter(value)
    onFilterChange(value, dateRange)
  }

  const handleDateRangeChange = (newRange: { from: Date | null; to: Date | null }) => {
    setDateRange(newRange)
    onFilterChange(modelFilter, newRange)
  }

  const clearFilters = () => {
    setModelFilter("all")
    setDateRange({ from: null, to: null })
    onFilterChange("all", { from: null, to: null })
  }

  return (
    <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400 font-medium">Filtres :</span>
          </div>

          {/* Model Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Modèle :</span>
            <Select value={modelFilter} onValueChange={handleModelChange}>
              <SelectTrigger className="w-40 bg-white/5 border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les modèles</SelectItem>
                <SelectItem value="GPT-4">GPT-4</SelectItem>
                <SelectItem value="Claude 3">Claude 3</SelectItem>
                <SelectItem value="Mistral Large">Mistral Large</SelectItem>
                <SelectItem value="LLaMA 2">LLaMA 2</SelectItem>
                <SelectItem value="Gemini Pro">Gemini Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Période :</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-60 justify-start text-left font-normal bg-white/5 border-white/20 hover:bg-white/10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd MMM yyyy", { locale: fr })} -{" "}
                        {format(dateRange.to, "dd MMM yyyy", { locale: fr })}
                      </>
                    ) : (
                      format(dateRange.from, "dd MMM yyyy", { locale: fr })
                    )
                  ) : (
                    <span className="text-gray-400">Sélectionner une période</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-900 border-white/20" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from || undefined}
                  selected={{ from: dateRange.from || undefined, to: dateRange.to || undefined }}
                  onSelect={(range) => {
                    handleDateRangeChange({
                      from: range?.from || null,
                      to: range?.to || null,
                    })
                  }}
                  numberOfMonths={2}
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Clear Filters */}
        {(modelFilter !== "all" || dateRange.from || dateRange.to) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            Effacer les filtres
          </Button>
        )}
      </div>
    </Card>
  )
}