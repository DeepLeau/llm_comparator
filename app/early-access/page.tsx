import { Header } from "@/components/header"
import { Hero } from "@/components/early-access/hero"
import { Benefits } from "@/components/early-access/benefits"
import { BetaDetails } from "@/components/early-access/beta-details"
import { AccessForm } from "@/components/early-access/access-form"
import { FAQ } from "@/components/early-access/faq"
import { Footer } from "@/components/footer"

export default function EarlyAccessPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-violet-900/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-rose-500/5 via-transparent to-emerald-500/5 rounded-full blur-3xl animate-spin-slow" />
      </div>

      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        />
      </div>

      <Header />

      <main className="relative z-10 pt-24">
        <Hero />
        <Benefits />
        <BetaDetails />
        <AccessForm />
        <FAQ />
      </main>

      <Footer />
    </div>
  )
}
