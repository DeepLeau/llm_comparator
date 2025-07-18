"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Sparkles, Lock, Crown } from "lucide-react"

export function AccessForm() {
  const [isVisible, setIsVisible] = useState(false)
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

  return (
    <section id="access-form" ref={sectionRef} className="py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Card className="relative bg-white/5 backdrop-blur-sm border-white/10 p-8 sm:p-16 overflow-hidden group hover:bg-white/10 transition-all duration-700">
          {/* Animated Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          {/* Floating Sparkles */}
          <div className="absolute top-8 left-8 opacity-30 animate-float">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <div className="absolute top-12 right-12 opacity-20 animate-float-delayed">
            <Crown className="w-8 h-8 text-violet-400" />
          </div>
          <div className="absolute bottom-8 left-12 opacity-25 animate-float-slow">
            <Lock className="w-5 h-5 text-emerald-400" />
          </div>

          <div
            className={`text-center mb-12 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <Badge className="bg-[#114231] text-green-200 border-green-400/50 px-6 py-3 text-lg font-bold mb-8 hover:scale-110 hover:bg-[#114231] transition-transform duration-300 shadow-lg shadow-green-500/25">
              <Send className="w-5 h-5 mr-2 animate-pulse" />
              Exclusive Application
            </Badge>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 hover:scale-105 transition-transform duration-300">
              Request{" "}
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                VIP Access
              </span>
            </h2>

            <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Tell us about your AI ambitions and we'll fast-track your application within{" "}
              <span className="text-white font-bold">24 hours</span>.
            </p>
          </div>

          {/* Tally Form Embed with Dynamic Background */}
          <div
            className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="relative rounded-3xl p-8 border-2 border-white/20 hover:border-white/30 transition-colors duration-500 group/form overflow-hidden">
              {/* Dynamic Background for Form Visibility */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-gray-50/98 to-white/95 rounded-3xl" />

              {/* Subtle Animated Border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-violet-600 to-emerald-600 rounded-3xl blur opacity-30 group-hover/form:opacity-50 transition-opacity duration-500" />

              {/* Form Container */}
              <div className="relative z-10 bg-white/98 rounded-2xl p-4 shadow-2xl">
                <iframe
                  src="https://tally.so/embed/mOx8WY?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  title="Beta Access Application"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div
            className={`mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 transform transition-all duration-1000 delay-600 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            {[
              { icon: <Lock className="w-5 h-5" />, text: "Secure & Private", subtext: "Your data is encrypted" },
              { icon: <Crown className="w-5 h-5" />, text: "VIP Treatment", subtext: "Priority processing" },
              { icon: <Sparkles className="w-5 h-5" />, text: "Exclusive Access", subtext: "Limited to 50 spots" },
            ].map((item, index) => (
              <div key={index} className="text-center group/trust hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r from-white/10 to-white/5 flex items-center justify-center border border-white/20 group-hover/trust:border-white/40 transition-colors duration-300">
                  <div className="text-gray-300 group-hover/trust:text-white transition-colors duration-300">
                    {item.icon}
                  </div>
                </div>
                <p className="text-white font-semibold group-hover/trust:text-blue-300 transition-colors duration-300">
                  {item.text}
                </p>
                <p className="text-gray-400 text-sm group-hover/trust:text-gray-300 transition-colors duration-300">
                  {item.subtext}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
