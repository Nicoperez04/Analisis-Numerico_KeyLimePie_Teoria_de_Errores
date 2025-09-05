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
  onResult?: (result: { id: string; correct: boolean; userAnswer: number; attempt: number }) => void
  title?: string
  className?: string
}

export function ExerciseCard({
  id,
  statement,
  answer,
  tolerance,
  solution,
  onNewRandom,
  onResult,
  title,
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

    onResult?.({ id, correct, userAnswer: parsedAnswer, attempt: attemptCount + 1 })
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
        statement.replace(/\n|\r/g, " ").slice(0, 140),
        userAnswer,
        answer,
        isCorrect ? "Sí" : "No",
        answer !== 0 ? Math.abs((parseNumber(userAnswer, locale) - answer) / answer) * 100 : 0,
        attemptCount,
      ],
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `ejercicio_${id}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const locale = getDecimalLocale()

  return (
    <Card className={cn("rounded-2xl border-0 shadow-lg", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {title ?? `Ejercicio ${id}`}
          </CardTitle>
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
        {/* Enunciado */}
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">{statement}</p>
        </div>

        {/* Respuesta */}
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
            <Button onClick={handleCheck} disabled={isChecked || userAnswer.trim() === ""}>
              Verificar
            </Button>
          </div>
        </div>

        {/* Resultado */}
        {isChecked && (
          <div
            className={cn(
              "rounded-lg p-4 border",
              isCorrect ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900" : "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900",
            )}
          >
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-700 dark:text-green-300">¡Correcto!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-700 dark:text-red-300">Incorrecto</span>
                </>
              )}
              <Badge variant="secondary" className="ml-auto">
                Intentos: {attemptCount}
              </Badge>
            </div>
            {!isCorrect && (
              <p className="text-sm text-muted-foreground mt-2">
                La respuesta correcta es {formatNumber(answer, locale)} (tolerancia ±{formatNumber(tolerance, locale)}).
              </p>
            )}
            <div className="mt-3">
              <Button variant="ghost" size="sm" onClick={() => setShowSolution((s) => !s)} className="gap-2">
                <Eye className="h-4 w-4" />
                {showSolution ? "Ocultar solución" : "Ver solución"}
              </Button>
            </div>
            {showSolution && (
              <div className="mt-2 space-y-2 bg-muted/40 rounded-md p-3">
                {solution.map((line, i) => (
                  <div key={i} className="text-sm">
                    <FormulaBlock latex={line} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reintento */}
        {isChecked && (
          <Button variant="ghost" onClick={handleReset} className="w-full">
            Intentar de nuevo
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
