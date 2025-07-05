"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TopNavigation } from "@/components/dashboard/top-navigation"
import { SubscriptionPlanSection } from "@/components/settings/subscription-plan-section"
import { EmailSettingsSection } from "@/components/settings/email-settings-section"
import { BillingInformationSection } from "@/components/settings/billing-information-section"
import { PasswordManagementSection } from "@/components/settings/password-management-section"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push("/login")
        return
      }

      setUser(user)

      // Fetch user profile from users table
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("name, plan, credits")
        .eq("id", user.id)
        .single()

      if (profileError) {
        console.error("Error fetching user profile:", profileError)
      } else {
        setUserProfile(profile)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-2 text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <TopNavigation />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-gray-400">Manage your account preferences and subscription</p>
        </div>

        <div className="space-y-6">
          <SubscriptionPlanSection userProfile={userProfile} />
          <EmailSettingsSection user={user} />
          <BillingInformationSection userProfile={userProfile} />
          <PasswordManagementSection />
        </div>
      </div>
    </div>
  )
}