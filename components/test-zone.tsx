"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Clock,
  DollarSign,
  Star,
  Filter,
  Download,
  Expand,
  Loader2,
  Brain,
  MessageSquare,
  Zap,
  Cpu,
  Globe,
  Code,
} from "lucide-react"

interface LLMResult {
  id: string
  name: string
  icon: any
  response: string
  responseTime: number
  cost: number
  score: number
  color: string
}

const mockLLMs: Omit<LLMResult, "response" | "responseTime" | "cost" | "score">[] = [
  { id: "gpt4", name: "GPT-4", icon: Brain, color: "from-green-500 to-emerald-600" },
  { id: "claude", name: "Claude 3", icon: MessageSquare, color: "from-orange-500 to-red-600" },
  { id: "mistral", name: "Mistral Large", icon: Zap, color: "from-blue-500 to-indigo-600" },
  { id: "llama", name: "LLaMA 2", icon: Cpu, color: "from-purple-500 to-pink-600" },
  { id: "gemini", name: "Gemini Pro", icon: Globe, color: "from-yellow-500 to-orange-600" },
  { id: "codellama", name: "Code Llama", icon: Code, color: "from-cyan-500 to-blue-600" },
]

const promptSuggestions = [
  {
    title: "Email RH",
    prompt:
      "Rédigez un email professionnel pour informer les employés d'une nouvelle politique de télétravail hybride, en expliquant les avantages et les modalités pratiques.",
  },
  {
    title: "Résumé SAV",
    prompt:
      "Résumez cette conversation client : Le client se plaint que son produit ne fonctionne plus après 6 mois d'utilisation. Il demande un remboursement complet et menace de laisser un avis négatif.",
  },
  {
    title: "Génération commerciale",
    prompt:
      "Créez un pitch de vente convaincant pour une solution SaaS de gestion de projet destinée aux équipes de développement de 10-50 personnes.",
  },
  {
    title: "Extraction d'infos",
    prompt:
      "Extrayez les informations clés de ce texte : 'La réunion du 15 mars à 14h30 en salle de conférence A portera sur le budget Q2 2024. Participants : Marie Dupont (CFO), Jean Martin (CEO), Sophie Bernard (CMO). Ordre du jour : révision budgétaire, nouveaux investissements, stratégie marketing.'",
  },
]

interface TestZoneProps {
  id: string
}

