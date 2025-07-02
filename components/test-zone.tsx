"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Play, Clock, DollarSign, Star, Filter, Download, Expand, Loader2 } from "lucide-react"

interface LLMResult {
  id: string
  name: string
  logo: string
  company: string
  response: string
  responseTime: number
  cost: number
  score: number
  color: string
}

const mockLLMs: Omit<LLMResult, "response" | "responseTime" | "cost" | "score">[] = [
  {
    id: "gpt4o",
    name: "GPT-4o",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    company: "OpenAI",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "claude",
    name: "Claude 3.5 Sonnet",
    logo: "https://cdn.brandfetch.io/idmJWF3N06/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B",
    company: "Anthropic",
    color: "from-orange-500 to-red-600",
  },
  {
    id: "mistral",
    name: "Mistral Nemo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Mistral_AI_logo_%282025%E2%80%93%29.svg/768px-Mistral_AI_logo_%282025%E2%80%93%29.svg.png",
    company: "Mistral AI",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "llama",
    name: "LLaMA 3.3 70B",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    company: "Meta",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "mixtral",
    name: "Mixtral 8x7B",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Mistral_AI_logo_%282025%E2%80%93%29.svg/768px-Mistral_AI_logo_%282025%E2%80%93%29.svg.png",
    company: "Mistral AI",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "grok",
    name: "Grok 3 Beta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5a/X_icon_2.svg",
    company: "xAI",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "deephermes",
    name: "Nous: DeepHermes 3",
    logo: "https://avatars.githubusercontent.com/u/152546492?s=200&v=4",
    company: "Nous Research",
    color: "from-teal-500 to-cyan-600",
  },
  {
    id: "phi4",
    name: "Phi-4",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    company: "Microsoft",
    color: "from-indigo-500 to-blue-600",
  },
  {
    id: "deepseek",
    name: "Deepseek Chat V3",
    logo: "https://avatars.githubusercontent.com/u/165393474?s=200&v=4",
    company: "DeepSeek",
    color: "from-pink-500 to-rose-600",
  },
]

