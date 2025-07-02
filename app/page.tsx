"use client"

import { useState } from "react"
import { Hero } from "@/components/hero"
import { TestZone } from "@/components/test-zone"
import { Features } from "@/components/features"
import { SupportedModels } from "@/components/supported-models"
import { UseCases } from "@/components/use-cases"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { ClaritySection } from "@/components/clarity-section"

export default function Home() {
  const [scrollToTest, setScrollToTest] = useState(false)

  const handleScrollToTest = () => {
    setScrollToTest(true)
    const testSection = document.getElementById("test-zone")
    testSection?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Hero onTryNow={handleScrollToTest} />
      <TestZone id="test-zone" />
      <ClaritySection />
      <Features />
      <SupportedModels />
      <UseCases />
      <FinalCTA onCompareNow={handleScrollToTest} />
      <Footer />
    </main>
  )
}
