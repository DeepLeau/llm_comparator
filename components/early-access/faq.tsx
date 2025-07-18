"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, HelpCircle, Clock, Users, Zap } from "lucide-react"

export function FAQ() {
  const [isVisible, setIsVisible] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const faqs = [
    {
      icon: <Clock className="w-5 h-5" />,
      question: "How long does the beta period last?",
      answer:
        "The private beta runs for 1 month, giving you exclusive early access to all features.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Users className="w-5 h-5" />,
      question: "How many users will be accepted?",
      answer:
        "We're limiting the beta to 50 carefully selected users to ensure personalized attention and high-quality feedback. Applications are reviewed within 24-48 hours.",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      question: "How many models can be tested simultaneously?",
      answer:
        "Beta testers can compare up to 10 models at once, with the ability to run multiple tests in parallel for comprehensive analysis.",
      color: "from-violet-500 to-purple-500",
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <Badge className="bg-[#33140f] text-orange-300 border-orange-500/30 px-6 py-3 text-lg font-bold mb-8 hover:scale-110 hover:bg-[#33140f] transition-transform duration-300">
            <HelpCircle className="w-5 h-5 mr-2" />
            Frequently Asked Questions
          </Badge>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Got{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              questions?
            </span>
          </h2>

          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about the private beta program
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className={`bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-8 text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-r ${faq.color} p-2.5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="text-white">{faq.icon}</div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-gray-200 transition-colors duration-300">
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-gray-400 group-hover:text-white transition-all duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-8 pb-8">
                  <div className={`h-px bg-gradient-to-r ${faq.color} mb-6 opacity-30`} />
                  <p className="text-gray-300 text-lg leading-relaxed pl-14">{faq.answer}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <Card
          className={`mt-12 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border-white/20 p-8 text-center transform transition-all duration-1000 delay-600 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
          <p className="text-gray-300 mb-6">Reach out to our team and we'll get back to you within 24 hours.</p>
          <a
            href="mailto:support@whichllms.com"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
          >
            <HelpCircle className="w-5 h-5" />
            Contact Support
          </a>
        </Card>
      </div>
    </section>
  )
}
