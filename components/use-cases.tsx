"use client"

import { Card } from "@/components/ui/card"
import { Users, Headphones, ShoppingCart, FileText, Mail } from "lucide-react"

const useCases = [
  {
    icon: Headphones,
    title: "Customer Support",
    description: "Automated replies, ticket classification, and issue resolution",
    example: "Responding to a customer complaint with empathy and professionalism",
  },
  {
    icon: Users,
    title: "Human Resources",
    description: "CV screening, job description writing, and interview preparation",
    example: "Write an attractive job posting for a senior developer position",
  },
  {
    icon: FileText,
    title: "Content Summarization",
    description: "Summarize articles, reports, and long documents into key points",
    example: "Summarize a 50-page financial report into 5 essential bullet points",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Product descriptions, review analysis, and personalized recommendations",
    example: "Write a compelling product description for an online store",
  },
  {
    icon: Mail,
    title: "Sales Generation",
    description: "Cold emails, business proposals, and sales pitches",
    example: "Write a high-converting B2B cold email with a strong open rate",
  },
]

export function UseCases() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Real-World Use Cases
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Find out which AI model performs best in your specific industry
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.slice(0, 3).map((useCase, index) => (
            <Card
              key={index}
              className="p-8 bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <useCase.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{useCase.title}</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">{useCase.description}</p>
              <div className="bg-white/5 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-sm text-gray-300 italic">Example : {useCase.example}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {useCases.slice(3).map((useCase, index) => (
            <Card
              key={index + 3}
              className="p-8 bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <useCase.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{useCase.title}</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">{useCase.description}</p>
              <div className="bg-white/5 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-sm text-gray-300 italic">Example : {useCase.example}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