export function TestZone({ id }: TestZoneProps) {
  const [prompt, setPrompt] = useState("")
  const [results, setResults] = useState<LLMResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedResult, setSelectedResult] = useState<LLMResult | null>(null)
  const [sortBy, setSortBy] = useState<"score" | "cost" | "time">("score")
  const [filterBy, setFilterBy] = useState<"all" | "fast" | "cheap" | "quality">("all")

  const generateMockResponse = (modelName: string, prompt: string): string => {
    const responses = {
      "GPT-4": `Voici une réponse détaillée et structurée de GPT-4 pour votre prompt : "${prompt.slice(0, 50)}..."\n\nCette réponse démontre la capacité de GPT-4 à comprendre le contexte et à fournir des informations pertinentes avec un style naturel et professionnel.`,
      "Claude 3": `Claude 3 répond avec précision : "${prompt.slice(0, 50)}..."\n\nJe propose une approche méthodique et réfléchie, en tenant compte des nuances de votre demande. Ma réponse est structurée pour être à la fois complète et facilement actionnable.`,
      "Mistral Large": `Réponse de Mistral Large : "${prompt.slice(0, 50)}..."\n\nEn tant que modèle français, je comprends parfaitement les subtilités linguistiques et culturelles. Ma réponse est optimisée pour le contexte francophone.`,
      "LLaMA 2": `LLaMA 2 génère : "${prompt.slice(0, 50)}..."\n\nMa réponse open-source offre une alternative performante avec une approche directe et efficace, tout en maintenant un haut niveau de qualité.`,
      "Gemini Pro": `Gemini Pro analyse : "${prompt.slice(0, 50)}..."\n\nJ'utilise mes capacités multimodales pour fournir une réponse complète, intégrant différentes perspectives et sources d'information.`,
      "Code Llama": `Code Llama traite : "${prompt.slice(0, 50)}..."\n\nSpécialisé dans le code et la logique, je fournis une réponse structurée avec une approche analytique et des exemples pratiques.`,
    }
    return responses[modelName as keyof typeof responses] || `Réponse générée par ${modelName}`
  }

  const runComparison = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setResults([])

    // Simulate API calls with staggered responses
    const mockResults: LLMResult[] = []

    for (let i = 0; i < mockLLMs.length; i++) {
      const model = mockLLMs[i]
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

      const result: LLMResult = {
        ...model,
        response: generateMockResponse(model.name, prompt),
        responseTime: Math.round(800 + Math.random() * 2000),
        cost: Math.round((0.01 + Math.random() * 0.05) * 100) / 100,
        score: Math.round(7 + Math.random() * 3),
      }

      mockResults.push(result)
      setResults([...mockResults])
    }

    setIsLoading(false)
  }

  const updateScore = (id: string, newScore: number) => {
    setResults((prev) => prev.map((result) => (result.id === id ? { ...result, score: newScore } : result)))
  }

  const filteredAndSortedResults = results
    .filter((result) => {
      if (filterBy === "all") return true
      if (filterBy === "fast") return result.responseTime < 1500
      if (filterBy === "cheap") return result.cost < 0.03
      if (filterBy === "quality") return result.score >= 8
      return true
    })
    .sort((a, b) => {
      if (sortBy === "score") return b.score - a.score
      if (sortBy === "cost") return a.cost - b.cost
      if (sortBy === "time") return a.responseTime - b.responseTime
      return 0
    })

  return (
    <section id={id} className="py-24 px-6 bg-gradient-to-b from-black to-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Test Your Prompt
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Enter your business prompt and see how different AI models perform
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Your Prompt</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your business prompt here... (e.g., 'Write a professional email to inform customers about a service update')"
                className="min-h-32 bg-white/5 border-white/20 text-white placeholder:text-gray-500 resize-none"
              />
            </div>

            {/* Prompt Suggestions */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Quick Examples</label>
              <div className="flex flex-wrap gap-3">
                {promptSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setPrompt(suggestion.prompt)}
                    className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                  >
                    {suggestion.title}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={runComparison}
                disabled={!prompt.trim() || isLoading}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 font-semibold rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Comparing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 w-5 h-5" />
                    Compare Models
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Results Section */}
        {(results.length > 0 || isLoading) && (
          <div className="space-y-6">
            {/* Filters and Controls */}
            <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Filter:</span>
                    <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                      <SelectTrigger className="w-32 bg-white/5 border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="fast">Fast</SelectItem>
                        <SelectItem value="cheap">Cheap</SelectItem>
                        <SelectItem value="quality">Quality</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Sort by:</span>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-32 bg-white/5 border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="score">Score</SelectItem>
                        <SelectItem value="cost">Cost</SelectItem>
                        <SelectItem value="time">Speed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
                  disabled={results.length === 0}
                >
                  <Download className="mr-2 w-4 h-4" />
                  Export CSV
                </Button>
              </div>
            </Card>

            {/* Results Grid */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {filteredAndSortedResults.map((result, index) => (
                <Card
                  key={result.id}
                  className="p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    {/* Model Info */}
                    <div className="flex items-center gap-4 min-w-48">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${result.color} rounded-xl flex items-center justify-center`}
                      >
                        <result.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{result.name}</h3>
                        <Badge variant="outline" className="mt-1 border-white/20 text-gray-400">
                          #{index + 1}
                        </Badge>
                      </div>
                    </div>

                    {/* Response */}
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-gray-300 text-sm line-clamp-3 cursor-pointer hover:text-white transition-colors"
                        onClick={() => setSelectedResult(result)}
                      >
                        {result.response}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedResult(result)}
                        className="mt-2 text-purple-400 hover:text-purple-300 p-0 h-auto"
                      >
                        <Expand className="mr-1 w-3 h-3" />
                        View full response
                      </Button>
                    </div>

                    {/* Metrics */}
                    <div className="flex flex-col gap-4 min-w-48">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="w-4 h-4" />
                          {result.responseTime}ms
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <DollarSign className="w-4 h-4" />${result.cost}
                        </div>
                      </div>

                      {/* Score Slider */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Your Score</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-white">{result.score}/10</span>
                          </div>
                        </div>
                        <Slider
                          value={[result.score]}
                          onValueChange={(value) => updateScore(result.id, value[0])}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Loading States */}
              {isLoading &&
                Array.from({ length: mockLLMs.length - results.length }).map((_, index) => (
                  <Card
                    key={`loading-${index}`}
                    className="p-6 bg-white/5 border-white/10 backdrop-blur-sm animate-pulse"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-gray-700 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-1/4" />
                        <div className="h-3 bg-gray-700 rounded w-3/4" />
                        <div className="h-3 bg-gray-700 rounded w-1/2" />
                      </div>
                      <div className="w-48 space-y-2">
                        <div className="h-3 bg-gray-700 rounded w-full" />
                        <div className="h-3 bg-gray-700 rounded w-2/3" />
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Response Modal */}
        <Dialog open={!!selectedResult} onOpenChange={() => setSelectedResult(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] bg-gray-900 border-white/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white">
                {selectedResult && (
                  <>
                    <div
                      className={`w-8 h-8 bg-gradient-to-r ${selectedResult.color} rounded-lg flex items-center justify-center`}
                    >
                      <selectedResult.icon className="w-4 h-4 text-white" />
                    </div>
                    {selectedResult.name} Response
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <div className="bg-white/5 rounded-lg p-6 max-h-96 overflow-y-auto">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedResult?.response}</p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedResult?.responseTime}ms
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />${selectedResult?.cost}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {selectedResult?.score}/10
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
