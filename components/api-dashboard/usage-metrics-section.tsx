"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Clock, DollarSign, TrendingUp } from "lucide-react"

export function UsageMetricsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-800/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-100">Total Requests</CardTitle>
          <Activity className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">12,847</div>
          <p className="text-xs text-blue-300">+12% from last month</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-800/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-100">Success Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">98.2%</div>
          <p className="text-xs text-green-300">+0.3% from last month</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-yellow-800/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-yellow-100">Avg Response Time</CardTitle>
          <Clock className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">234ms</div>
          <p className="text-xs text-yellow-300">-12ms from last month</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-800/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-100">Monthly Cost</CardTitle>
          <DollarSign className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">$1,247</div>
          <p className="text-xs text-purple-300">+8% from last month</p>
        </CardContent>
      </Card>
    </div>
  )
}
