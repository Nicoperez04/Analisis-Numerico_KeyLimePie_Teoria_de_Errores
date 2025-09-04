"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FormulaBlock } from "@/components/formula-block"
import { CheckCircle, XCircle, Eye, Shuffle, Download } from "lucide-react"
import { parseNumber, formatNumber, getDecimalLocale } from "@/lib/format"
import { cn } from "@/lib/utils"

interface ExerciseCardProps {
  id: string
  statement: string
  answer: number
  tolerance: number
  solution: string[]
  onNewRandom?: () => void
  className?: string
}

export function ExerciseCard({
  id,
  statement,
  answer,
  tolerance,
  solution,
  onNewRandom,
  className,
}: ExerciseCardProps) {
  const [userAnswer, setUserAnswer] = useState("")
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)

  const handleCheck = () => {
    const locale = getDecimalLocale()
    const parsedAnswer = parseNumber(userAnswer, locale)
    const difference = Math.abs(parsedAnswer - answer)
    const correct = difference <= tolerance

    setIsCorrect(correct)
    setIsChecked(true)
    setAttemptCount((prev) => prev + 1)
  }

  const handleReset = () => {
    setUserAnswer("")
    setIsChecked(false)
    setIsCorrect(null)
    setShowSolution(false)
  }

  const handleNewRandom = () => {
    handleReset()
    onNewRandom?.()
  }

  const handleExportCSV = () => {
    const locale = getDecimalLocale()
    const parsedAnswer = parseNumber(userAnswer, locale)
    const relativeError = isChecked ? Math.abs(((parsedAnswer - answer) / answer) * 100) : 0

    const csvData = [
      [
        "ID",
        "Fecha",
        "Ejercicio",
        "Respuesta Usuario",
        "Respuesta Correcta",
        "Correcto",
        "Error Relativo (%)",
        "Intentos",
      ],
      [
        id,
        new Date().toLocaleString(locale === "ES" ? "es-ES" : "en-US"),
        `"${statement.replace(/"/g, '""')}"`, // Escape quotes in statement
        formatNumber(parsedAnswer, locale),
        formatNumber(answer, locale),
        isCorrect ? "Sí" : "No",
        formatNumber(relativeError, locale),
        attemptCount.toString(),
      ],
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `ejercicio_${id}_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const locale = getDecimalLocale()

  return (
    <Card className={cn("rounded-2xl border-0 shadow-lg", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Ejercicio {id}</CardTitle>
          <div className="flex gap-2">
            {isChecked && (
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
            )}
            {onNewRandom && (
              <Button variant="outline" size="sm" onClick={handleNewRandom}>
                <Shuffle className="h-4 w-4 mr-1" />
                Nuevo
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statement */}
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">{statement}</p>
        </div>

        {/* Answer Input */}
        <div className="space-y-3">
          <Label htmlFor={`answer-${id}`} className="text-sm font-medium">
            Tu respuesta:
          </Label>
          <div className="flex gap-3">
            <Input
              id={`answer-${id}`}
              type="text"
              inputMode="decimal"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={locale === "ES" ? "0,000" : "0.000"}
              className="flex-1"
              disabled={isChecked}
            />
            <Button onClick={handleCheck} disabled={!userAnswer.trim() || isChecked} className="min-w-[100px]">
              Verificar
            </Button>
          </div>
          {attemptCount > 0 && <p className="text-xs text-muted-foreground">Intentos: {attemptCount}</p>}
        </div>

        {/* Result */}
        {isChecked && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    ¡Correcto!
                  </Badge>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Incorrecto
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Error: {formatNumber(Math.abs(((parseNumber(userAnswer, locale) - answer) / answer) * 100), locale)}
                    %
                  </Badge>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Respuesta esperada: {formatNumber(answer, locale)} (±{formatNumber(tolerance, locale)})
            </p>
          </div>
        )}

        {/* Solution */}
        <div className="space-y-3">
          <Button variant="outline" onClick={() => setShowSolution(!showSolution)} className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            {showSolution ? "Ocultar" : "Ver"} solución
          </Button>

          {showSolution && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
              <h4 className="font-medium text-sm">Solución paso a paso:</h4>
              {solution.map((step, index) => (
                <div key={index} className="text-sm">
                  {step.includes("\\") ? <FormulaBlock latex={step} /> : <p className="leading-relaxed">{step}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reset Button */}
        {isChecked && (
          <Button variant="ghost" onClick={handleReset} className="w-full">
            Intentar de nuevo
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
