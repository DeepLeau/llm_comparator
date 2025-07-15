"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { ProgressIndicator } from "./progress-indicator"
import { UseCaseCard } from "./use-case-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, PenTool, Code, BarChart3, Headphones, Globe, Search } from 'lucide-react'
import { useWorkflow } from "@/contexts/workflow-context"

const stepNames = ["Use Case", "Models", "Prompts", "Summary"]

const useCases = [
  {
    id: "content-generation",
    name: "Content Generation",
    description:
      "Create high-quality written content including articles, blog posts, marketing copy, and creative writing.",
    icon: <PenTool className="w-5 h-5 text-blue-400" />,
    examples: [
      "Write a blog post about sustainable technology trends",
      "Create product descriptions for an e-commerce website",
      "Generate social media captions for a marketing campaign",
      "Draft email newsletters for customer engagement",
    ],
  },
  {
    id: "code-assistance",
    name: "Code Assistance",
    description:
      "Get help with programming tasks including code generation, debugging, optimization, and documentation.",
    icon: <Code className="w-5 h-5 text-green-400" />,
    examples: [
      "Generate a Python function to process CSV data",
      "Debug JavaScript code and suggest improvements",
      "Create API documentation from existing code",
      "Write unit tests for existing functions",
    ],
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    description: "Analyze datasets, generate insights, create summaries, and help with data interpretation tasks.",
    icon: <BarChart3 className="w-5 h-5 text-purple-400" />,
    examples: [
      "Analyze sales data and identify trends",
      "Summarize customer feedback from surveys",
      "Generate insights from financial reports",
      "Create data visualizations and charts",
    ],
  },
  {
    id: "customer-support",
    name: "Customer Support",
    description: "Provide automated customer service responses, FAQ answers, and support ticket resolution.",
    icon: <Headphones className="w-5 h-5 text-orange-400" />,
    examples: [
      "Generate responses to common customer inquiries",
      "Create help documentation from support tickets",
      "Draft professional email responses to complaints",
      "Automate FAQ responses for common questions",
    ],
  },
  {
    id: "translation",
    name: "Translation & Localization",
    description: "Translate content between languages and adapt it for different cultural contexts and markets.",
    icon: <Globe className="w-5 h-5 text-cyan-400" />,
    examples: [
      "Translate marketing materials from English to Spanish",
      "Localize app content for different regions",
      "Convert technical documentation to multiple languages",
      "Adapt cultural references for international markets",
    ],
  },
  {
    id: "research",
    name: "Research & Summarization",
    description: "Conduct research, summarize documents, extract key information, and synthesize findings.",
    icon: <Search className="w-5 h-5 text-yellow-400" />,
    examples: [
      "Summarize academic papers on climate change",
      "Extract key points from lengthy reports",
      "Research and compile information on market trends",
      "Create executive summaries from detailed documents",
    ],
  },
]

export function UseCaseSelector() {
  const router = useRouter()
  const { state, setUseCase, setCurrentStep } = useWorkflow()
  const [selectedUseCaseId, setSelectedUseCaseId] = useState<string | null>(state.selectedUseCase?.id || null)

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleContinue = () => {
    if (selectedUseCaseId) {
      const selectedUseCase = useCases.find((uc) => uc.id === selectedUseCaseId)
      if (selectedUseCase) {
        setUseCase({
          id: selectedUseCase.id,
          name: selectedUseCase.name,
          description: selectedUseCase.description,
          icon: selectedUseCase.id,
          examples: selectedUseCase.examples,
        })
        setCurrentStep(2)
        router.push("/model-selection")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <PageHeader title="Use Case Selection" onBack={handleBack} />

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ProgressIndicator currentStep={1} totalSteps={4} stepNames={stepNames} />

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">What's your use case?</h1>
            <p className="mt-4 text-lg text-gray-400">
              Select the primary use case for your LLM comparison to get personalized model recommendations.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {useCases.map((useCase) => (
              <UseCaseCard
                key={useCase.id}
                title={useCase.name}
                description={useCase.description}
                examples={useCase.examples}
                icon={useCase.icon}
                isSelected={selectedUseCaseId === useCase.id}
                onClick={() => setSelectedUseCaseId(useCase.id)}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleContinue}
              disabled={!selectedUseCaseId}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Model Selection
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}