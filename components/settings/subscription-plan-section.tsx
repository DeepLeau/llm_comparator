"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Crown, Zap, ArrowRight, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"

interface SubscriptionPlanSectionProps {
  userProfile: {
    plan: string
    credits: number
    name: string
  } | null
}

export function SubscriptionPlanSection({ userProfile }: SubscriptionPlanSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true)

      // Get the current session and access token
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData?.session?.access_token

      if (!accessToken) {
        throw new Error("No access token available")
      }

      // Use the dedicated manage-subscription endpoint for paid users
      const response = await fetch("/api/manage-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Redirect to Stripe customer portal
      window.location.href = data.url
    } catch (error) {
      console.error("Error opening subscription management:", error)
      alert("Unable to open subscription management. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = async (planType?: string) => {
    if (!planType) {
      // Show upgrade dialog for free users
      setShowUpgradeDialog(true)
      return
    }

    try {
      setIsLoading(true)

      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData?.session?.access_token

      if (!accessToken) {
        throw new Error("No access token available")
      }

      const response = await fetch("/api/create-upgrade-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ plan: planType }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Redirect to Stripe checkout
      window.location.href = data.url
    } catch (error) {
      console.error("Error creating upgrade session:", error)
      alert("Unable to create upgrade session. Please try again.")
    } finally {
      setIsLoading(false)
      setShowUpgradeDialog(false)
    }
  }

  const currentPlan = userProfile?.plan || "free"
  const isFreePlan = currentPlan.toLowerCase() === "free"

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Crown className="w-5 h-5 mr-2" />
          Subscription Plan
        </CardTitle>
        <CardDescription className="text-gray-400">Manage your current subscription and billing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isFreePlan ? "bg-gray-600" : "bg-gradient-to-br from-purple-600 to-blue-600"
              }`}
            >
              {isFreePlan ? <Zap className="w-5 h-5 text-gray-300" /> : <Crown className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="text-white font-semibold">{currentPlan.toUpperCase()} Plan</h3>
              <p className="text-gray-400 text-sm">
                {isFreePlan ? "Limited features" : `${(userProfile?.credits || 0).toLocaleString()} credits remaining`}
              </p>
            </div>
          </div>
          <Badge
            className={
              isFreePlan
                ? "bg-gray-100 text-gray-800"
                : currentPlan.toLowerCase() === "start"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-purple-100 text-purple-800"
            }
          >
            {currentPlan.toUpperCase()}
          </Badge>
        </div>

        <Separator className="bg-gray-800" />

        {/* Plan Actions */}
        <div className="space-y-3">
          {!isFreePlan ? (
            <>
              {/* Manage Subscription */}
              <Button
                onClick={handleManageSubscription}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {isLoading ? "Opening Portal..." : "Manage Subscription"}
              </Button>

              {/* Cancel Subscription */}
              <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-red-600 text-red-400 hover:bg-red-600/10 bg-transparent"
                  >
                    Cancel Subscription
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">Cancel Subscription</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      You can safely cancel your subscription through Stripe's secure portal. Your subscription will
                      remain active until the end of your current billing period.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex space-x-3 mt-6">
                    <Button
                      onClick={() => {
                        setShowCancelDialog(false)
                        handleManageSubscription()
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Billing Portal
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelDialog(false)}
                      className="flex-1 border-gray-600 text-gray-300"
                    >
                      Keep Subscription
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            /* Upgrade for Free Plan */
            <>
              <Button
                onClick={() => handleUpgrade()}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Plan
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {/* Upgrade Dialog */}
              <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                <DialogContent className="bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">Choose Your Plan</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Select the plan that best fits your needs. You can change or cancel anytime.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 mt-6">
                    <Button
                      onClick={() => handleUpgrade("start")}
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-between"
                    >
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        Start Plan
                      </div>
                      <span className="text-sm">€29.99/month</span>
                    </Button>
                    <Button
                      onClick={() => handleUpgrade("scale")}
                      disabled={isLoading}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-between"
                    >
                      <div className="flex items-center">
                        <Crown className="w-4 h-4 mr-2" />
                        Scale Plan
                      </div>
                      <span className="text-sm">€79.99/month</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowUpgradeDialog(false)}
                      className="w-full border-gray-600 text-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        {/* Portal Features Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <p className="text-xs text-blue-300">
            {isFreePlan ? (
              <span>
                <strong>Upgrade:</strong> Choose from our Start or Scale plans to unlock advanced features and higher
                credit limits.
              </span>
            ) : (
              <span>
                <strong>Subscription Management:</strong> Securely manage your subscription, update payment methods,
                view invoices, and change plans through Stripe's customer portal.
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
