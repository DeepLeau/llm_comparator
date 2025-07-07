"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TopNavigation } from "@/components/dashboard/top-navigation"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { TestHistoryTable } from "@/components/dashboard/test-history-table"
import { BatchTestingCTA } from "@/components/dashboard/batch-testing-cta"
import { supabase } from "@/lib/supabase"

export interface TestRun {
  id: string
  created_at: string
  use_case: string
  total_cost: number
}

export default function DashboardPage() {
  const [testRuns, setTestRuns] = useState<TestRun[]>([])
  const [filteredRuns, setFilteredRuns] = useState<TestRun[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchTests(user.id)
    }
  }, [user, currentPage, itemsPerPage])

  const checkUser = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        router.push("/login")
        return
      }

      setUser(user)
    } catch (error) {
      console.error("Error checking user:", error)
      router.push("/login")
    }
  }

  const fetchTests = async (userId: string) => {
    try {
      setLoading(true)

      // First, get the total count
      const { count, error: countError } = await supabase
        .from("tests")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

      if (countError) {
        console.error("Error fetching count:", countError)
        return
      }

      setTotalCount(count || 0)

      // Then fetch the paginated data
      const from = (currentPage - 1) * itemsPerPage
      const to = from + itemsPerPage - 1

      const { data: tests, error } = await supabase
        .from("tests")
        .select("id, created_at, use_case, total_cost")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to)

      if (error) {
        console.error("Error fetching tests:", error)
        return
      }

      const formattedTests: TestRun[] =
        tests?.map((test) => ({
          id: test.id,
          created_at: test.created_at,
          use_case: test.use_case,
          total_cost: test.total_cost, 
        })) || []

      setTestRuns(formattedTests)
      setFilteredRuns(formattedTests)
    } catch (error) {
      console.error("Error fetching tests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (useCaseFilter: string, dateRange: { from: Date | null; to: Date | null }) => {
    let filtered = testRuns

    // Filter by use case
    if (useCaseFilter && useCaseFilter !== "all") {
      filtered = filtered.filter((run) => run.use_case === useCaseFilter)
    }

    // Filter by date range
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((run) => {
        const runDate = new Date(run.created_at)
        if (dateRange.from && runDate < dateRange.from) return false
        if (dateRange.to && runDate > dateRange.to) return false
        return true
      })
    }

    setFilteredRuns(filtered)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your tests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <TopNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <DashboardFilters onFilterChange={handleFilterChange} />
          <TestHistoryTable
            testRuns={filteredRuns}
            totalCount={totalCount}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            loading={loading}
          />
          <BatchTestingCTA />
        </div>
      </div>
    </div>
  )
}