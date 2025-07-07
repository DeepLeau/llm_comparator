import { AuthGuard } from "@/components/auth/auth-guard"
import { ModelSelectionPage } from "@/components/model-selection/model-selection-page"

export default function ModelSelection() {
  return (
    <AuthGuard>
      <ModelSelectionPage />
    </AuthGuard>
  )
}
