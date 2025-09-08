"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormulaBlock } from "@/components/formula-block"
import { CheckCircle, XCircle, Eye, Shuffle } from "lucide-react"
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
  /** NUEVO: respuestas alternativas válidas (se usan con la misma tolerancia) */
  altAnswers?: number[]
}

/** Intenta convertir una línea “humana” en LaTeX. Devuelve null si conviene dejarla como texto. */
function toLatex(line: string): string | null {
  const raw = line.trim()
  if (!raw) return null

  // Si ya parece LaTeX, lo respetamos
  if (/\\[a-zA-Z]/.test(raw)) return raw

  // Títulos/pasos: dejarlos en texto
  if (/^Paso\s*\d+/i.test(raw)) return null

  // ¿Tiene pinta de fórmula?
  const hasMath = /[=×|Ω]|Δ\*|ε\*|∂/.test(raw)
  if (!hasMath) return null

  // Separamos prefijo con dos puntos para mantenerlo como texto
  let prefix = ""
  let body = raw
  const colon = raw.indexOf(":")
  if (colon !== -1) {
    prefix = raw.slice(0, colon).trim()
    body = raw.slice(colon + 1).trim()
  }

  // Reemplazos “inteligentes”
  let tex = body

  // Δ*, ε*
  tex = tex.replace(/Δ\*/g, String.raw`\Delta^{*}`)
  tex = tex.replace(/ε\*/g, String.raw`\varepsilon^{*}`)

  // | ... |
  tex = tex.replace(/\|([^|]+)\|/g, String.raw`\left|$1\right|`)

  // multiplicación
  tex = tex.replace(/×/g, String.raw`\times`)

  // derivados ∂R/∂V (admite espacios)
  tex = tex.replace(/∂\s*([A-Za-z]+)\s*\/\s*∂\s*([A-Za-z]+)/g, String.raw`\frac{\partial $1}{\partial $2}`)

  // Omega
  tex = tex.replace(/Ω/g, String.raw`\,\Omega`)

  // Si no hubo cambios “realmente latex”, no fuerzo MathJax
  if (tex === body && !/\\/.test(tex)) return null

  // Con prefijo tipo “Efecto de V: …”
  if (prefix) {
    return String.raw`\text{${prefix}: }\; ${tex}`
  }
  return tex
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
  altAnswers = [],
}: ExerciseCardProps) {
  const [userAnswer, setUserAnswer] = useState("")
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)

  const handleCheck = () => {
    const locale = getDecimalLocale()
    const x = parseNumber(userAnswer, locale)

    // VALIDACIÓN: answer OR altAnswers
    const candidates = [answer, ...altAnswers]
    const correct = candidates.some((v) => Math.abs(x - v) <= tolerance)

    setIsCorrect(correct)
    setIsChecked(true)
    setAttemptCount((prev) => prev + 1)

    onResult?.({ id, correct, userAnswer: x, attempt: attemptCount + 1 })
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

  const locale = getDecimalLocale()

  return (
    <Card className={cn("rounded-2xl border-0 shadow-lg", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {title ?? `Ejercicio ${id}`}
          </CardTitle>
          <div className="flex gap-2">
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
              <span className="ml-auto text-xs text-muted-foreground">Intentos: {attemptCount}</span>
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
                {solution.map((line, i) => {
                  const latex = toLatex(line)
                  return (
                    <div key={i} className="text-sm">
                      {latex ? (
                        <FormulaBlock latex={latex} />
                      ) : (
                        <p className="whitespace-pre-wrap leading-relaxed">{line}</p>
                      )}
                    </div>
                  )
                })}
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
