"use client"

import { Card } from "@/components/ui/card"
import { Brain, Cpu, Zap, Globe, Code, MessageSquare } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const models = [
  { name: "GPT-4", icon: Brain, color: "from-green-500 to-emerald-600" },
  { name: "Claude", icon: MessageSquare, color: "from-orange-500 to-red-600" },
  { name: "Mistral", icon: Zap, color: "from-blue-500 to-indigo-600" },
  { name: "LLaMA", icon: Cpu, color: "from-purple-500 to-pink-600" },
  { name: "Gemini", icon: Globe, color: "from-yellow-500 to-orange-600" },
  { name: "CodeLlama", icon: Code, color: "from-cyan-500 to-blue-600" },
]

export function Models() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-gradient-to-b from-black to-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Supported Models
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Compare the latest and most powerful language models from leading AI providers
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {models.map((model, index) => (
            <Card
              key={model.name}
              className={`p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 hover:scale-110 hover:shadow-2xl group ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${model.color} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
              >
                <model.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-center font-semibold text-white group-hover:text-purple-300 transition-colors">
                {model.name}
              </h3>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400">
            <span className="text-purple-400 font-semibold">300+ models</span> supported and growing
          </p>
        </div>
      </div>
    </section>
  )
}
