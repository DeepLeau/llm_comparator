"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  TestTube,
  Save,
  Shield,
  ExternalLink,
  Copy,
  CheckCircle,
  XCircle,
  Loader2,
  Key,
  Globe,
  Lock,
  User,
  Sparkles,
  Info,
} from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

const addModelSchema = z.object({
  name: z.string().min(1, "Model name is required").max(100, "Model name too long"),
  apiEndpoint: z.string().url("Valid API endpoint URL is required"),
  authType: z.enum(["Bearer", "Basic", "Custom Header", "None"]),
  apiKey: z.string().optional(),
  customHeaderKey: z.string().min(1).default("Authorization"),
  modelFormat: z.enum(["OpenAI-compatible", "HuggingFace", "Custom"]),
  testPrompt: z.string().min(1).default("Hello"),
  modelName: z.string().optional(),
})

type FormData = z.infer<typeof addModelSchema>

const MODEL_FORMATS = {
  "OpenAI-compatible": {
    name: "OpenAI Compatible",
    description: "OpenAI API format (GPT-4, Claude, etc.)",
    example: "https://api.openai.com/v1/chat/completions",
    icon: "🤖",
    color: "bg-green-500/10 border-green-500/20 text-green-400",
  },
  HuggingFace: {
    name: "HuggingFace Router",
    description: "HuggingFace models via Router API",
    example: "https://router.huggingface.co/v1/chat/completions",
    icon: "🤗",
    color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  },
  Custom: {
    name: "Custom Format",
    description: "Your own API with custom format",
    example: "https://your-api.com/generate",
    icon: "⚡",
    color: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  },
}

const AUTH_TYPES = {
  Bearer: {
    name: "Bearer Token",
    description: "Most common authentication method",
    icon: Key,
    placeholder: "sk-... or hf_...",
    example: "Authorization: Bearer your-token-here",
  },
  Basic: {
    name: "Basic Authentication",
    description: "Username and password authentication",
    icon: User,
    placeholder: "username:password",
    example: "Authorization: Basic base64(username:password)",
  },
  "Custom Header": {
    name: "Custom Header",
    description: "Custom header key with your API key",
    icon: Lock,
    placeholder: "your-api-key",
    example: "X-API-Key: your-api-key",
  },
  None: {
    name: "No Authentication",
    description: "Public API with no authentication required",
    icon: Globe,
    placeholder: "",
    example: "No authentication headers",
  },
}

const POPULAR_MODELS = [
  { name: "Llama 3.1 8B", value: "meta-llama/Llama-3.1-8B-Instruct", popular: true },
  { name: "Llama 3.1 70B", value: "meta-llama/Llama-3.1-70B-Instruct", popular: true },
  { name: "Mistral 7B", value: "mistralai/Mistral-7B-Instruct-v0.3", popular: true },
  { name: "Mixtral 8x7B", value: "mistralai/Mixtral-8x7B-Instruct-v0.1", popular: false },
  { name: "CodeLlama 7B", value: "codellama/CodeLlama-7b-Instruct-hf", popular: false },
  { name: "Flan T5 Large", value: "google/flan-t5-large", popular: false },
]