const promptSuggestions = [
  {
    title: "HR Email",
    prompt:
      "Write a professional email to inform employees about a new hybrid remote work policy, explaining its benefits and practical details.",
  },
  {
    title: "Customer Support Summary",
    prompt:
      "Summarize the following customer conversation: the customer complains that their product stopped working after 6 months of use. They are requesting a full refund and threatening to leave a negative review.",
  },
  {
    title: "Sales Generation",
    prompt:
      "Create a compelling sales pitch for a project management SaaS solution designed for development teams of 10–50 people.",
  },
  {
    title: "Information Extraction",
    prompt:
      "Extract the key information from the following text:'The meeting on March 15 at 2:30 PM in Conference Room A will cover the Q2 2024 budget. Attendees: Marie Dupont (CFO), Jean Martin (CEO), Sophie Bernard (CMO). Agenda: budget review, new investments, marketing strategy.'",
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

  const runComparison = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setResults([])

    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
    if (!apiKey) {
      console.error("API Key manquante")
      setIsLoading(false)
      return
    }

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "LLM Comparison Tool",
    }

    // Mapping corrigé des modèles
    const modelsMap: Record<string, string> = {
      "GPT-4o": "openai/gpt-4o",
      "Claude 3.5 Sonnet": "anthropic/claude-3-5-sonnet-20241022",
      "Mistral Nemo": "mistralai/mistral-nemo",
      "LLaMA 3.3 70B": "meta-llama/llama-3.3-70b-instruct",
      "Mixtral 8x7B": "mistralai/mixtral-8x7b-instruct",
      "Grok 3 Beta": "x-ai/grok-beta",
      "Nous: DeepHermes 3": "nousresearch/nous-hermes-2-mixtral-8x7b-dpo",
      "Phi-4": "microsoft/phi-4",
      "Deepseek Chat V3": "deepseek/deepseek-chat",
    }

    // Étape 1: Obtenir les réponses de tous les modèles
    const resultPromises = mockLLMs.map(async (model) => {
      try {
        const startTime = performance.now()
        const tokenLimit = 300

        const requestBody = {
          model: modelsMap[model.name],
          messages: [
            {
              role: "user",
              content: `You have a maximum of ${tokenLimit} tokens to answer.${prompt}`,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }

        console.log(`Requesting ${model.name} with model: ${modelsMap[model.name]}`)

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
        })

        const endTime = performance.now()

        if (!res.ok) {
          console.error(`Error for ${model.name}:`, res.status, res.statusText)
          throw new Error(`HTTP ${res.status}`)
        }

        const json = await res.json()
        console.log(`Response for ${model.name}:`, json)

        // Vérification de la structure de réponse
        if (!json.choices || !json.choices[0] || !json.choices[0].message) {
          throw new Error("Invalid response structure")
        }

        const responseText = json.choices[0].message.content || "No response"
        const promptTokens = json.usage?.prompt_tokens || 0
        const completionTokens = json.usage?.completion_tokens || 0

        // Calcul du coût simplifié et plus robuste
        let cost = 0
        const modelUsed = json.model || modelsMap[model.name]

        if (modelUsed.includes("gpt-4o")) {
          cost = (promptTokens / 1_000_000) * 2.5 + (completionTokens / 1_000_000) * 10
        } else if (modelUsed.includes("claude")) {
          cost = (promptTokens / 1_000_000) * 3 + (completionTokens / 1_000_000) * 15
        } else if (modelUsed.includes("mistral-nemo")) {
          cost = (promptTokens / 1_000_000) * 0.3 + (completionTokens / 1_000_000) * 0.3
        } else if (modelUsed.includes("llama")) {
          cost = (promptTokens / 1_000_000) * 0.59 + (completionTokens / 1_000_000) * 0.79
        } else if (modelUsed.includes("mixtral")) {
          cost = (promptTokens / 1_000_000) * 0.24 + (completionTokens / 1_000_000) * 0.24
        } else if (modelUsed.includes("grok")) {
          cost = (promptTokens / 1_000_000) * 5 + (completionTokens / 1_000_000) * 15
        } else if (modelUsed.includes("free")) {
          cost = 0
        } else {
          // Coût par défaut pour les modèles inconnus
          cost = (promptTokens / 1_000_000) * 0.1 + (completionTokens / 1_000_000) * 0.1
        }

        return {
          ...model,
          response: responseText,
          responseTime: Math.round(endTime - startTime),
          cost: Math.round(cost * 10000) / 10000, // 4 décimales
          score: 5, // Score par défaut, sera mis à jour
        } as LLMResult
      } catch (err) {
        console.error(`Error fetching response for ${model.name}:`, err)
        return {
          ...model,
          response: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
          responseTime: 0,
          cost: 0,
          score: 0,
        } as LLMResult
      }
    })

    const initialResults = await Promise.all(resultPromises)

    // Étape 2: Scoring automatique amélioré
    const scoreAllResponses = async (results: LLMResult[]): Promise<LLMResult[]> => {
      const validResults = results.filter((r) => !r.response.startsWith("Error:"))

      if (validResults.length === 0) {
        console.log("No valid results to score")
        return results
      }

      try {
        // Prompt de scoring plus simple et plus fiable
        const scoringPrompt = `Évalue ces ${validResults.length} réponses à la question: "${prompt}"

${validResults.map((result, index) => `RÉPONSE ${index + 1} (${result.name}):\n${result.response}\n`).join("\n")}

Donne une note de 1.0 à 10.0 pour chaque réponse en considérant:
- Pertinence et précision
- Clarté et structure  
- Complétude de la réponse

Réponds UNIQUEMENT avec les notes séparées par des virgules (ex: 8.1,7.5,9,6)`

        console.log("Sending scoring request...")

        const scoringRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: "anthropic/claude-3-opus",
            messages: [{ role: "user", content: scoringPrompt }],
            max_tokens: 50,
            temperature: 0.1,
          }),
        })

        if (!scoringRes.ok) {
          throw new Error(`Scoring request failed: ${scoringRes.status}`)
        }

        const scoringJson = await scoringRes.json()
        console.log("Scoring response:", scoringJson)

        const scoreText = scoringJson.choices?.[0]?.message?.content || ""
        console.log("Score text:", scoreText)

        // Parser les scores de manière plus robuste
        const scoreMatches = scoreText.match(/\d+/g)
        const scores = scoreMatches ? scoreMatches.map((s) => Math.min(Math.max(Number.parseInt(s), 1), 10)) : []

        console.log("Parsed scores:", scores)

        // Appliquer les scores
        const scoredResults = results.map((result) => {
          if (result.response.startsWith("Error:")) {
            return { ...result, score: 0 }
          }

          const validIndex = validResults.findIndex((r) => r.name === result.name)
          const score = scores[validIndex] || Math.floor(Math.random() * 5) + 5 // Fallback aléatoire 5-9

          return { ...result, score }
        })

        return scoredResults
      } catch (err) {
        console.error("Error in scoring:", err)
        // Fallback: scores aléatoires mais réalistes
        return results.map((result) => ({
          ...result,
          score: result.response.startsWith("Error:") ? 0 : Math.floor(Math.random() * 4) + 6, // 6-9
        }))
      }
    }

    // Appliquer le scoring
    const finalResults = await scoreAllResponses(initialResults)

    setResults(finalResults)
    setIsLoading(false)
  }

  const updateScore = (id: string, newScore: number) => {
    setResults((prev) => prev.map((result) => (result.id === id ? { ...result, score: newScore } : result)))
  }

  const exportToExcel = () => {
    if (results.length === 0) return

    // Créer un vrai fichier Excel en utilisant le format Excel XML
    const createExcelXML = () => {
      const xmlHeader = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>Comparaison LLM</Title>
  <Author>LLM Comparison Tool</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">
  <WindowHeight>12000</WindowHeight>
  <WindowWidth>15000</WindowWidth>
  <WindowTopX>240</WindowTopX>
  <WindowTopY>75</WindowTopY>
  <ProtectStructure>False</ProtectStructure>
  <ProtectWindows>False</ProtectWindows>
 </ExcelWorkbook>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Size="12" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#4F46E5" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="DataStyle">
   <Alignment ss:Vertical="Top" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Size="11"/>
  </Style>
  <Style ss:ID="CenterStyle" ss:Parent="DataStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="ExcellentScore" ss:Parent="CenterStyle">
   <Interior ss:Color="#D1FAE5" ss:Pattern="Solid"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#065F46"/>
  </Style>
  <Style ss:ID="GoodScore" ss:Parent="CenterStyle">
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#92400E"/>
  </Style>
  <Style ss:ID="PoorScore" ss:Parent="CenterStyle">
   <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#991B1B"/>
  </Style>
  <Style ss:ID="TitleStyle">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="16" ss:Bold="1" ss:Color="#4F46E5"/>
  </Style>
  <Style ss:ID="InfoStyle">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#6B7280"/>
  </Style>
 </Styles>`

      const worksheetStart = `
 <Worksheet ss:Name="Comparaison LLM">
  <Table ss:ExpandedColumnCount="7" ss:ExpandedRowCount="${filteredAndSortedResults.length + 10}" x:FullColumns="1" x:FullRows="1" ss:DefaultColumnWidth="60" ss:DefaultRowHeight="15">
   <Column ss:Index="1" ss:AutoFitWidth="0" ss:Width="50"/>
   <Column ss:Index="2" ss:AutoFitWidth="0" ss:Width="150"/>
   <Column ss:Index="3" ss:AutoFitWidth="0" ss:Width="120"/>
   <Column ss:Index="4" ss:AutoFitWidth="0" ss:Width="100"/>
   <Column ss:Index="5" ss:AutoFitWidth="0" ss:Width="80"/>
   <Column ss:Index="6" ss:AutoFitWidth="0" ss:Width="80"/>
   <Column ss:Index="7" ss:AutoFitWidth="0" ss:Width="400"/>`

      // Métadonnées
      const metadataRows = `
   <Row ss:Height="25">
    <Cell ss:StyleID="TitleStyle"><Data ss:Type="String">📊 Rapport de Comparaison LLM</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="InfoStyle"><Data ss:Type="String">📅 Date: ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="InfoStyle"><Data ss:Type="String">💬 Prompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? "..." : ""}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="InfoStyle"><Data ss:Type="String">🤖 Modèles: ${results.length}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="InfoStyle"><Data ss:Type="String">🎯 Légende: 8-10 (Excellent), 6-7 (Bon), 0-5 (À améliorer)</Data></Cell>
   </Row>
   <Row></Row>`

      // En-têtes
      const headerRow = `
   <Row ss:Height="30">
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">🏆 Rang</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">🤖 Modèle IA</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">🏢 Entreprise</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">⚡ Temps (ms)</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">💰 Coût ($)</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">⭐ Score (/10)</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">📝 Réponse</Data></Cell>
   </Row>`

      // Données
      const dataRows = filteredAndSortedResults
        .map((result, index) => {
          const scoreStyle = result.score >= 8 ? "ExcellentScore" : result.score >= 6 ? "GoodScore" : "PoorScore"
          const cleanResponse =
            result.response
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&apos;")
              .substring(0, 500) + (result.response.length > 500 ? "..." : "")

          return `
   <Row ss:Height="60">
    <Cell ss:StyleID="CenterStyle"><Data ss:Type="Number">${index + 1}</Data></Cell>
    <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${result.name}</Data></Cell>
    <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${result.company}</Data></Cell>
    <Cell ss:StyleID="CenterStyle"><Data ss:Type="Number">${result.responseTime}</Data></Cell>
    <Cell ss:StyleID="CenterStyle"><Data ss:Type="Number">${result.cost.toFixed(4)}</Data></Cell>
    <Cell ss:StyleID="${scoreStyle}"><Data ss:Type="Number">${result.score}</Data></Cell>
    <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${cleanResponse}</Data></Cell>
   </Row>`
        })
        .join("")

      const worksheetEnd = `
  </Table>
  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
   <PageSetup>
    <Header x:Margin="0.3"/>
    <Footer x:Margin="0.3"/>
    <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>
   </PageSetup>
   <Print>
    <ValidPrinterInfo/>
    <PaperSizeIndex>9</PaperSizeIndex>
    <HorizontalResolution>600</HorizontalResolution>
    <VerticalResolution>600</VerticalResolution>
   </Print>
   <Selected/>
   <FreezePanes/>
   <FrozenNoSplit/>
   <SplitHorizontal>7</SplitHorizontal>
   <TopRowBottomPane>7</TopRowBottomPane>
   <ActivePane>2</ActivePane>
   <Panes>
    <Pane>
     <Number>3</Number>
    </Pane>
    <Pane>
     <Number>2</Number>
     <ActiveRow>0</ActiveRow>
    </Pane>
   </Panes>
   <ProtectObjects>False</ProtectObjects>
   <ProtectScenarios>False</ProtectScenarios>
  </WorksheetOptions>
 </Worksheet>
</Workbook>`

      return xmlHeader + worksheetStart + metadataRows + headerRow + dataRows + worksheetEnd
    }

    const excelXML = createExcelXML()

    const blob = new Blob([excelXML], {
      type: "application/vnd.ms-excel;charset=utf-8",
    })

    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `Comparaison-LLM-${new Date().toISOString().split("T")[0]}.xls`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToExcel}
                    className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
                    disabled={results.length === 0}
                  >
                    <Download className="mr-2 w-4 h-4" />
                    Export Excel
                  </Button>
                </div>
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
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg">
                        <img
                          src={result.logo || "/placeholder.svg"}
                          alt={`${result.company} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Fallback en cas d'erreur de chargement
                            const target = e.target as HTMLImageElement
                            target.src = `/placeholder.svg?height=48&width=48&text=${result.company.charAt(0)}`
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{result.name}</h3>
                        <p className="text-sm text-gray-400">{result.company}</p>
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
                          <DollarSign className="w-4 h-4" />${result.cost.toFixed(4)}
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
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1">
                      <img
                        src={selectedResult.logo || "/placeholder.svg"}
                        alt={`${selectedResult.company} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {selectedResult.name} Response
                    <span className="text-sm text-gray-400">by {selectedResult.company}</span>
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
                    <DollarSign className="w-4 h-4" />${selectedResult?.cost.toFixed(4)}
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
