"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus,
  Search,
  Server,
  Key,
  Globe,
  Shield,
  Trash2,
  Edit,
  TestTube,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface CustomModel {
  id: string
  name: string
  provider: string
  api_endpoint: string
  model_format: string
  auth_type: string
  custom_header_key: string
  created_at: string
  updated_at: string
}

export default function ModelsPage() {
  const router = useRouter()
  const [models, setModels] = useState<CustomModel[]>([])
  const [filteredModels, setFilteredModels] = useState<CustomModel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; model: CustomModel | null }>({
    open: false,
    model: null,
  })
  const [testResults, setTestResults] = useState<{
    [key: string]: { status: "testing" | "success" | "error"; message?: string }
  }>({})

  useEffect(() => {
    fetchModels()
  }, [])

  useEffect(() => {
    // Filter models based on search query
    const filtered = models.filter(
      (model) =>
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.model_format.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredModels(filtered)
  }, [models, searchQuery])

  const fetchModels = async () => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.access_token) {
        router.push("/login")
        return
      }

      const response = await fetch("/api/models/user", {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      })
      const data = await response.json()

      if (response.ok) {
        setModels(data.models)
      } else {
        console.error("Failed to fetch models:", data.error)
      }
    } catch (error) {
      console.error("Error fetching models:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteModel = async () => {
    if (!deleteDialog.model) return

    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.access_token) {
        return
      }

      const response = await fetch("/api/models/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify({ modelId: deleteDialog.model.id }),
      })

      if (response.ok) {
        setModels(models.filter((m) => m.id !== deleteDialog.model!.id))
        setDeleteDialog({ open: false, model: null })
      } else {
        console.error("Failed to delete model")
      }
    } catch (error) {
      console.error("Error deleting model:", error)
    }
  }

  const handleTestModel = async (model: CustomModel) => {
    setTestResults((prev) => ({ ...prev, [model.id]: { status: "testing" } }))

    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.access_token) {
        return
      }

      const response = await fetch("/api/models/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify({ modelId: model.id }),
      })

      const data = await response.json()

      if (response.ok) {
        setTestResults((prev) => ({
          ...prev,
          [model.id]: {
            status: "success",
            message: `Response time: ${data.responseTime}ms`,
          },
        }))
      } else {
        setTestResults((prev) => ({
          ...prev,
          [model.id]: {
            status: "error",
            message: data.error || "Test failed",
          },
        }))
      }
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [model.id]: {
          status: "error",
          message: "Network error",
        },
      }))
    }
  }

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "openai":
        return "🤖"
      case "huggingface":
        return "🤗"
      case "anthropic":
        return "🧠"
      case "custom":
        return "⚙️"
      default:
        return "🔧"
    }
  }

  const getAuthIcon = (authType: string) => {
    switch (authType) {
      case "Bearer":
        return <Key className="w-4 h-4" />
      case "Basic":
        return <Shield className="w-4 h-4" />
      case "Custom Header":
        return <Zap className="w-4 h-4" />
      case "None":
        return <Globe className="w-4 h-4" />
      default:
        return <Key className="w-4 h-4" />
    }
  }

  const getTestStatusIcon = (status: "testing" | "success" | "error") => {
    switch (status) {
      case "testing":
        return <Clock className="w-4 h-4 animate-spin" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-400" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-800/50 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800/50 bg-gray-900/30 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800/50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  My Models
                </h1>
                <p className="text-sm text-gray-400">Manage your private and self-hosted LLM models</p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/dashboard/models/add")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Model
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Search and Stats */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Server className="w-4 h-4" />
                {models.length} models
              </span>
            </div>
          </div>

          {/* Models Grid */}
          {filteredModels.length === 0 ? (
            <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="p-4 bg-blue-500/10 rounded-full mb-4">
                  <Server className="w-16 h-16 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {models.length === 0 ? "No models yet" : "No models found"}
                </h3>
                <p className="text-gray-400 text-center mb-6 max-w-md">
                  {models.length === 0
                    ? "Start by adding your first private or self-hosted LLM model to get started with custom AI testing."
                    : "Try adjusting your search query to find the models you're looking for."}
                </p>
                {models.length === 0 && (
                  <Button
                    onClick={() => router.push("/dashboard/models/add")}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Model
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model) => (
                <Card
                  key={model.id}
                  className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] hover:border-blue-500/50"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <span className="text-xl">{getProviderIcon(model.provider)}</span>
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-white">{model.name}</CardTitle>
                          <CardDescription className="text-sm text-gray-400">{model.provider}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs border-gray-600/50 text-gray-300 bg-gray-800/30">
                        {model.model_format}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Model Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="truncate">{model.base_url}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        {getAuthIcon(model.auth_type)}
                        <span className="capitalize">{model.auth_type}</span>
                        {model.auth_type !== "None" && (
                          <span className="text-xs bg-gray-800/50 px-2 py-1 rounded text-gray-300 font-mono">
                            {model.masked_api_key}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        Added {new Date(model.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Test Status */}
                    {testResults[model.id] && (
                      <Alert
                        className={`${
                          testResults[model.id].status === "success"
                            ? "border-green-500/20 bg-green-500/10"
                            : testResults[model.id].status === "error"
                              ? "border-red-500/20 bg-red-500/10"
                              : "border-blue-500/20 bg-blue-500/10"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {getTestStatusIcon(testResults[model.id].status)}
                          <AlertDescription
                            className={`text-sm ${
                              testResults[model.id].status === "success"
                                ? "text-green-400"
                                : testResults[model.id].status === "error"
                                  ? "text-red-400"
                                  : "text-blue-400"
                            }`}
                          >
                            {testResults[model.id].message ||
                              (testResults[model.id].status === "testing" ? "Testing connection..." : "Test completed")}
                          </AlertDescription>
                        </div>
                      </Alert>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestModel(model)}
                        disabled={testResults[model.id]?.status === "testing"}
                        className="flex-1 bg-gray-800/30 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-600/50"
                      >
                        <TestTube className="w-4 h-4 mr-1" />
                        Test
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/models/edit/${model.id}`)}
                        className="flex-1 bg-gray-800/30 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-600/50"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteDialog({ open: true, model })}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-gray-700/50 hover:border-red-500/50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, model: null })}>
        <DialogContent className="bg-gray-900/95 border-gray-800/50 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Delete Model
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete "{deleteDialog.model?.name}"? This action cannot be undone and will
              permanently remove this model from your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, model: null })}
              className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteModel}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Model
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
