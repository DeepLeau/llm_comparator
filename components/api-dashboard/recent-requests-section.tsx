"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle } from "lucide-react"

const recentRequests = [
  {
    id: "req_001",
    endpoint: "/v1/chat/completions",
    model: "GPT-4",
    status: "success",
    responseTime: 234,
    timestamp: "2 minutes ago",
    tokens: 1247,
  },
  {
    id: "req_002",
    endpoint: "/v1/completions",
    model: "GPT-3.5 Turbo",
    status: "success",
    responseTime: 156,
    timestamp: "3 minutes ago",
    tokens: 892,
  },
  {
    id: "req_003",
    endpoint: "/v1/chat/completions",
    model: "Claude 3 Opus",
    status: "failed",
    responseTime: 0,
    timestamp: "5 minutes ago",
    tokens: 0,
  },
  {
    id: "req_004",
    endpoint: "/v1/embeddings",
    model: "text-embedding-ada-002",
    status: "success",
    responseTime: 89,
    timestamp: "7 minutes ago",
    tokens: 456,
  },
  {
    id: "req_005",
    endpoint: "/v1/chat/completions",
    model: "GPT-4",
    status: "success",
    responseTime: 298,
    timestamp: "12 minutes ago",
    tokens: 1834,
  },
]

export function RecentRequestsSection() {
  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Recent API Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {request.status === "success" ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <Badge
                    className={
                      request.status === "success"
                        ? "bg-green-600/20 text-green-300 border-green-600/30"
                        : "bg-red-600/20 text-red-300 border-red-600/30"
                    }
                  >
                    {request.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-white font-medium">{request.endpoint}</p>
                  <p className="text-sm text-gray-400">{request.model}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="text-right">
                  <p className="text-white">{request.responseTime}ms</p>
                  <p>{request.tokens} tokens</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-300">{request.timestamp}</p>
                  <p className="text-xs">{request.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
