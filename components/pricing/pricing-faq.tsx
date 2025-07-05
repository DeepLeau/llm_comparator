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
    question: "What counts as a 'test' in my monthly limit?",
    answer:
      "A test is one prompt sent to one model. For example, if you send the same prompt to 5 different models (GPT-4, Claude, Mistral, etc.), that counts as 5 tests. Batch testing multiple prompts to multiple models will use tests accordingly.",
  },
  {
    question: "Which models are included in each plan?",
    answer:
      "Free plan includes open-source models like LLaMA, Mistral Open Source, and other free models. Pro and Business plans include premium models like GPT-4, Claude 3, Gemini Pro, and all open-source models. We continuously add new models as they become available.",
  },
  {
    question: "How does credit rollover work?",
    answer:
      "On Pro and Business plans, unused tests from your monthly limit can roll over to the next month, up to your plan's limit. For example, if you use 300 tests in a month on the Pro plan, the remaining 200 can be added to next month's 500, giving you 700 tests available.",
  },
  {
    question: "Can I upgrade or downgrade my plan anytime?",
    answer:
      "Yes! You can change your plan at any time. When upgrading, you get immediate access to new features and your billing is prorated. When downgrading, changes take effect at your next billing cycle, and you keep access to premium features until then.",
  },
  {
    question: "Do you offer custom enterprise solutions?",
    answer:
      "Absolutely! For large teams or specific requirements, we offer custom enterprise plans with dedicated infrastructure, custom model integrations, advanced security features, and dedicated support. Contact our sales team to discuss your needs.",
  },
  {
    question: "How accurate is the smart scoring system?",
    answer:
      "Our smart scoring analyzes multiple factors including response quality, relevance, coherence, and task completion. While subjective elements exist in AI evaluation, our scoring system is calibrated against human evaluations and continuously improved based on user feedback and industry benchmarks.",
  },
]

export function PricingFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-400 text-lg">Everything you need to know about our LLM benchmarking platform</p>
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
                className="w-full p-6 text-left flex items-center justify-between focus:outline-none"
              >
                <h3 className="text-lg font-semibold text-white pr-4">{item.question}</h3>
                <div className="flex-shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6">
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Contact CTA */}
      <div className="text-center mt-12">
        <p className="text-gray-400 mb-4">Still have questions about our LLM benchmarking platform?</p>
        <button
          onClick={() => (window.location.href = "/contact")}
          className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
        >
          Contact our team →
        </button>
      </div>
    </div>
  )
}