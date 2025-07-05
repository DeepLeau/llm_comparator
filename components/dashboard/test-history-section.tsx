"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import { format } from "date-fns"

interface TestHistoryItem {
  id: string
  useCase: string
  date: string
  cost: number
}

// Mock data for test history
const testHistory: TestHistoryItem[] = [
  {
    id: "TEST-001",
    useCase: "Email Writing",
    date: "2024-01-15",
    cost: 0.24,
  },
  {
    id: "TEST-002",
    useCase: "Sales Pitch",
    date: "2024-01-14",
    cost: 0.18,
  },
  {
    id: "TEST-003",
    useCase: "Customer Support",
    date: "2024-01-13",
    cost: 0.15,
  },
  {
    id: "TEST-004",
    useCase: "Content Extraction",
    date: "2024-01-12",
    cost: 0.21,
  },
  {
    id: "TEST-005",
    useCase: "Product Description",
    date: "2024-01-11",
    cost: 0.19,
  },
]

export function TestHistorySection() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }).format(amount)
  }

  const handleViewDetails = (testId: string) => {
    // Navigate to test details page
    window.location.href = `/test/${testId}`
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">Test History</CardTitle>
        <p className="text-sm text-gray-600">View your previous test runs and results</p>
      </CardHeader>
      <CardContent>
        {testHistory.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tests yet</h3>
            <p className="text-gray-600">Start your first test to see results here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-gray-700 font-medium">Test ID</TableHead>
                  <TableHead className="text-gray-700 font-medium">Use Case</TableHead>
                  <TableHead className="text-gray-700 font-medium">Date</TableHead>
                  <TableHead className="text-gray-700 font-medium">Cost</TableHead>
                  <TableHead className="text-gray-700 font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testHistory.map((test) => (
                  <TableRow key={test.id} className="border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-mono text-sm text-gray-900">{test.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-blue-200 text-blue-800 bg-blue-50">
                        {test.useCase}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{format(new Date(test.date), "MMM dd, yyyy")}</TableCell>
                    <TableCell className="text-gray-900 font-medium">{formatCurrency(test.cost)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleViewDetails(test.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}