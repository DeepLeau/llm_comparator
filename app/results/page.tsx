"use client"
import { ResultsPage as ResultsComponent } from "@/components/results/results-page"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function ResultsPage() {
  return (
    <AuthGuard>
      <ResultsComponent />
    </AuthGuard>
  )
}
