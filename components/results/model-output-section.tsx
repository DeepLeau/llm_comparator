"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Star, Clock, DollarSign, MessageSquare, Shield } from "lucide-react"

interface ModelOutputSectionProps {
  result: any
}

export function ModelOutputSection({ result }: ModelOutputSectionProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.response)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const qualityStars = Math.round(result.qualityScore)
  const responseTimeColor =
    result.responseTime < 1000 ? "text-green-400" : result.responseTime < 2000 ? "text-yellow-400" : "text-red-400"
  const costColor = result.cost < 0.01 ? "text-green-400" : result.cost < 0.05 ? "text-yellow-400" : "text-red-400"

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              {result.modelName}
            </CardTitle>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">{result.provider}</span>
              <Badge
                variant="secondary"
                className={`${
                  result.license === "open-source"
                    ? "bg-green-600/20 text-green-300 border-green-600/30"
                    : "bg-blue-600/20 text-blue-300 border-blue-600/30"
                }`}
              >
                <Shield className="w-3 h-3 mr-1" />
                {result.license === "open-source" ? "Open Source" : "Propriétaire"}
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        {/* Performance Metrics */}
        <div className="flex items-center gap-6 pt-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < qualityStars ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                />
              ))}
            </div>
            <span className="text-white text-sm font-medium">{result.qualityScore.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${responseTimeColor}`} />
            <span className="text-gray-300 text-sm">{result.responseTime.toFixed(0)}ms</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className={`w-4 h-4 ${costColor}`} />
            <span className="text-gray-300 text-sm">${result.cost.toFixed(4)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prompt */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Prompt</h4>
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <p className="text-gray-300 text-sm">{result.prompt}</p>
          </div>
        </div>
        {/* Response */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Response</h4>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">{result.response}</div>
            </div>
          </div>
        </div>
        {/* Timestamp */}
        <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-800">
          <span>Generated on {result.timestamp.toLocaleString()}</span>
          <span>ID: {result.id}</span>
        </div>
      </CardContent>
    </Card>
  )
}
