"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Search, DollarSign, Zap, Check, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Model {
  id: string
  name: string
  provider: string
  pricing_prompt: number
  pricing_completion: number
}

interface ModelSelectionSectionProps {
  selectedModel?: Model | null
  onModelChange?: (model: Model) => void
  deployedModel?: Model | null
  onModelDeploy?: (model: Model, config: any) => void
}

export function ModelSelectionSection({
  selectedModel,
  onModelChange,
  deployedModel,
  onModelDeploy,
}: ModelSelectionSectionProps) {
  const [models, setModels] = useState<Model[]>([])
  const [filteredModels, setFilteredModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProvider, setSelectedProvider] = useState("all")
  const [config, setConfig] = useState({
    temperature: [0.7],
    maxTokens: [1000],
    topP: [1.0],
    streaming: false,
  })
  const [deploying, setDeploying] = useState(false)
  const [userDeployedModel, setUserDeployedModel] = useState<Model | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const modelsPerPage = 10

  useEffect(() => {
    fetchModels()
    fetchUserDeployedModel()
  }, [])

  useEffect(() => {
    filterModels()
    setCurrentPage(1) // Reset to first page when filters change
  }, [models, searchTerm, selectedProvider])

  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from("models")
        .select("id, name, provider, pricing_prompt, pricing_completion")
        .order("name")

      if (error) throw error
      setModels(data || [])
    } catch (error) {
      console.error("Error fetching models:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDeployedModel = async () => {
    try {
      // Get the current authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        return
      }

      // Get user's selected model and configuration
      const { data: userData, error: userDataError } = await supabase
        .from("users")
        .select("model_selected, temperature, top_p, max_tokens, streaming")
        .eq("id", user.id)
        .single()

      if (userDataError || !userData?.model_selected) {
        return
      }

      // Get the model details
      const { data: modelData, error: modelError } = await supabase
        .from("models")
        .select("id, name, provider, pricing_prompt, pricing_completion")
        .eq("id", userData.model_selected)
        .single()

      if (modelError || !modelData) {
        return
      }

      setUserDeployedModel(modelData)

      // Load user's saved configuration
      setConfig({
        temperature: [userData.temperature || 0.7],
        maxTokens: [userData.max_tokens || 1000],
        topP: [userData.top_p || 1.0],
        streaming: userData.streaming || false,
      })

      // Set as both deployed and selected model if no model is currently selected
      if (onModelDeploy && !deployedModel) {
        onModelDeploy(modelData, {
          temperature: userData.temperature || 0.7,
          maxTokens: userData.max_tokens || 1000,
          topP: userData.top_p || 1.0,
          streaming: userData.streaming || false,
        })
      }
      if (onModelChange && !selectedModel) {
        onModelChange(modelData)
      }
    } catch (error) {
      console.error("Error fetching user deployed model:", error)
    }
  }

  const filterModels = () => {
    let filtered = models

    if (searchTerm) {
      filtered = filtered.filter(
        (model) =>
          model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.provider.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedProvider !== "all") {
      filtered = filtered.filter((model) => model.provider === selectedProvider)
    }

    setFilteredModels(filtered)
  }

  const formatPrice = (price: number) => {
    if (price === 0) return "Free"
    if (price < 0.001) return `$${(price * 1000000).toFixed(2)}/1M`
    if (price < 1) return `$${(price * 1000).toFixed(2)}/1K`
    return `$${price.toFixed(2)}`
  }

  const handleModelClick = (model: Model) => {
    if (onModelChange) {
      onModelChange(model)
    }
  }

  const handleDeploy = async () => {
    if (!selectedModel) return

    setDeploying(true)

    try {
      // Get the current authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error("Error getting user:", userError)
        alert("You must be logged in to deploy a model")
        return
      }

      // Update the user's selected model and configuration in the database
      const { error: updateError } = await supabase
        .from("users")
        .update({
          model_selected: selectedModel.id,
          temperature: config.temperature[0],
          top_p: config.topP[0],
          max_tokens: config.maxTokens[0],
          streaming: config.streaming,
        })
        .eq("id", user.id)

      if (updateError) {
        console.error("Error updating user model and config:", updateError)
        alert("Failed to deploy model. Please try again.")
        return
      }

      // Update local state
      setUserDeployedModel(selectedModel)

      // Call the parent handler to update UI state
      if (onModelDeploy) {
        onModelDeploy(selectedModel, config)
      }

      alert("Model and configuration deployed successfully!")
    } catch (error) {
      console.error("Error deploying model:", error)
      alert("Failed to deploy model. Please try again.")
    } finally {
      setDeploying(false)
    }
  }

  const providers = Array.from(new Set(models.map((model) => model.provider))).sort()

  // Pagination logic
  const totalPages = Math.ceil(filteredModels.length / modelsPerPage)
  const startIndex = (currentPage - 1) * modelsPerPage
  const endIndex = startIndex + modelsPerPage
  const currentModels = filteredModels.slice(startIndex, endIndex)

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  // Determine which model to show in configuration
  const currentModel = selectedModel || userDeployedModel
  const isDeployedModel = deployedModel?.id === currentModel?.id || userDeployedModel?.id === currentModel?.id

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800">
            <CardContent className="p-8">
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Find Your Model Section */}
      <div className="lg:col-span-2">
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-xl">Find Your Model</CardTitle>
            <p className="text-gray-400">Choose from {filteredModels.length}+ available models</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="w-full sm:w-48 bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-white hover:bg-gray-700">
                    All Providers
                  </SelectItem>
                  {providers.map((provider) => (
                    <SelectItem key={provider} value={provider} className="text-white hover:bg-gray-700">
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Models List */}
            <div className="space-y-3" style={{ height: "400px", overflowY: "auto" }}>
              {currentModels.map((model) => (
                <div
                  key={model.id}
                  onClick={() => handleModelClick(model)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
                    selectedModel?.id === model.id
                      ? "border-blue-500 bg-blue-600/10"
                      : (deployedModel?.id === model.id || userDeployedModel?.id === model.id)
                        ? "border-green-500 bg-green-600/10"
                        : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{model.name}</h3>
                      <p className="text-gray-400 text-sm">{model.provider}</p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="flex items-center gap-1 text-green-400">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">{formatPrice(model.pricing_prompt)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm">{formatPrice(model.pricing_completion)}</span>
                      </div>
                      {selectedModel?.id === model.id && (
                        <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30">Selected</Badge>
                      )}
                      {(deployedModel?.id === model.id || userDeployedModel?.id === model.id) && (
                        <Badge className="bg-green-600/20 text-green-300 border-green-600/30">
                          <Check className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredModels.length)} of {filteredModels.length}{" "}
                    models
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((page, index) => (
                        <Button
                          key={index}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => typeof page === "number" && setCurrentPage(page)}
                          disabled={page === "..."}
                          className={
                            page === currentPage
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : page === "..."
                                ? "border-none text-gray-400 cursor-default"
                                : "border-gray-700 text-gray-300 hover:bg-gray-800"
                          }
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Configuration Section */}
      <div className="lg:col-span-1">
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentModel ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-600/10 border border-blue-600/30">
                  <h3 className="text-white font-medium">{currentModel.name}</h3>
                  <p className="text-gray-400 text-sm">{currentModel.provider}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-green-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">{formatPrice(currentModel.pricing_prompt)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm">{formatPrice(currentModel.pricing_completion)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Temperature: {config.temperature[0]}
                    </label>
                    <Slider
                      value={config.temperature}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, temperature: value }))}
                      max={2}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">Controls randomness in responses</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Max Tokens: {config.maxTokens[0]}
                    </label>
                    <Slider
                      value={config.maxTokens}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, maxTokens: value }))}
                      max={4000}
                      min={100}
                      step={100}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum length of the response</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Top P: {config.topP[0]}</label>
                    <Slider
                      value={config.topP}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, topP: value }))}
                      max={1}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">Controls diversity via nucleus sampling</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="streaming" className="text-sm font-medium text-gray-300">
                        Enable Streaming
                      </Label>
                      <p className="text-xs text-gray-500">Stream responses in real-time</p>
                    </div>
                    <Switch
                      id="streaming"
                      checked={config.streaming}
                      onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, streaming: checked }))}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleDeploy}
                  disabled={deploying}
                  className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                >
                  {deploying ? "Deploying..." : "Deploy Configuration"}
                </Button>

                {isDeployedModel && (
                  <div className="p-3 rounded-lg bg-green-600/10 border border-green-600/30">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm font-medium">Currently Active</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Select a model to configure deployment settings</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
