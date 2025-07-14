"use client"

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react"

const faqs = [
  {
    question: "How does LLM Comparator work?",
    answer:
      "Choose a use case template, select the AI models, and enter your prompts. Our platform runs the tests and delivers results with smart recommendations based on quality, speed, and cost and with filters for open-source models, data storage, pricing, and more.",
  },
  {
    question: "Which AI models do you support?",
    answer:
      "We support 300+ models including GPT-4, Claude 3, Gemini, Mistral, LLaMA, PaLM, Cohere, and many more. We're constantly adding new models as they become available.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! Our free trial includes 10 comparisons for 7 days with access to 50+ models. Perfect for trying out the platform and small projects.",
  },
  {
    question: "Can I integrate this with my existing workflow?",
    answer:
      "We offer API access, CSV exports, and integrations with popular development tools. Enterprise plans include custom integrations.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "Free users get standard support, Pro users get priority email support, and Enterprise customers get dedicated support with SLA guarantees.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
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

    const section = document.getElementById("faq-section")
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="faq-section" className="py-32 px-6 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-blue-600/8 to-violet-600/8 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-gradient-to-r from-violet-600/8 to-blue-600/8 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 backdrop-blur-xl mb-8 transition-all duration-1000 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <HelpCircle className="w-5 h-5 text-blue-400 animate-pulse" />
            <span className="text-blue-200 font-medium">FAQ</span>
            <Sparkles className="w-5 h-5 text-violet-400 animate-bounce" />
          </div>

          <h2
            className={`text-5xl md:text-7xl font-black mb-8 text-white transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="block animate-slide-up">Got</span>
            <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent animate-slide-up animation-delay-300">
              Questions?
            </span>
          </h2>

          <p
            className={`text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Everything you need to know about LLM Comparator.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className={`group bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-blue-500/20 backdrop-blur-xl rounded-2xl overflow-hidden hover:border-blue-400/40 transition-all duration-500 ${isVisible ? "animate-slide-up" : "opacity-0 translate-y-8"}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                className="w-full p-6 text-left flex items-center justify-between hover:bg-blue-500/5 transition-colors group"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-white pr-4 group-hover:text-blue-300 transition-colors">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-blue-400 transition-all duration-300 group-hover:text-violet-400 ${
                    openIndex === index ? "rotate-180 animate-bounce" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 animate-slide-up">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
