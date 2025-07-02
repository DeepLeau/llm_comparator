"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Eye, Clock, DollarSign, Star } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import type { TestRun } from "@/app/dashboard/page"

interface TestHistoryTableProps {
  testRuns: TestRun[]
}

export function TestHistoryTable({ testRuns }: TestHistoryTableProps) {
  const truncatePrompt = (prompt: string, maxLength = 100) => {
    if (prompt.length <= maxLength) return prompt
    return prompt.substring(0, maxLength) + "..."
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }).format(amount)
  }

  if (testRuns.length === 0) {
    return (
      <Card className="p-12 bg-white/5 border-white/10 backdrop-blur-sm text-center">
        <div className="text-gray-400">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-white mb-2">Aucun test trouvé</h3>
          <p>Aucun test ne correspond à vos critères de filtrage.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold text-white">Historique des tests</h2>
        <p className="text-gray-400 text-sm mt-1">
          {testRuns.length} test{testRuns.length > 1 ? "s" : ""} trouvé{testRuns.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-gray-300 font-medium">Date du test</TableHead>
              <TableHead className="text-gray-300 font-medium">Prompt utilisé</TableHead>
              <TableHead className="text-gray-300 font-medium">Meilleur modèle</TableHead>
              <TableHead className="text-gray-300 font-medium text-center">Score moyen</TableHead>
              <TableHead className="text-gray-300 font-medium text-center">Temps moyen</TableHead>
              <TableHead className="text-gray-300 font-medium text-center">Coût total</TableHead>
              <TableHead className="text-gray-300 font-medium text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testRuns.map((testRun) => (
              <TableRow key={testRun.id} className="border-white/10 hover:bg-white/5 transition-colors">
                <TableCell className="text-gray-300">
                  {format(new Date(testRun.date), "dd MMM yyyy", { locale: fr })}
                </TableCell>

                <TableCell className="max-w-xs">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-gray-300 cursor-help">{truncatePrompt(testRun.prompt)}</div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-md bg-gray-800 border-white/20 text-white p-3">
                        <p className="text-sm leading-relaxed">{testRun.prompt}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 bg-gradient-to-r ${testRun.bestModel.color} rounded-lg flex items-center justify-center text-sm`}
                    >
                      {testRun.bestModel.icon}
                    </div>
                    <div>
                      <div className="text-white font-medium">{testRun.bestModel.name}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {testRun.bestModel.score}/10
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <Badge variant="outline" className="border-white/20 text-gray-300">
                    {testRun.averageScore.toFixed(1)}/10
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{testRun.averageTime}ms</span>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-300">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">{formatCurrency(testRun.totalCost)}</span>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white bg-transparent"
                    onClick={() => {
                      // Navigate to test details page
                      window.location.href = `/test/${testRun.id}`
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Voir détails
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}