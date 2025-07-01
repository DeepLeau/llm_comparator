import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LLM Comparator - Compare every LLM. Find the best for your use case.",
  description:
    "Outil gratuit pour comparer 15+ modèles IA (GPT-4, Claude, Mistral, LLaMA, Gemini) sur vos prompts métier. Scoring automatique et recommandations intelligentes.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
