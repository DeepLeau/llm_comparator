"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Eye,
  Zap,
  Calendar,
  Hash,
  Target,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { format } from "date-fns"
import type { TestRun } from "@/app/dashboard/page"

interface TestHistoryTableProps {
  testRuns: TestRun[]
  totalCount: number
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (items: number) => void
  loading: boolean
}

export function TestHistoryTable({
  testRuns,
  totalCount,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  loading,
}: TestHistoryTableProps) {
  const totalPages = Math.ceil(totalCount / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 3,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getUseCaseBadgeColor = (useCase: string) => {
    const colors: Record<string, string> = {
      "Content Generation": "bg-blue-600/20 text-blue-300 border-blue-600/30",
      "Code Assistance": "bg-green-600/20 text-green-300 border-green-600/30",
      "Customer Support": "bg-purple-600/20 text-purple-300 border-purple-600/30",
      "Data Analysis": "bg-orange-600/20 text-orange-300 border-orange-600/30",
      Translation: "bg-pink-600/20 text-pink-300 border-pink-600/30",
      "Research and Summarization": "bg-yellow-600/20 text-yellow-300 border-yellow-600/30",
    }
    return colors[useCase] || "bg-gray-600/20 text-gray-300 border-gray-600/30"
  }

  const handleViewDetails = (testId: string) => {
    window.location.href = `/results?testId=${testId}`
  }

  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (totalCount === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-12 text-center">
          <div className="text-gray-400">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-white mb-2">No tests found</h3>
            <p>You haven't run any tests yet. Start your first comparison to see results here.</p>
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => (window.location.href = "/use-case-selection")}
            >
              Start Your First Test
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Overview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Test History</h2>
          <p className="text-gray-400 text-sm mt-1">
            Showing {startIndex + 1} to {endIndex} of {totalCount} tests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/30">
            {totalCount} Total Tests
          </Badge>
          <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-600/30">
            Total Cost: {formatCurrency(testRuns.reduce((sum, test) => sum + test.total_cost, 0))}
          </Badge>
        </div>
      </div>

      {/* Table */}
      <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
        {loading ? (
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading tests...</p>
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-800/50">
                  <TableHead className="text-gray-300 font-medium">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Test ID
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300 font-medium">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Use Case
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300 font-medium">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Cost
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300 font-medium text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testRuns.map((testRun) => (
                  <TableRow key={testRun.id} className="border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <TableCell className="font-mono text-sm text-blue-400">
                      TEST-{testRun.id.slice(-8).toUpperCase()}
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary" className={getUseCaseBadgeColor(testRun.use_case)}>
                        {testRun.use_case}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-gray-300">
                      {format(new Date(testRun.created_at), "MMM dd, yyyy")}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-white font-medium">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        {formatCurrency(testRun.total_cost)}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(testRun.id)}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
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
      </Card>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Items per page selector */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Show:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => onItemsPerPageChange(Number.parseInt(value))}
                >
                  <SelectTrigger className="w-20 bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="10" className="text-white hover:bg-gray-700">
                      10
                    </SelectItem>
                    <SelectItem value="25" className="text-white hover:bg-gray-700">
                      25
                    </SelectItem>
                    <SelectItem value="50" className="text-white hover:bg-gray-700">
                      50
                    </SelectItem>
                    <SelectItem value="100" className="text-white hover:bg-gray-700">
                      100
                    </SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-gray-400">per page</span>
              </div>

              {/* Page info */}
              <div className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </div>

              {/* Pagination controls */}
              <div className="flex items-center gap-1">
                {/* First page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent disabled:opacity-50"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>

                {/* Previous page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {generatePageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === "..." ? (
                        <span className="px-3 py-1 text-gray-500">...</span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => onPageChange(page as number)}
                          className={
                            currentPage === page
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
                          }
                        >
                          {page}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Next page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Last page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent disabled:opacity-50"
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}