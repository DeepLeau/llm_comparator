import { AuthGuard } from "@/components/auth/auth-guard"
import { SummaryPage } from "@/components/summary/summary-page"

export default function Summary() {
  return (
    <AuthGuard>
      <SummaryPage />
    </AuthGuard>
  )
}
