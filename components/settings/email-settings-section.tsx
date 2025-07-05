"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Check, Loader2, AlertCircle, Info } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface EmailSettingsSectionProps {
  user: {
    email: string
    id: string
  }
}

export function EmailSettingsSection({ user }: EmailSettingsSectionProps) {
  const [newEmail, setNewEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null)
  const [step, setStep] = useState<"input" | "verification">("input")

  const currentEmail = user.email
  const hasChanges = newEmail !== "" && newEmail !== currentEmail
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)

  const handleEmailChange = async () => {
    if (!hasChanges || !isValidEmail) return

    setIsLoading(true)
    setMessage(null)

    try {
      // Update email in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      })

      if (error) {
        setMessage({
          type: "error",
          text: error.message,
        })
      } else {
        setStep("verification")
        setMessage({
          type: "info",
          text: `Verification emails have been sent to both ${currentEmail} and ${newEmail}. Please check both inboxes and click the confirmation links.`,
        })
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

  const handleResendVerification = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: "email_change",
        email: newEmail,
      })

      if (error) {
        setMessage({
          type: "error",
          text: error.message,
        })
      } else {
        setMessage({
          type: "success",
          text: "Verification emails resent successfully!",
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to resend verification emails.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setNewEmail("")
    setStep("input")
    setMessage(null)
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Settings
        </CardTitle>
        <p className="text-gray-400">Update your email address for notifications and account access</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Email */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Current Email</Label>
          <div className="p-3 bg-gray-800 border border-gray-700 rounded-md">
            <span className="text-white">{currentEmail}</span>
          </div>
        </div>

        {step === "input" ? (
          <>
            {/* New Email Input */}
            <div className="space-y-2">
              <Label htmlFor="new-email" className="text-sm font-medium text-gray-300">
                New Email Address
              </Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                placeholder="Enter your new email address"
              />
              {newEmail && !isValidEmail && <p className="text-sm text-red-400">Please enter a valid email address</p>}
            </div>

            <Button
              onClick={handleEmailChange}
              disabled={!hasChanges || !isValidEmail || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Email...
                </>
              ) : (
                "Update Email"
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Verification Step */}
            <div className="space-y-3">
              <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-blue-300">Email Verification Required</h4>
                    <p className="text-sm text-blue-200">
                      We've sent verification emails to both your current email ({currentEmail}) and your new email (
                      {newEmail}).
                    </p>
                    <p className="text-sm text-blue-200">
                      Please check both inboxes and click the confirmation links to complete the email change.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleResendVerification}
                  disabled={isLoading}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    "Resend Verification"
                  )}
                </Button>
                <Button
                  onClick={resetForm}
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Message Display */}
        {message && (
          <Alert
            className={`border ${
              message.type === "error"
                ? "border-red-600/20 bg-red-600/10"
                : message.type === "success"
                  ? "border-green-600/20 bg-green-600/10"
                  : "border-blue-600/20 bg-blue-600/10"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle className="h-4 w-4 text-red-400" />
            ) : message.type === "success" ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Info className="h-4 w-4 text-blue-400" />
            )}
            <AlertDescription
              className={
                message.type === "error"
                  ? "text-red-300"
                  : message.type === "success"
                    ? "text-green-300"
                    : "text-blue-300"
              }
            >
              {message.text}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}