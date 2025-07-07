import { AuthGuard } from "@/components/auth/auth-guard"
import { UseCaseSelector } from "@/components/use-case-selection/use-case-selector"

export default function UseCaseSelectionPage() {
  return (
    <AuthGuard>
      <UseCaseSelector />
    </AuthGuard>
  )
}
