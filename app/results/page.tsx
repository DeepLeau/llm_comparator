import { AuthGuard } from "@/components/auth/auth-guard"
import { ResultsPage } from "@/components/results/results-page"

export default function Results() {
  return (
    <AuthGuard>
      <ResultsPage />
    </AuthGuard>
  )
}
