"use client"

import { Card } from "@/components/ui/card"
import { Star, Quote, Users, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "AI Engineer at Stripe",
    content:
      "LLM Comparator saved us 3 weeks of research. We found the perfect model for our customer support bot in minutes.",
    rating: 5,
    avatar: "SC",
    company: "Stripe",
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO at TechFlow",
    content:
      "The cost savings alone paid for itself. We avoided a $80K mistake by choosing the right model from day one.",
    rating: 5,
    avatar: "MR",
    company: "TechFlow",
  },
  {
    name: "Emily Watson",
    role: "Product Manager at DataCorp",
    content: "Finally, a tool that gives real answers instead of marketing fluff. Game-changer for our AI strategy.",
    rating: 5,
    avatar: "EW",
    company: "DataCorp",
  },
]

const companies = ["Stripe", "Vercel", "OpenAI", "Anthropic", "Mistral", "Cohere"]

export function SocialProof() {
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

    const section = document.getElementById("social-proof-section")
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="social-proof-section" className="py-32 px-6 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-600/8 to-violet-600/8 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-violet-600/8 to-blue-600/8 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 backdrop-blur-xl mb-8 transition-all duration-1000 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Users className="w-5 h-5 text-blue-400 animate-pulse" />
            <span className="text-blue-200 font-medium">Trusted Worldwide</span>
            <TrendingUp className="w-5 h-5 text-violet-400 animate-bounce" />
          </div>

          <h2
            className={`text-5xl md:text-7xl font-black mb-8 text-white transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="block animate-slide-up">Trusted by</span>
            <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent animate-slide-up animation-delay-300">
              50K+ Developers
            </span>
          </h2>

          <p
            className={`text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Join the developers and companies who've already transformed their AI decision-making process.
          </p>
        </div>

        {/* Animated Company Logos */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-20">
          {companies.map((company, index) => (
            <div
              key={company}
              className={`text-gray-400 font-semibold text-lg hover:text-blue-400 transition-all duration-300 hover:scale-110 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {company}
            </div>
          ))}
        </div>

        {/* Enhanced Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.name}
              className={`group p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-blue-500/20 backdrop-blur-xl hover:border-blue-400/40 transition-all duration-500 hover:scale-105 rounded-2xl overflow-hidden relative ${isVisible ? "animate-slide-up" : "opacity-0 translate-y-8"}`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Animated Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-blue-400 mb-4 group-hover:animate-pulse" />

                <p className="text-gray-300 mb-6 leading-relaxed group-hover:text-white transition-colors">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-sm">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Animated Stats - Updated */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-md mx-auto">
          {[
            { value: "300+", label: "Models Tested", color: "from-blue-500 to-violet-500" },
            { value: "99.9%", label: "Satisfaction Rate", color: "from-cyan-400 to-blue-400" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center group ${isVisible ? "animate-scale-in" : "opacity-0 scale-95"}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div
                className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:animate-bounce`}
              >
                {stat.value}
              </div>
              <div className="text-gray-400 group-hover:text-gray-300 transition-colors">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
