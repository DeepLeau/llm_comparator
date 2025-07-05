"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, CreditCard, LogOut, Key } from "lucide-react"

export function ProfileSettingsSection() {
  const handleLogout = () => {
    // Handle logout logic
    console.log("Logging out...")
    // Redirect to login page or clear session
  }

  const handleChangePassword = () => {
    // Navigate to change password page
    window.location.href = "/change-password"
  }

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "free":
        return "secondary"
      case "pro":
        return "default"
      case "business":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "free":
        return "bg-gray-100 text-gray-800"
      case "pro":
        return "bg-blue-100 text-blue-800"
      case "business":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Mock user data
  const userData = {
    email: "john.doe@example.com",
    plan: "Pro",
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Settings
        </CardTitle>
        <p className="text-sm text-gray-600">Manage your account and preferences</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Email */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Mail className="w-4 h-4" />
            Email Address
          </div>
          <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">{userData.email}</p>
        </div>

        {/* Current Plan */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <CreditCard className="w-4 h-4" />
            Current Plan
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPlanColor(userData.plan)}>{userData.plan}</Badge>
            {userData.plan.toLowerCase() === "free" && (
              <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
                Upgrade Plan
              </Button>
            )}
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start border-gray-200 hover:bg-gray-50 bg-transparent"
            onClick={handleChangePassword}
          >
            <Key className="w-4 h-4 mr-2" />
            Change Password
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
