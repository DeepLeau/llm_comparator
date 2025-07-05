"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Lightbulb, Plus } from "lucide-react"

interface PromptFormProps {
  onAddPrompt: (systemPrompt: string, userPrompt: string) => void
}

const examplePrompts = [
  {
    system: "You are a professional email writer. Write clear, concise, and polite emails.",
    user: "Write an email to inform customers about a scheduled maintenance that will affect our service for 2 hours tomorrow.",
  },
  {
    system: "You are a social media content creator. Create engaging posts that drive interaction.",
    user: "Create a LinkedIn post announcing the launch of our new eco-friendly product line.",
  },
  {
    system: "You are a helpful coding assistant. Provide clean, well-documented code solutions.",
    user: "Write a Python function that reads a CSV file and returns the average of a specific column.",
  },
  {
    system: "You are a customer service representative. Be helpful, empathetic, and solution-focused.",
    user: "Respond to a customer complaint about a delayed delivery and offer appropriate compensation.",
  },
  {
    system: "You are a technical writer. Explain complex concepts in simple, accessible language.",
    user: "Explain how machine learning algorithms work to someone with no technical background.",
  },
]

export function PromptForm({ onAddPrompt }: PromptFormProps) {
  const [systemPrompt, setSystemPrompt] = useState("")
  const [userPrompt, setUserPrompt] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userPrompt.trim()) {
      onAddPrompt(systemPrompt.trim(), userPrompt.trim())
      setSystemPrompt("")
      setUserPrompt("")
    }
  }

  const handleTryExample = () => {
    const randomExample = examplePrompts[Math.floor(Math.random() * examplePrompts.length)]
    setSystemPrompt(randomExample.system)
    setUserPrompt(randomExample.user)
  }

  return (
    <div className="mb-8">
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Create a New Prompt</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTryExample}
            className="border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300"
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Try Example
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="system-prompt" className="text-purple-400">
              System Prompt (Optional)
            </Label>
            <Textarea
              id="system-prompt"
              placeholder="Define the AI's role and behavior (e.g., 'You are a helpful assistant...')"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="min-h-[100px] resize-none border-gray-700 bg-gray-800/50 text-gray-100 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500">System prompts help define the AI's personality and response style</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-prompt" className="text-green-400">
              User Prompt *
            </Label>
            <Textarea
              id="user-prompt"
              placeholder="Enter your main prompt or question here..."
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="min-h-[120px] resize-none border-gray-700 bg-gray-800/50 text-gray-100 placeholder-gray-500 focus:border-green-500 focus:ring-green-500"
              required
            />
            <p className="text-xs text-gray-500">This is the main instruction or question for the AI</p>
          </div>

          <Button
            type="submit"
            disabled={!userPrompt.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-lg font-semibold text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Prompt
          </Button>
        </form>
      </div>
    </div>
  )
}
