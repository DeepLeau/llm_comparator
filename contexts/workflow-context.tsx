"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface UseCase {
  id: string
  name: string
  description: string
  icon: string
  examples: string[]
}

export interface Model {
  id: string
  name: string
  provider: string
  license: "open-source" | "commercial"
  costPer1kTokens: number
  contextWindow: number
  description: string
  strengths: string[]
  inputCost: number
  outputCost: number
}

export interface Prompt {
  id: string
  content: string
  systemPrompt: string
  userPrompt: string
  createdAt: Date
}

export interface WorkflowState {
  currentStep: number
  selectedUseCase: UseCase | null
  selectedModels: Model[]
  prompts: Prompt[]
  estimatedCost: number
}

type WorkflowAction =
  | { type: "SET_STEP"; step: number }
  | { type: "SET_USE_CASE"; useCase: UseCase }
  | { type: "SET_MODELS"; models: Model[] }
  | { type: "ADD_PROMPT"; prompt: Prompt }
  | { type: "REMOVE_PROMPT"; promptId: string }
  | { type: "UPDATE_PROMPT"; promptId: string; content: string }
  | { type: "RESET_WORKFLOW" }
  | { type: "LOAD_STATE"; state: WorkflowState }

const initialState: WorkflowState = {
  currentStep: 1,
  selectedUseCase: null,
  selectedModels: [],
  prompts: [],
  estimatedCost: 0,
}

function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.step }

    case "SET_USE_CASE":
      return { ...state, selectedUseCase: action.useCase, currentStep: 2 }

    case "SET_MODELS":
      const estimatedCost = action.models.reduce((total, model) => total + model.costPer1kTokens, 0)
      return { ...state, selectedModels: action.models, estimatedCost, currentStep: 3 }

    case "ADD_PROMPT":
      return { ...state, prompts: [...state.prompts, action.prompt] }

    case "REMOVE_PROMPT":
      return { ...state, prompts: state.prompts.filter((p) => p.id !== action.promptId) }

    case "UPDATE_PROMPT":
      return {
        ...state,
        prompts: state.prompts.map((p) => (p.id === action.promptId ? { ...p, content: action.content } : p)),
      }

    case "RESET_WORKFLOW":
      return initialState

    case "LOAD_STATE":
      return action.state

    default:
      return state
  }
}

interface WorkflowContextType {
  state: WorkflowState
  setCurrentStep: (step: number) => void
  setUseCase: (useCase: UseCase) => void
  setModels: (models: Model[]) => void
  addPrompt: (prompt: Prompt) => void
  removePrompt: (promptId: string) => void
  updatePrompt: (promptId: string, content: string) => void
  resetWorkflow: () => void
  getEstimatedCost: () => number
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined)

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState)

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem("workflow-state")
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        // Convert date strings back to Date objects
        if (parsedState.prompts) {
          parsedState.prompts = parsedState.prompts.map((prompt: any) => ({
            ...prompt,
            createdAt: new Date(prompt.createdAt),
          }))
        }
        dispatch({ type: "LOAD_STATE", state: parsedState })
      }
    } catch (error) {
      console.error("Failed to load workflow state:", error)
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("workflow-state", JSON.stringify(state))
    } catch (error) {
      console.error("Failed to save workflow state:", error)
    }
  }, [state])

  const contextValue: WorkflowContextType = {
    state,
    setCurrentStep: (step: number) => dispatch({ type: "SET_STEP", step }),
    setUseCase: (useCase: UseCase) => dispatch({ type: "SET_USE_CASE", useCase }),
    setModels: (models: Model[]) => dispatch({ type: "SET_MODELS", models }),
    addPrompt: (prompt: Prompt) => dispatch({ type: "ADD_PROMPT", prompt }),
    removePrompt: (promptId: string) => dispatch({ type: "REMOVE_PROMPT", promptId }),
    updatePrompt: (promptId: string, content: string) => dispatch({ type: "UPDATE_PROMPT", promptId, content }),
    resetWorkflow: () => dispatch({ type: "RESET_WORKFLOW" }),
    getEstimatedCost: () => state.estimatedCost,
  }

  return <WorkflowContext.Provider value={contextValue}>{children}</WorkflowContext.Provider>
}

export function useWorkflow() {
  const context = useContext(WorkflowContext)
  if (context === undefined) {
    throw new Error("useWorkflow must be used within a WorkflowProvider")
  }
  return context
}