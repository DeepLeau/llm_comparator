"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Eye, EyeOff, Check, Loader2, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function PasswordManagementSection() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0
  const isValidPassword = newPassword.length >= 8
  const hasUpperCase = /[A-Z]/.test(newPassword)
  const hasLowerCase = /[a-z]/.test(newPassword)
  const hasNumbers = /\d/.test(newPassword)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)

  const isStrongPassword = isValidPassword && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
  const canUpdate = passwordsMatch && isStrongPassword && currentPassword.length > 0

  const getPasswordStrength = () => {
    if (newPassword.length === 0) return { strength: 0, label: "" }

    let strength = 0
    if (newPassword.length >= 8) strength += 20
    if (hasUpperCase) strength += 20
    if (hasLowerCase) strength += 20
    if (hasNumbers) strength += 20
    if (hasSpecialChar) strength += 20

    if (strength < 40) return { strength, label: "Weak", color: "bg-red-500" }
    if (strength < 80) return { strength, label: "Medium", color: "bg-yellow-500" }
    return { strength, label: "Strong", color: "bg-green-500" }
  }

  const passwordStrength = getPasswordStrength()

  const handleUpdatePassword = async () => {
    if (!canUpdate) return

    setIsLoading(true)
    setMessage(null)

    try {
      // First verify current password by attempting to sign in
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user?.email) {
        setMessage({
          type: "error",
          text: "Unable to verify current user. Please try again.",
        })
        return
      }

      // Attempt to sign in with current password to verify it
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })

      if (signInError) {
        setMessage({
          type: "error",
          text: "Current password is incorrect.",
        })
        return
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        setMessage({
          type: "error",
          text: updateError.message,
        })
      } else {
        setMessage({
          type: "success",
          text: "Password updated successfully!",
        })

        // Clear form
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Password Management
        </CardTitle>
        <p className="text-gray-400">Update your password to keep your account secure</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Password */}
        <div className="space-y-2">
          <Label htmlFor="current-password" className="text-sm font-medium text-gray-300">
            Current Password
          </Label>
          <div className="relative">
            <Input
              id="current-password"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 pr-10"
              placeholder="Enter current password"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-sm font-medium text-gray-300">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 pr-10"
                placeholder="Enter new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Password Strength</span>
                  <span
                    className={`font-medium ${
                      passwordStrength.strength < 40
                        ? "text-red-400"
                        : passwordStrength.strength < 80
                          ? "text-yellow-400"
                          : "text-green-400"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-300">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 pr-10"
                placeholder="Confirm new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-red-400">Passwords do not match</p>
            )}
          </div>
        </div>

        {/* Password Requirements */}
        {newPassword && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-300">Password Requirements</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className={`flex items-center gap-2 ${isValidPassword ? "text-green-400" : "text-gray-400"}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isValidPassword ? "bg-green-400" : "bg-gray-400"}`} />
                At least 8 characters
              </div>
              <div className={`flex items-center gap-2 ${hasUpperCase ? "text-green-400" : "text-gray-400"}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${hasUpperCase ? "bg-green-400" : "bg-gray-400"}`} />
                Uppercase letter
              </div>
              <div className={`flex items-center gap-2 ${hasLowerCase ? "text-green-400" : "text-gray-400"}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${hasLowerCase ? "bg-green-400" : "bg-gray-400"}`} />
                Lowercase letter
              </div>
              <div className={`flex items-center gap-2 ${hasNumbers ? "text-green-400" : "text-gray-400"}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${hasNumbers ? "bg-green-400" : "bg-gray-400"}`} />
                Number
              </div>
              <div className={`flex items-center gap-2 ${hasSpecialChar ? "text-green-400" : "text-gray-400"}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${hasSpecialChar ? "bg-green-400" : "bg-gray-400"}`} />
                Special character
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleUpdatePassword}
          disabled={!canUpdate || isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating Password...
            </>
          ) : (
            "Update Password"
          )}
        </Button>

        {/* Message Display */}
        {message && (
          <Alert
            className={`border ${
              message.type === "error" ? "border-red-600/20 bg-red-600/10" : "border-green-600/20 bg-green-600/10"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle className="h-4 w-4 text-red-400" />
            ) : (
              <Check className="h-4 w-4 text-green-400" />
            )}
            <AlertDescription className={message.type === "error" ? "text-red-300" : "text-green-300"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
