"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Download, Calendar, DollarSign } from "lucide-react"

interface BillingInformationSectionProps {
  userProfile: {
    plan: string
    credits: number
    name: string
  } | null
}

export function BillingInformationSection({ userProfile }: BillingInformationSectionProps) {
  const [isLoading, setIsLoading] = useState(false)

  const currentPlan = userProfile?.plan || "free"
  const isFreePlan = currentPlan.toLowerCase() === "free"

  // Mock billing data - in a real app, this would come from your backend
  const billingInfo = {
    nextBillingDate: "2024-02-15",
    amount: currentPlan.toLowerCase() === "start" ? "$29.00" : "$99.00",
    paymentMethod: "**** **** **** 4242",
    invoices: [
      { id: "inv_001", date: "2024-01-15", amount: "$29.00", status: "paid" },
      { id: "inv_002", date: "2023-12-15", amount: "$29.00", status: "paid" },
      { id: "inv_003", date: "2023-11-15", amount: "$29.00", status: "paid" },
    ],
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    // In a real app, this would download the actual invoice
    console.log("Downloading invoice:", invoiceId)
    alert(`Downloading invoice ${invoiceId}...`)
  }

  if (isFreePlan) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Billing Information
          </CardTitle>
          <CardDescription className="text-gray-400">Your billing details and payment history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No Billing Information</h3>
            <p className="text-gray-400 text-sm mb-4">
              You're currently on the free plan. Upgrade to access billing features.
            </p>
            <Button
              onClick={() => (window.location.href = "/pricing")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
            >
              View Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Billing Information
        </CardTitle>
        <CardDescription className="text-gray-400">Your billing details and payment history</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Billing Cycle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">Next Billing Date</p>
                <p className="text-white font-semibold">{billingInfo.nextBillingDate}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Amount</p>
                <p className="text-white font-semibold">{billingInfo.amount}/month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-400 text-sm">Payment Method</p>
                <p className="text-white font-semibold">{billingInfo.paymentMethod}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              disabled={isLoading}
            >
              Update
            </Button>
          </div>
        </div>

        <Separator className="bg-gray-800" />

        {/* Invoice History */}
        <div>
          <h3 className="text-white font-semibold mb-4">Recent Invoices</h3>
          <div className="space-y-3">
            {billingInfo.invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <p className="text-white text-sm font-medium">{invoice.date}</p>
                    <p className="text-gray-400 text-xs">{invoice.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-white font-semibold">{invoice.amount}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadInvoice(invoice.id)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Portal Link */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <p className="text-xs text-blue-300">
            <strong>Need to update your billing details?</strong> Use the "Manage Subscription" button above to access
            your secure billing portal where you can update payment methods, view all invoices, and manage your
            subscription.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
