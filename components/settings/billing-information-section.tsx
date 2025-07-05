"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, ExternalLink, Loader2 } from "lucide-react"

export function BillingInformationSection() {
  const [isLoading, setIsLoading] = useState(false)

  const handleManageBilling = async () => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create portal session")
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url
    } catch (error) {
      console.error("Portal error:", error)
      alert("Failed to open billing portal. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Billing Information
        </CardTitle>
        <CardDescription>Manage your subscription and billing details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Current Plan</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Pro Plan</span>
              <Badge variant="secondary">Active</Badge>
            </div>
            <span className="text-sm text-muted-foreground">$29/month</span>
          </div>
        </div>

        <Separator />

        {/* Usage */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Usage This Month</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>API Calls</span>
              <span>247 / 1,000</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: "24.7%" }}></div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Next Billing */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Next Billing Date</h4>
          <p className="text-sm text-muted-foreground">January 15, 2024</p>
        </div>

        <Separator />

        {/* Payment Method */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Payment Method</h4>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="text-sm">•••• •••• •••• 4242</span>
            <Badge variant="outline">Visa</Badge>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleManageBilling} disabled={isLoading} className="flex-1">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Manage Billing
              </>
            )}
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            Download Invoices
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
