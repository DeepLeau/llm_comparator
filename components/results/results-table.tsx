"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, DollarSign } from "lucide-react"
import type { TestResult } from "./results-page"

interface ResultsTableProps {
  results: TestResult[]
}

export function ResultsTable({ results }: ResultsTableProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No results match your current filters</p>
        <p className="text-gray-500 text-sm mt-2">Try adjusting your filter criteria</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800 hover:bg-gray-800/50">
            <TableHead className="text-gray-300 font-semibold">Model</TableHead>
            <TableHead className="text-gray-300 font-semibold">Provider</TableHead>
            <TableHead className="text-gray-300 font-semibold">License</TableHead>
            <TableHead className="text-gray-300 font-semibold">Quality</TableHead>
            <TableHead className="text-gray-300 font-semibold">Response Time</TableHead>
            <TableHead className="text-gray-300 font-semibold">Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => {
            const qualityStars = Math.round(result.qualityScore)
            const responseTimeColor =
              result.responseTime < 1000
                ? "text-green-400"
                : result.responseTime < 2000
                  ? "text-yellow-400"
                  : "text-red-400"
            const costColor =
              result.cost < 0.01 ? "text-green-400" : result.cost < 0.05 ? "text-yellow-400" : "text-red-400"

            return (
              <TableRow key={result.id} className="border-gray-800 hover:bg-gray-800/30">
                <TableCell>
                  <div className="font-medium text-white">{result.modelName}</div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-300">{result.provider}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${
                      result.license === "open-source"
                        ? "bg-green-600/20 text-green-300 border-green-600/30"
                        : "bg-blue-600/20 text-blue-300 border-blue-600/30"
                    }`}
                  >
                    {result.license === "open-source" ? "Open Source" : "Commercial"}
                  </Badge>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${responseTimeColor}`} />
                    <span className="text-white">{result.responseTime.toFixed(0)}ms</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DollarSign className={`w-4 h-4 ${costColor}`} />
                    <span className="text-white">${result.cost.toFixed(4)}</span>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
