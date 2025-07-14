"use client"

import { Card } from "@/components/ui/card"
import { Users, Headphones, ShoppingCart, FileText, Mail, Briefcase } from "lucide-react"

const useCases = [
  {
    icon: Headphones,
    title: "Customer Support",
    description: "Automated replies, ticket classification, and issue resolution",
    example: "Responding to a customer complaint with empathy and professionalism",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Users,
    title: "Human Resources",
    description: "CV screening, job description writing, and interview preparation",
    example: "Write an attractive job posting for a senior developer position",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: FileText,
    title: "Content Summarization",
    description: "Summarize articles, reports, and long documents into key points",
    example: "Summarize a 50-page financial report into 5 essential bullet points",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Product descriptions, review analysis, and personalized recommendations",
    example: "Write a compelling product description for an online store",
    color: "from-orange-500 to-red-600",
  },
  {
    icon: Mail,
    title: "Sales Generation",
    description: "Cold emails, business proposals, and sales pitches",
    example: "Write a high-converting B2B cold email with a strong open rate",
    color: "from-indigo-500 to-purple-600",
  },
]

export function UseCases() {
  return (
    <section className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 backdrop-blur-xl mb-6">
            <Briefcase className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-200 font-medium">Use Cases</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
            Real-World
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Applications
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
            Find out which AI model performs best in your specific industry
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {useCases.slice(0, 3).map((useCase, index) => (
            <Card
              key={index}
              className="group p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-purple-500/20 backdrop-blur-xl hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-indigo-500/10 transition-all duration-500 hover:scale-105 hover:border-purple-400/30 rounded-2xl"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${useCase.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <useCase.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                {useCase.title}
              </h3>
              <p className="text-slate-400 mb-6 leading-relaxed group-hover:text-slate-300 transition-colors">
                {useCase.description}
              </p>
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl p-4 border-l-4 border-purple-500">
                <p className="text-sm text-slate-300 italic">Example: {useCase.example}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {useCases.slice(3).map((useCase, index) => (
            <Card
              key={index + 3}
              className="group p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-purple-500/20 backdrop-blur-xl hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-indigo-500/10 transition-all duration-500 hover:scale-105 hover:border-purple-400/30 rounded-2xl"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${useCase.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <useCase.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                {useCase.title}
              </h3>
              <p className="text-slate-400 mb-6 leading-relaxed group-hover:text-slate-300 transition-colors">
                {useCase.description}
              </p>
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl p-4 border-l-4 border-purple-500">
                <p className="text-sm text-slate-300 italic">Example: {useCase.example}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
