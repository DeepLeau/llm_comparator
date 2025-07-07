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

export function getCurrentTestSession(): TestSession | null {
  if (currentTestSession) {
    return currentTestSession
  }

  // Essayer de charger depuis localStorage
  try {
    const saved = localStorage.getItem("currentTestSession")
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        ...parsed,
        timestamp: parsed.timestamp ? new Date(parsed.timestamp) : new Date(),
        results:
          parsed.results?.map((r: any) => ({
            ...r,
            timestamp: r.timestamp ? new Date(r.timestamp) : new Date(),
          })) || [],
      }
    }
  } catch (error) {
    console.warn("Failed to load test session from localStorage:", error)
  }

  return null
}

export function clearCurrentTestSession() {
  currentTestSession = null
  try {
    localStorage.removeItem("currentTestSession")
  } catch (error) {
    console.warn("Failed to clear test session from localStorage:", error)
  }
}
