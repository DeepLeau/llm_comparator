"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Settings, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export function TopNavigation() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
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
        return
      }

      setUserProfile(profile)
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case "start":
        return "bg-purple-600/20 text-purple-300 border-purple-600/30"
      case "scale":
        return "bg-green-600/20 text-green-300 border-green-600/30"
      default:
        return "bg-blue-600/20 text-blue-300 border-blue-600/30"
    }
  }

  return (
    <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="rounded" />
            </div>
            <span className="text-xl font-bold text-white">WhichLLMs</span>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-4">
            {userProfile && (
              <>
                {/* Start New Test Button */}
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => router.push("/use-case-selection")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Start new test
                </Button>

                {/* Credits */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Credits:</span>
                  <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-600/30">
                    {userProfile.credits?.toLocaleString() || 0}
                  </Badge>
                </div>

                {/* Plan */}
                <Badge variant="secondary" className={getPlanBadgeColor(userProfile.plan)}>
                  {userProfile.plan?.toUpperCase() || "FREE"}
                </Badge>
              </>
            )}

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/settings")}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <Settings className="w-4 h-4" />
            </Button>

            {/* Sign Out */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}