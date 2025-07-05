"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreditCard, Crown, Zap, AlertTriangle } from "lucide-react"

interface SubscriptionPlanSectionProps {
  userProfile: {
    plan: string
    credits: number
    name: string
  } | null
}

export function SubscriptionPlanSection({ userProfile }: SubscriptionPlanSectionProps) {
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const currentPlan = userProfile?.plan || "free"
  const creditsUsed = Math.max(0, (userProfile?.credits || 100) - (userProfile?.credits || 100))
  const creditsTotal = userProfile?.credits || 100
  const creditsRemaining = userProfile?.credits || 100
  const usagePercentage = creditsTotal > 0 ? Math.max(0, ((creditsTotal - creditsRemaining) / creditsTotal) * 100) : 0

  const getPlanIcon = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "free":
        return <Zap className="w-5 h-5" />
      case "pro":
        return <Crown className="w-5 h-5" />
      case "business":
        return <CreditCard className="w-5 h-5" />
      default:
        return <Zap className="w-5 h-5" />
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

  const getPlanLimits = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "free":
        return { monthlyCredits: 100, features: ["Basic model comparison", "5 tests per day", "Email support"] }
      case "pro":
        return {
          monthlyCredits: 1000,
          features: ["All models access", "Unlimited tests", "Priority support", "Advanced analytics"],
        }
      case "business":
        return {
          monthlyCredits: 5000,
          features: ["Everything in Pro", "Team collaboration", "Custom integrations", "Dedicated support"],
        }
      default:
        return { monthlyCredits: 100, features: ["Basic features"] }
    }
  }

  const planLimits = getPlanLimits(currentPlan)

  const handleCancelSubscription = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setShowCancelModal(false)
    // Here you would typically redirect or show a success message
    console.log("Subscription cancelled")
  }

  return (
    <>
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
            {getPlanIcon(currentPlan)}
            Subscription Plan
          </CardTitle>
          <p className="text-gray-400">Manage your subscription and usage</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Plan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Current Plan</span>
              <Badge className={getPlanColor(currentPlan)}>{currentPlan.toUpperCase()}</Badge>
            </div>

            {/* Plan Features */}
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-300">Plan Features</span>
              <ul className="text-sm text-gray-400 space-y-1">
                {planLimits.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Credits This Month</span>
                <span className="text-white font-medium">
                  {creditsRemaining.toLocaleString()}/{planLimits.monthlyCredits.toLocaleString()}
                </span>
              </div>
              <Progress value={(creditsRemaining / planLimits.monthlyCredits) * 100} className="h-2 bg-gray-800" />
              <p className="text-xs text-gray-400">{creditsRemaining.toLocaleString()} credits remaining</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
              onClick={() => (window.location.href = "/pricing")}
            >
              <Crown className="w-4 h-4 mr-2" />
              {currentPlan.toLowerCase() === "free" ? "Upgrade Plan" : "Change Plan"}
            </Button>

            {currentPlan.toLowerCase() !== "free" && (
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent flex-1"
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to cancel your {currentPlan.toUpperCase()} subscription? You will lose access to
              premium features at the end of your billing period.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
              disabled={isLoading}
            >
              Go back
            </Button>
            <Button
              onClick={handleCancelSubscription}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? "Cancelling..." : "Yes, cancel my subscription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}