"use client"
import { ModelSelectionPage } from "@/components/model-selection/model-selection-page"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function ModelSelection() {
  return (
    <AuthGuard>
      <ModelSelectionPage />
    </AuthGuard>
  )
}
