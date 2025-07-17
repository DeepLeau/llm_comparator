import { Header } from "@/components/header"
import { LegalContent } from "@/components/legal/legal-content"

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-violet-900/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
      </div>

      <Header />

      <main className="relative z-10 pt-24">
        <LegalContent />
      </main>
    </div>
  )
}
