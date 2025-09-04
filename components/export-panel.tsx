"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, Table } from "lucide-react"

interface ExportData {
  timestamp: string
  type: "direct" | "inverse"
  inputs: Record<string, number>
  results: Record<string, number>
}

interface ExportPanelProps {
  data: ExportData[]
  className?: string
}

export function ExportPanel({ data, className }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = () => {
    if (data.length === 0) return

    setIsExporting(true)

    try {
      // Create CSV headers
      const headers = ["Timestamp", "Type", "Inputs", "Results"]

      // Create CSV rows
      const rows = data.map((item) => [
        item.timestamp,
        item.type,
        JSON.stringify(item.inputs),
        JSON.stringify(item.results),
      ])

      // Combine headers and rows
      const csvContent = [headers, ...rows].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)

      link.setAttribute("href", url)
      link.setAttribute("download", `propagacion-errores-${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting CSV:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportToPDF = async () => {
    setIsExporting(true)

    try {
      // This would use jsPDF + html2canvas for PDF export
      // For now, we'll show a placeholder
      console.log("PDF export would be implemented here with jsPDF + html2canvas")

      // Simulate export delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Error exporting PDF:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card className={`rounded-2xl border-0 shadow-lg ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Download className="h-5 w-5" />
          Exportar Resultados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {data.length} resultado{data.length !== 1 ? "s" : ""} disponible{data.length !== 1 ? "s" : ""} para exportar
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={exportToCSV}
            disabled={data.length === 0 || isExporting}
            className="flex-1 bg-transparent"
            variant="outline"
          >
            <Table className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>

          <Button
            onClick={exportToPDF}
            disabled={data.length === 0 || isExporting}
            className="flex-1 bg-transparent"
            variant="outline"
          >
            <FileText className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>

        {data.length === 0 && (
          <div className="text-center text-muted-foreground py-4 text-sm">
            Realiza algunos cálculos para poder exportar los resultados
          </div>
        )}
      </CardContent>
    </Card>
  )
}
