"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Calendar, BarChart3 } from "lucide-react"

const dailyData = [
  { name: "Mon", successful: 1200, failed: 45, responseTime: 234 },
  { name: "Tue", successful: 1350, failed: 32, responseTime: 245 },
  { name: "Wed", successful: 1180, failed: 28, responseTime: 198 },
  { name: "Thu", successful: 1420, failed: 51, responseTime: 267 },
  { name: "Fri", successful: 1680, failed: 38, responseTime: 223 },
  { name: "Sat", successful: 980, failed: 22, responseTime: 189 },
  { name: "Sun", successful: 850, failed: 18, responseTime: 201 },
]

const weeklyData = [
  { name: "Week 1", successful: 8200, failed: 234, responseTime: 245 },
  { name: "Week 2", successful: 9100, failed: 189, responseTime: 223 },
  { name: "Week 3", successful: 8750, failed: 156, responseTime: 234 },
  { name: "Week 4", successful: 9800, failed: 201, responseTime: 198 },
]

const monthlyData = [
  { name: "Jan", successful: 32000, failed: 890, responseTime: 267 },
  { name: "Feb", successful: 35000, failed: 756, responseTime: 245 },
  { name: "Mar", successful: 38000, failed: 623, responseTime: 223 },
  { name: "Apr", successful: 41000, failed: 534, responseTime: 234 },
  { name: "May", successful: 39000, failed: 445, responseTime: 198 },
  { name: "Jun", successful: 42000, failed: 389, responseTime: 189 },
]

export function APIAnalyticsSection() {
  const [timeRange, setTimeRange] = useState("daily")

  const getData = () => {
    switch (timeRange) {
      case "weekly":
        return weeklyData
      case "monthly":
        return monthlyData
      default:
        return dailyData
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Requests Over Time */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <CardTitle className="text-white">Requests Over Time</CardTitle>
            </div>
            <div className="flex gap-1">
              {["daily", "weekly", "monthly"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className={
                    timeRange === range
                      ? "bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 text-xs"
                      : "text-gray-400 hover:text-white hover:bg-gray-800 h-8 px-3 text-xs"
                  }
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getData()}>
                <defs>
                  <linearGradient id="successfulGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl">
                          <p className="text-white font-semibold mb-2">{label}</p>
                          <div className="space-y-1">
                            {payload.map((entry, index) => (
                              <div key={index} className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                  <span className="text-gray-300 text-sm">{entry.name}:</span>
                                </div>
                                <span className="text-white font-medium">{entry.value.toLocaleString()} requests</span>
                              </div>
                            ))}
                            <div className="border-t border-gray-600 pt-2 mt-2">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-300 text-sm">Total:</span>
                                <span className="text-white font-medium">
                                  {(payload[0]?.value + payload[1]?.value).toLocaleString()} requests
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="successful"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#successfulGradient)"
                  name="Successful"
                />
                <Area
                  type="monotone"
                  dataKey="failed"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#failedGradient)"
                  name="Failed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Response Time */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-yellow-400" />
            <CardTitle className="text-white">Average Response Time</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getData()}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickFormatter={(value) => `${value}ms`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl">
                          <p className="text-white font-semibold mb-2">{label}</p>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].color }} />
                              <span className="text-gray-300 text-sm">Response Time:</span>
                            </div>
                            <span className="text-white font-medium">{payload[0].value}ms</span>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="responseTime" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Response Time (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
