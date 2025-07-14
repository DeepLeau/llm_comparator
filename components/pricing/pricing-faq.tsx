"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react"

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
    answer: "Only basic models. Premium models like GPT-4 or Claude are unlocked in the Start plan and beyond.",
  },
  {
    question: "What happens when I reach my scoring limit?",
    answer: "You'll get a warning. You can upgrade or buy extra scoring credits if available.",
  },
]

export function PricingFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const section = document.getElementById("pricing-faq")
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div id="pricing-faq" className="max-w-4xl mx-auto relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-blue-600/8 to-violet-600/8 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-gradient-to-r from-violet-600/8 to-blue-600/8 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 backdrop-blur-xl mb-8 transition-all duration-1000 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <HelpCircle className="w-5 h-5 text-blue-400 animate-pulse" />
            <span className="text-blue-200 font-medium">FAQ</span>
            <Sparkles className="w-5 h-5 text-violet-400 animate-bounce" />
          </div>

          <h2
            className={`text-4xl md:text-5xl font-black mb-6 text-white transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="block animate-slide-up">Frequently Asked</span>
            <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent animate-slide-up animation-delay-300">
              Questions
            </span>
          </h2>

          <p
            className={`text-gray-400 text-lg transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Everything you need to know about our pricing and features
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openItems.includes(index)

            return (
              <Card
                key={index}
                className={`group bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-blue-500/20 backdrop-blur-xl hover:border-blue-400/40 transition-all duration-500 hover:scale-[1.02] rounded-2xl overflow-hidden ${isVisible ? "animate-slide-up" : "opacity-0 translate-y-8"}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Animated Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <button
                  onClick={() => toggleItem(index)}
                  className="relative z-10 w-full p-6 text-left flex items-center justify-between group-hover:bg-blue-500/5 transition-colors duration-300"
                >
                  <h3 className="text-lg font-semibold text-white pr-4 group-hover:text-blue-300 transition-colors">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-400 flex-shrink-0 transition-all duration-300 group-hover:text-violet-400 ${
                      isOpen ? "rotate-180 animate-bounce" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="relative z-10 px-6 pb-6 animate-slide-up">
                    <div className="text-gray-300 leading-relaxed whitespace-pre-line group-hover:text-white transition-colors duration-300">
                      {item.answer}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
