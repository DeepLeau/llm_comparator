"use client"
import { PromptInputPage } from "@/components/prompt-input/prompt-input-page"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function PromptInput() {
  return (
    <AuthGuard>
      <PromptInputPage />
    </AuthGuard>
  )
}