export default function AddModelPage() {
  const router = useRouter()
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    extractedText?: string
    details?: any
  } | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addModelSchema),
    defaultValues: {
      authType: "Bearer",
      customHeaderKey: "Authorization",
      modelFormat: "OpenAI-compatible",
      testPrompt: "Hello! How are you today?",
    },
  })

  const watchedFormat = watch("modelFormat")
  const watchedAuthType = watch("authType")
  const watchedEndpoint = watch("apiEndpoint")
  const watchedModelName = watch("modelName")

  // Auto-detect format based on endpoint
  const handleEndpointChange = (endpoint: string) => {
    setValue("apiEndpoint", endpoint)

    if (endpoint.includes("router.huggingface.co")) {
      setValue("modelFormat", "HuggingFace")
      setValue("modelName", "meta-llama/Llama-3.1-8B-Instruct")
    } else if (endpoint.includes("openai.com")) {
      setValue("modelFormat", "OpenAI-compatible")
    }
  }

  // Auto-fill endpoint based on format
  const handleFormatChange = (format: string) => {
    setValue("modelFormat", format as any)

    if (format === "HuggingFace") {
      setValue("apiEndpoint", "https://router.huggingface.co/v1/chat/completions")
      setValue("modelName", "meta-llama/Llama-3.1-8B-Instruct")
    } else if (format === "OpenAI-compatible" && !watchedEndpoint) {
      setValue("apiEndpoint", "https://api.openai.com/v1/chat/completions")
    }
  }

  const testConnection = async (data: FormData) => {
    setIsTestingConnection(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/models/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setTestResult({
          success: true,
          message: "Connection successful!",
          extractedText: result.extractedText,
          details: result.requestDetails,
        })
      } else {
        setTestResult({
          success: false,
          message: result.error || "Connection failed",
          details: result.details,
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: "Network error occurred",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const saveModel = async (data: FormData) => {
    setIsSaving(true)

    try {
      // Get the user's session token
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.access_token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch("/api/models/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        router.push("/dashboard/models?success=added")
      } else {
        setTestResult({
          success: false,
          message: result.error || "Failed to save model",
          details: result.details,
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: "Failed to save model",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getFinalModelName = () => {
    if (watchedFormat === "HuggingFace" && watchedEndpoint?.includes("router.huggingface.co") && watchedModelName) {
      return watchedModelName.includes(":featherless-ai") ? watchedModelName : `${watchedModelName}:featherless-ai`
    }
    return watchedModelName
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        {/* Header */}
        <div className="border-b border-gray-800/50 bg-gray-900/30 backdrop-blur-xl sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    Add Custom Model
                  </h1>
                  <p className="text-sm text-gray-400">Connect your private or self-hosted LLM</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                <Shield className="w-3 h-3 mr-1" />
                AES-256 Encrypted
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit(saveModel)} className="space-y-8">
            {/* Model Format Selection */}
            <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  Model Format
                </CardTitle>
                <CardDescription className="text-gray-400">Choose the API format your model uses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(MODEL_FORMATS).map(([key, format]) => (
                    <div
                      key={key}
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                        watchedFormat === key
                          ? format.color + " ring-2 ring-offset-2 ring-offset-gray-900 ring-current"
                          : "bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50"
                      }`}
                      onClick={() => handleFormatChange(key)}
                    >
                      <div className="flex flex-col gap-3 h-full">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl flex-shrink-0">{format.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white text-sm leading-tight">{format.name}</h3>
                          </div>
                          {watchedFormat === key && <CheckCircle className="w-4 h-4 text-current flex-shrink-0" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 leading-relaxed mb-2">{format.description}</p>
                          <code className="text-xs text-gray-500 block truncate bg-gray-800/50 px-2 py-1 rounded">
                            {format.example}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-400" />
                  Basic Information
                </CardTitle>
                <CardDescription className="text-gray-400">Configure your model's basic settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-200 font-medium">
                    Model Name
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="My Custom Model"
                    className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                  />
                  {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="apiEndpoint" className="text-gray-200 font-medium">
                      API Endpoint URL
                    </Label>
                    {watchedFormat === "HuggingFace" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard("https://router.huggingface.co/v1/chat/completions")}
                        className="text-gray-400 hover:text-white h-6 px-2"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    )}
                  </div>
                  <Input
                    id="apiEndpoint"
                    {...register("apiEndpoint")}
                    onChange={(e) => handleEndpointChange(e.target.value)}
                    placeholder={MODEL_FORMATS[watchedFormat]?.example}
                    className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                    readOnly={watchedFormat === "HuggingFace"}
                  />
                  {watchedFormat === "HuggingFace" && (
                    <Alert className="bg-blue-500/10 border-blue-500/20">
                      <Info className="w-4 h-4 text-blue-400" />
                      <AlertDescription className="text-blue-400 text-sm">
                        This URL is fixed for ALL HuggingFace models. The specific model is configured below.
                      </AlertDescription>
                    </Alert>
                  )}
                  {errors.apiEndpoint && <p className="text-sm text-red-400">{errors.apiEndpoint.message}</p>}
                </div>

                {watchedFormat === "HuggingFace" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="modelName" className="text-gray-200 font-medium">
                        HuggingFace Model Name
                        <span className="text-gray-400 text-sm ml-2 font-normal">(without :featherless-ai suffix)</span>
                      </Label>
                      <Input
                        id="modelName"
                        {...register("modelName")}
                        placeholder="meta-llama/Llama-3.1-8B-Instruct"
                        className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm text-gray-400">Popular models:</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {POPULAR_MODELS.map((model) => (
                          <Button
                            key={model.value}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setValue("modelName", model.value)}
                            className={`text-xs justify-start bg-gray-800/30 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-600/50 ${
                              model.popular ? "ring-1 ring-yellow-500/20" : ""
                            }`}
                          >
                            {model.popular && <span className="text-yellow-400 mr-1">⭐</span>}
                            {model.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {watchedModelName && (
                      <Alert className="bg-green-500/10 border-green-500/20">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <AlertDescription className="text-green-400">
                          Final model name will be:{" "}
                          <code className="bg-gray-800/50 px-2 py-1 rounded text-green-300">{getFinalModelName()}</code>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Authentication */}
            <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-400" />
                  Authentication
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure how to authenticate with your model API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-gray-200 font-medium">Authentication Type</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(AUTH_TYPES).map(([key, auth]) => {
                      const IconComponent = auth.icon
                      return (
                        <div
                          key={key}
                          className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                            watchedAuthType === key
                              ? "bg-blue-500/10 border-blue-500/30 text-blue-400 ring-2 ring-offset-2 ring-offset-gray-900 ring-blue-500/30"
                              : "bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50"
                          }`}
                          onClick={() => setValue("authType", key as any)}
                        >
                          <div className="flex items-start gap-3">
                            <IconComponent className="w-5 h-5 mt-0.5 text-current" />
                            <div className="flex-1">
                              <h3 className="font-medium text-white">{auth.name}</h3>
                              <p className="text-sm text-gray-400 mt-1">{auth.description}</p>
                              <code className="text-xs text-gray-500 mt-2 block">{auth.example}</code>
                            </div>
                          </div>
                          {watchedAuthType === key && (
                            <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-current" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Dynamic auth fields based on selected type */}
                {watchedAuthType !== "None" && (
                  <div className="space-y-4 p-4 bg-gray-800/20 rounded-lg border border-gray-700/30">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Key className="w-4 h-4" />
                      <span>Authentication Details</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {watchedAuthType === "Custom Header" && (
                        <div className="space-y-2">
                          <Label htmlFor="customHeaderKey" className="text-gray-200 font-medium">
                            Header Key
                          </Label>
                          <Input
                            id="customHeaderKey"
                            {...register("customHeaderKey")}
                            placeholder="X-API-Key"
                            className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="apiKey" className="text-gray-200 font-medium">
                            {watchedAuthType === "Basic" ? "Username:Password" : "API Key / Token"}
                          </Label>
                          {watchedFormat === "HuggingFace" && (
                            <Link
                              href="https://huggingface.co/settings/tokens"
                              target="_blank"
                              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                            >
                              Get HF Token
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                        <Input
                          id="apiKey"
                          type="password"
                          {...register("apiKey")}
                          placeholder={AUTH_TYPES[watchedAuthType].placeholder}
                          className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                        />
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Your API key will be encrypted with AES-256-GCM before storage
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Test Configuration */}
            <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-blue-400" />
                  Test Configuration
                </CardTitle>
                <CardDescription className="text-gray-400">Test your model configuration before saving</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="testPrompt" className="text-gray-200 font-medium">
                    Test Prompt
                  </Label>
                  <Textarea
                    id="testPrompt"
                    {...register("testPrompt")}
                    placeholder="Hello, how are you?"
                    className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 min-h-[100px]"
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleSubmit(testConnection)}
                    disabled={isTestingConnection}
                    variant="outline"
                    className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-600/50"
                  >
                    {isTestingConnection ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <TestTube className="w-4 h-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </div>

                {testResult && (
                  <Alert
                    className={
                      testResult.success ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
                    }
                  >
                    <div className="flex items-start gap-3">
                      {testResult.success ? (
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 space-y-2">
                        <AlertDescription className={testResult.success ? "text-green-400" : "text-red-400"}>
                          <div className="font-medium">{testResult.message}</div>
                        </AlertDescription>

                        {testResult.extractedText && (
                          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                            <p className="text-sm text-gray-300 font-medium mb-2">Generated Response:</p>
                            <pre className="text-sm text-white whitespace-pre-wrap font-mono">
                              {testResult.extractedText}
                            </pre>
                          </div>
                        )}

                        {testResult.details && typeof testResult.details === "string" && (
                          <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                            <p className="text-sm text-gray-400 font-medium mb-1">Details:</p>
                            <p className="text-xs text-gray-500">{testResult.details}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-600/50"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save this Model
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  )
}
