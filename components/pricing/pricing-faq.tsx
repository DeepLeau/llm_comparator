"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: 'What is a "scoring"?',
    answer: "A scoring = 1 prompt evaluated on 1 model. Example: 5 prompts × 5 models = 25 scorings.",
  },
  {
    question: 'What does "Manual trigger" mean?',
    answer: "You launch the evaluation manually from your dashboard when you want to test your prompts.",
  },
  {
    question: 'What is "Automated testing" in the Enterprise plan?',
    answer:
      "Your tests are automatically run at defined intervals (hourly, daily...) to keep model performance up to date.",
  },
  {
    question: 'What are "AI automations"?',
    answer:
      "Advanced automations that react based on your results: – Intelligent LLM routing for production – Alert if a model gets worse or more expensive – Automatic model switching based on latency or quality drops",
  },
  {
    question: "Which models are available in the Free Trial?",
    answer:
      "Only basic models. Premium models like GPT-4 or Claude are unlocked in the Start plan and beyond.",
  },
  {
    question: "What happens when I reach my scoring limit?",
    answer: "You'll get a warning. You can upgrade or buy extra scoring credits if available.",
  },
]

export function PricingFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-400">Everything you need to know about our pricing and features</p>
      </div>

      <div className="space-y-4">
        {faqItems.map((item, index) => {
          const isOpen = openItems.includes(index)

          return (
            <Card
              key={index}
              className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-6 text-left flex items-center justify-between"
              >
                <h3 className="text-lg font-semibold text-white pr-4">{item.question}</h3>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-6 pb-6">
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line">{item.answer}</div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
