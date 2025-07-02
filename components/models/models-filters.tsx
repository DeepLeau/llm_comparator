"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Search, Filter } from "lucide-react"

interface ModelsFiltersProps {
  onFilterChange: (
    searchTerm: string,
    providerFilter: string,
    showNewOnly: boolean,
    showTopQualityOnly: boolean,
  ) => void
}

export function ModelsFilters({ onFilterChange }: ModelsFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [providerFilter, setProviderFilter] = useState("all")
  const [showNewOnly, setShowNewOnly] = useState(false)
  const [showTopQualityOnly, setShowTopQualityOnly] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onFilterChange(value, providerFilter, showNewOnly, showTopQualityOnly)
  }

  const handleProviderChange = (value: string) => {
    setProviderFilter(value)
    onFilterChange(searchTerm, value, showNewOnly, showTopQualityOnly)
  }

  const handleNewOnlyChange = (checked: boolean) => {
    setShowNewOnly(checked)
    onFilterChange(searchTerm, providerFilter, checked, showTopQualityOnly)
  }

  const handleTopQualityChange = (checked: boolean) => {
    setShowTopQualityOnly(checked)
    onFilterChange(searchTerm, providerFilter, showNewOnly, checked)
  }

  return (
    <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 font-medium">Filtres :</span>
        </div>

        <div className="flex flex-col md:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher un modèle..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Provider Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300 whitespace-nowrap">Fournisseur :</span>
            <Select value={providerFilter} onValueChange={handleProviderChange}>
              <SelectTrigger className="w-40 bg-white/5 border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="OpenAI">OpenAI</SelectItem>
                <SelectItem value="Anthropic">Anthropic</SelectItem>
                <SelectItem value="Mistral AI">Mistral AI</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="Meta">Meta</SelectItem>
                <SelectItem value="Cohere">Cohere</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="new-only" checked={showNewOnly} onCheckedChange={handleNewOnlyChange} />
            <Label htmlFor="new-only" className="text-sm text-gray-300 whitespace-nowrap">
              Nouveaux uniquement
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="top-quality" checked={showTopQualityOnly} onCheckedChange={handleTopQualityChange} />
            <Label htmlFor="top-quality" className="text-sm text-gray-300 whitespace-nowrap">
              Top qualité
            </Label>
          </div>
        </div>
      </div>
    </Card>
  )
}