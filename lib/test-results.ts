import { supabase } from "@/lib/supabase"

export interface ModelPromptResult {
  promptIndex: number
  prompt: string
  response: string
  responseTime: number
  cost: number
  score: number
  error?: string
}

export interface ModelResult {
  id: string
  modelId: string
  modelName: string
  provider: string
  isOpenSource: boolean
  storesData: boolean
  // Résultats agrégés
  averageScore: number
  averageCost: number
  averageResponseTime: number
  totalCost: number
  // Détails par prompt
  promptResults: ModelPromptResult[]
  error?: string
}

export interface TestSession {
  id: string
  results: ModelResult[]
  systemPrompt: string
  prompts: string[] // Changé de userPrompt à prompts (array)
  timestamp: Date
  stats: {
    totalModels: number
    totalPrompts: number
    totalTests: number
    successfulTests: number
    failedTests: number
    averageResponseTime: number
    totalCost: number
  }
}

let currentTestSession: TestSession | null = null

export function setCurrentTestSession(session: TestSession) {
  currentTestSession = session

  // Sauvegarder dans localStorage avec gestion d'erreur
  try {
    const sessionToSave = {
      ...session,
      results: session.results.map((r) => ({
        ...r,
        timestamp: r.timestamp instanceof Date ? r.timestamp.toISOString() : new Date().toISOString(),
      })),
    }
    localStorage.setItem("currentTestSession", JSON.stringify(sessionToSave))
  } catch (error) {
    console.warn("Failed to save test session to localStorage:", error)
  }
}

export async function getCurrentTestSession(): Promise<TestSession | null> {
  const urlParams = new URLSearchParams(window.location.search)
  const testId = urlParams.get("testId")?.trim()

  // ⚠️ Aucun testId => utiliser localStorage uniquement
  if (!testId) {
    try {
      const storedSession = localStorage.getItem("currentTestSession")
      return storedSession ? JSON.parse(storedSession) : null
    } catch (err) {
      console.error("Failed to load session from localStorage:", err)
      return null
    }
  }

  try {
    // Fetch depuis Supabase comme avant...
    const { data: test, error: testError } = await supabase.from("tests").select("*").eq("id", testId).single()
    if (testError || !test) {
      console.error("Error loading test:", testError)
      return null
    }

    const { data: prompts, error: promptsError } = await supabase
      .from("prompts")
      .select("*")
      .filter("test_id", "eq", testId)

    if (promptsError) {
      console.error("Error loading prompts:", promptsError)
      return null
    }

    const { data: results, error: resultsError } = await supabase
      .from("results")
      .select("*")
      .filter("test_id", "eq", testId)

    if (resultsError) {
      console.error("Error loading results:", resultsError)
      return null
    }

    // 👉 Ajouter ici la logique d'enrichissement (provider + license) comme tu l'as fait
    const { data: modelsMeta } = await supabase.from("models").select("name, provider, is_open_source")

    const modelResultsMap = new Map<string, ModelResult>()
    results.forEach((result) => {
      const modelKey = result.model_name
      const modelMeta = modelsMeta?.find((m) => m.name === modelKey)

      if (!modelResultsMap.has(modelKey)) {
        modelResultsMap.set(modelKey, {
          id: `${result.model_name}-${Date.now()}`,
          modelId: result.model_name,
          modelName: result.model_name.split(":")[1] || result.model_name,
          provider: modelMeta?.provider || "unknown",
          isOpenSource: modelMeta?.is_open_source || false,
          storesData: result.stores_data ?? null,
          averageScore: 0,
          averageCost: 0,
          averageResponseTime: 0,
          totalCost: 0,
          promptResults: [],
          timestamp: new Date().toISOString(),
        })
      }

      const modelResult = modelResultsMap.get(modelKey)!
      const prompt = prompts.find((p) => p.id === result.prompt_id)

      const promptResult: ModelPromptResult = {
        promptIndex: modelResult.promptResults.length,
        prompt: prompt?.user_prompt || "Unknown prompt",
        response: result.response_text || "",
        responseTime: result.response_time || 0,
        cost: result.cost || 0,
        score: result.quality_score || 0,
        ...(result.response_text ? {} : { error: result.error || "No response" }),
      }

      modelResult.promptResults.push(promptResult)
    })

    const modelResults = Array.from(modelResultsMap.values()).map((model) => {
      const valid = model.promptResults.filter((r) => !r.error)
      if (valid.length > 0) {
        model.averageScore = valid.reduce((s, r) => s + r.score, 0) / valid.length
        model.averageResponseTime = valid.reduce((s, r) => s + r.responseTime, 0) / valid.length
        model.averageCost = valid.reduce((s, r) => s + r.cost, 0) / valid.length
        model.totalCost = valid.reduce((s, r) => s + r.cost, 0)
      }
      return model
    })

    const session: TestSession = {
      id: test.id,
      results: modelResults,
      systemPrompt: prompts[0]?.system_prompt || "",
      prompts: prompts.map((p) => p.user_prompt),
      timestamp: new Date(test.created_at),
      stats: {
        totalModels: modelResults.length,
        totalPrompts: prompts.length,
        totalTests: results.length,
        successfulTests: results.filter((r) => r.response_text).length,
        failedTests: results.filter((r) => !r.response_text).length,
        averageResponseTime:
          results.reduce((s, r) => s + (r.response_time || 0), 0) / (results.length || 1),
        totalCost: test.total_cost || 0,
      },
    }

    localStorage.setItem("currentTestSession", JSON.stringify(session))
    return session
  } catch (err) {
    console.error("Error in getCurrentTestSession:", err)
    return null
  }
}


export function clearCurrentTestSession() {
  currentTestSession = null
  try {
    localStorage.removeItem("currentTestSession")
  } catch (error) {
    console.warn("Failed to clear test session from localStorage:", error)
  }
}
