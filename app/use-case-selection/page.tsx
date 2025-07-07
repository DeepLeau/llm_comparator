"use client"
import { UseCaseSelector } from "@/components/use-case-selection/use-case-selector"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function UseCaseSelectionPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-950">
        <UseCaseSelector />
      </div>
    </AuthGuard>
  )
}
