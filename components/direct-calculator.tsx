"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { FormulaBlock } from "@/components/formula-block"
import { SensitivityBars } from "@/components/sensitivity-bars"
import NumberInput from "@/components/number-input"
import { Calculator, CheckCircle, AlertCircle, RotateCcw } from "lucide-react"
import { PRESET_FUNCTIONS, calculateDirect, validateByExtremes, type Variable } from "@/lib/math-engine"
import { formatNumber, getDecimalLocale } from "@/lib/format"

export function DirectCalculator() {
  const [activePreset, setActivePreset] = useState<string>("R=V/I")
  const [customExpression, setCustomExpression] = useState("")
  const [variables, setVariables] = useState<Variable[]>([])
  const [results, setResults] = useState<any>(null)
  const [extremesValidation, setExtremesValidation] = useState<any>(null)
  const [showExtremes, setShowExtremes] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return // Don't trigger when typing in inputs

      switch (event.key.toLowerCase()) {
        case "r":
          event.preventDefault()
          calculate()
          break
        case "e":
          event.preventDefault()
          setShowExtremes(!showExtremes)
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [showExtremes])

  // Initialize variables based on preset
  useEffect(() => {
    if (activePreset === "Custom") {
      // Parse custom expression to extract variables (simplified)
      const varNames = customExpression.match(/\b[a-zA-Z][a-zA-Z0-9]*\b/g) || []
      const uniqueVars = [...new Set(varNames)].filter((name) => name !== "PI")

      setVariables(
        uniqueVars.map((name) => ({
          name,
          value: 1,
          absoluteError: 0.1,
        })),
      )
    } else {
      const preset = PRESET_FUNCTIONS[activePreset as keyof typeof PRESET_FUNCTIONS]
      if (preset) {
        setVariables(
          preset.variables.map((name) => ({
            name,
            value: name === "r" ? 5 : name === "h" ? 10 : name === "V" ? 12 : name === "I" ? 2 : 1,
            absoluteError: 0.1,
          })),
        )
      }
    }
  }, [activePreset, customExpression])

  const updateVariable = (index: number, field: "value" | "absoluteError", newValue: number | null) => {
    setVariables((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: newValue || 0 } : v)))
  }

  const calculate = async () => {
    if (variables.length === 0) return

    setIsCalculating(true)

    try {
      const expression =
        activePreset === "Custom"
          ? customExpression
          : PRESET_FUNCTIONS[activePreset as keyof typeof PRESET_FUNCTIONS]?.formula

      if (!expression) return

      // Calculate direct method
      const directResult = calculateDirect(expression, variables)
      setResults(directResult)

      // Validate by extremes if enabled
      if (showExtremes) {
        const extremes = validateByExtremes(expression, variables, directResult.interval)
        setExtremesValidation(extremes)
      }
    } catch (error) {
      console.error("Calculation error:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  const reset = () => {
    setResults(null)
    setExtremesValidation(null)
  }

  const locale = getDecimalLocale()
  const currentPreset =
    activePreset === "Custom" ? null : PRESET_FUNCTIONS[activePreset as keyof typeof PRESET_FUNCTIONS]

  return (
    <Card className="rounded-2xl border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calculator className="h-5 w-5 text-key-lime" />
          Calculadora Método Directo
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Atajos: <kbd className="px-1 py-0.5 bg-muted rounded text-xs">R</kbd> recalcular,{" "}
          <kbd className="px-1 py-0.5 bg-muted rounded text-xs">E</kbd> extremos
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preset Selection */}
        <Tabs value={activePreset} onValueChange={setActivePreset}>
          <TabsList className="grid w-full grid-cols-5">
            {Object.keys(PRESET_FUNCTIONS).map((preset) => (
              <TabsTrigger key={preset} value={preset} className="text-xs">
                {preset}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Preset Content */}
          {Object.entries(PRESET_FUNCTIONS).map(([key, preset]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">{preset.description}</h4>
                <FormulaBlock latex={preset.latex} />
              </div>
            </TabsContent>
          ))}

          <TabsContent value="Custom" className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="custom-expression">Expresión personalizada f(x₁, x₂, ...)</Label>
              <NumberInput
                value={customExpression ? null : null}
                onChange={() => {}}
                placeholder="Ej: x^2 + y*z, sin(x)*cos(y), etc."
                className="w-full rounded-md border px-3 py-2"
              />
              <p className="text-xs text-muted-foreground">
                Usa operadores: +, -, *, /, ^, sin, cos, tan, ln, exp, sqrt, PI
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Variables Input */}
        {variables.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Variables de entrada</h4>
            <div className="grid gap-4">
              {variables.map((variable, index) => (
                <div key={variable.name} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{variable.name}</Label>
                    <div className="text-xs text-muted-foreground">Valor nominal</div>
                  </div>
                  <div className="space-y-2">
                    <NumberInput
                      value={variable.value}
                      onChange={(value) => updateVariable(index, "value", value)}
                      placeholder={locale === "ES" ? "0,000" : "0.000"}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <NumberInput
                      value={variable.absoluteError}
                      onChange={(value) => updateVariable(index, "absoluteError", value)}
                      placeholder={locale === "ES" ? "±0,001" : "±0.001"}
                      className="w-full rounded-md border px-3 py-2"
                    />
                    <div className="text-xs text-muted-foreground">Cota absoluta Δ*({variable.name})</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1" />
          <div className="flex gap-3">
            <Button variant="outline" onClick={reset} disabled={!results}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
            <Button
              onClick={calculate}
              disabled={variables.length === 0 || isCalculating}
              className="bg-key-lime text-key-lime-foreground hover:bg-key-lime/90"
            >
              {isCalculating ? "Calculando..." : "Calcular"}
            </Button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Numerical Results */}
              <Card className="border-0 bg-key-lime/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Resultados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Valor u:</span>
                      <span className="font-mono text-sm">{formatNumber(results.value, locale)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Cota absoluta Δ*(u):</span>
                      <span className="font-mono text-sm">{formatNumber(results.absoluteError, locale)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Cota relativa ε*(u):</span>
                      <span className="font-mono text-sm">{formatNumber(results.relativeError * 100, locale)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Intervalo:</span>
                      <span className="font-mono text-sm">
                        [{formatNumber(results.interval[0], locale)}, {formatNumber(results.interval[1], locale)}]
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Effects Table */}
              <Card className="border-0 bg-blue-accent/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Efectos por Variable</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.effects.map((effect: any) => (
                      <div
                        key={effect.variable}
                        className="flex justify-between items-center p-2 bg-background/50 rounded"
                      >
                        <span className="text-sm font-medium">{effect.variable}:</span>
                        <div className="text-right">
                          <div className="font-mono text-sm">{formatNumber(effect.effect, locale)}</div>
                          <div className="text-xs text-muted-foreground">{effect.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sensitivity Chart */}
            <SensitivityBars
              title="¿Quién manda? - Contribución por Variable"
              items={results.effects.map((effect: any) => ({
                name: effect.variable,
                percent: effect.percentage,
              }))}
            />

            {/* Extremes Validation */}
            {showExtremes && extremesValidation && (
              <Card className="border-0 bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {extremesValidation.isCoherent ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                    )}
                    Validación por Extremos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Muestreo ({extremesValidation.samplesUsed} puntos)</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Mínimo:</span>
                          <span className="font-mono">{formatNumber(extremesValidation.min, locale)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Máximo:</span>
                          <span className="font-mono">{formatNumber(extremesValidation.max, locale)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm mb-2">Coherencia</h5>
                      <Badge variant={extremesValidation.isCoherent ? "secondary" : "destructive"} className="text-xs">
                        {extremesValidation.isCoherent ? "✓ Coherente" : "⚠ Incoherente"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        {extremesValidation.isCoherent
                          ? "El intervalo muestreado cae dentro del predicho"
                          : "El muestreo sugiere que la estimación lineal puede ser inexacta"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
