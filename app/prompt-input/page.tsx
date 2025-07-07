import { AuthGuard } from "@/components/auth/auth-guard"
import { PromptInputPage } from "@/components/prompt-input/prompt-input-page"

export default function PromptInput() {
  return (
    <AuthGuard>
      <PromptInputPage />
    </AuthGuard>
  )
}
