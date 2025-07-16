import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WorkflowProvider } from "@/contexts/workflow-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WhichLLMs - Compare every LLM. Find the best for your use case.",
  description:
    "Free tool that compares 200+ AI models (GPT-4, Claude, Mistral, LLaMA, Gemini) on your real use cases. Automatic scoring and smart recommendation.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Script Umami Analytics */}
        <script defer src="https://cloud.umami.is/script.js" data-website-id="13b0cce7-2ec9-49f6-91d4-eafd5bf65588"></script>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <WorkflowProvider>{children}</WorkflowProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}