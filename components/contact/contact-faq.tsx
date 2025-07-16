"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, HelpCircle } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "How quickly can I get started with WhichLLMs?",
    answer:
      "You can start comparing models immediately with our free tier. Simply sign up, select your models, and begin testing. No setup required!",
  },
  {
    question: "Do you offer enterprise pricing?",
    answer:
      "Yes! We offer custom enterprise plans with dedicated support, higher usage limits, and advanced features. Contact us for a personalized quote.",
  },
  {
    question: "Which AI models do you support?",
    answer:
      "We support 200+ models including GPT-4, Claude, Gemini, Llama, and many more. Our catalog is constantly expanding with the latest models.",
  },
  {
    question: "Can I integrate WhichLLMs with my existing workflow?",
    answer:
      "We offer REST APIs, webhooks, and integrations with popular tools. Our documentation provides detailed integration guides.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we take security seriously. All data is encrypted in transit and at rest. We're SOC 2 compliant and never use your data to train models.",
  },
  {
    question: "Do you offer technical support?",
    answer:
      "Yes! Free users get community support, while paid users receive priority email support. Enterprise customers get dedicated support channels.",
  },
]

export function ContactFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-500" />
          Frequently Asked Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Collapsible key={index} open={openItems.includes(index)}>
              <CollapsibleTrigger
                onClick={() => toggleItem(index)}
                className="flex items-center justify-between w-full p-4 text-left bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <span className="text-white font-medium">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    openItems.includes(index) ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
