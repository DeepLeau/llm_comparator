"use client"

import { Hero } from "@/components/hero"
import { ProblemSection } from "@/components/problem-section"
import { SolutionShowcase } from "@/components/solution-showcase"
import { InteractiveDemo } from "@/components/interactive-demo"
import { SocialProof } from "@/components/social-proof"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-950/20 to-violet-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10">
        <Hero />
        <ProblemSection />
        <SolutionShowcase />
        <InteractiveDemo />
        <SocialProof />
        <FAQ />
        <Footer />
      </div>
    </main>
  )
}
