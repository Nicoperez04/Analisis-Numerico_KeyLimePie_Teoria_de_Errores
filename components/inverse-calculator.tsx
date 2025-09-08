"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { FormulaBlock } from "@/components/formula-block"
import { Target, PieChart, RotateCcw, Lightbulb } from "lucide-react"
import { PRESET_FUNCTIONS, calculateInverse, type Variable } from "@/lib/math-engine"
import { parseNumber, formatNumber, getDecimalLocale } from "@/lib/format"
import { cn } from "@/lib/utils"

export function InverseCalculator() {
  const [activePreset, setActivePreset] = useState<string>("R=V/I")
  const [customExpression, setCustomExpression] = useState("")
  const [variables, setVariables] = useState<Variable[]>([])
  const [targetError, setTargetError] = useState("0.01")
  const [isRelativeTarget, setIsRelativeTarget] = useState(true)
  const [hypothesis, setHypothesis] = useState<"H1" | "H2" | "H3">("H1")
  const [results, setResults] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return
      switch (event.key) {
        case "1":
          event.preventDefault()
          setHypothesis("H1")
          break
        case "2":
          event.preventDefault()
          setHypothesis("H2")
          break
        case "3":
          event.preventDefault()
          setHypothesis("H3")
          break
        case "r":
        case "R":
          event.preventDefault()
          calculate()
          break
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  // Initialize variables based on preset
  useEffect(() => {
    if (activePreset === "Custom") {
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

  const updateVariable = (index: number, field: "value", newValue: string) => {
    const locale = getDecimalLocale()
    const parsedValue = parseNumber(newValue, locale)
    setVariables((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: parsedValue } : v)))
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
      const locale = getDecimalLocale()
      const target = parseNumber(targetError, locale)
      const inverseResult = calculateInverse(expression, variables, target, isRelativeTarget, hypothesis)
      setResults(inverseResult)
    } catch (error) {
      console.error("Calculation error:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  const reset = () => setResults(null)

  const locale = getDecimalLocale()
  const currentPreset =
    activePreset === "Custom" ? null : PRESET_FUNCTIONS[activePreset as keyof typeof PRESET_FUNCTIONS]

  const getHypothesisExplanation = (hyp: "H1" | "H2" | "H3") => {
    switch (hyp) {
      case "H1":
        return {
          title: "Errores Absolutos Iguales",
          description: "Todas las variables tienen la misma cota absoluta Δ*(xi) = Δ*Gen",
          recommendation: "Recomendado cuando las variables tienen magnitudes similares",
          color: "key-lime",
        }
      case "H2":
        return {
          title: "Errores Relativos Iguales",
          description: "Todas las variables tienen el mismo error relativo ε*(xi) = ε*Gen",
          recommendation: "Recomendado cuando las variables tienen órdenes de magnitud diferentes",
          color: "blue-accent",
        }
      case "H3":
        return {
          title: "Efectos Iguales",
          description: "Cada variable contribuye por igual al error total",
          recommendation: "Útil para análisis de sensibilidad equilibrado",
          color: "chart-3",
        }
    }
  }

  return (
    <Card className="rounded-2xl border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Target className="h-5 w-5 text-blue-accent" />
          Calculadora Método Inverso
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Atajos: <kbd className="px-1 py-0.5 bg-muted rounded text-xs">1</kbd>
          <kbd className="px-1 py-0.5 bg-muted rounded text-xs">2</kbd>
          <kbd className="px-1 py-0.5 bg-muted rounded text-xs">3</kbd> hipótesis,{" "}
          <kbd className="px-1 py-0.5 bg-muted rounded text-xs">R</kbd> recalcular
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
              <Label htmlFor="custom-expression-inverse">Expresión personalizada f(x₁, x₂, ...)</Label>
              <Input
                id="custom-expression-inverse"
                value={customExpression}
                onChange={(e) => setCustomExpression(e.target.value)}
                placeholder="Ej: x^2 + y*z, sin(x)*cos(y), etc."
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Variables Input */}
        {variables.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Variables de entrada (valores nominales)</h4>
            <div className="grid gap-3">
              {variables.map((variable, index) => (
                <div key={variable.name} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">{variable.name}</Label>
                  </div>
                  <div className="space-y-1">
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={formatNumber(variable.value, locale)}
                      onChange={(e) => updateVariable(index, "value", e.target.value)}
                      placeholder={locale === "ES" ? "0,000" : "0.000"}
                      aria-label={`Valor nominal de ${variable.name}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Target Error */}
        <div className="space-y-4">
          <h4 className="font-medium">Objetivo de error</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <RadioGroup
                value={isRelativeTarget ? "relative" : "absolute"}
                onValueChange={(value) => setIsRelativeTarget(value === "relative")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="relative" id="relative" />
                  <Label htmlFor="relative" className="text-sm flex items-center gap-2">
                    Error relativo <FormulaBlock inline latex={String.raw`\varepsilon^{*}_{f}`} />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="absolute" id="absolute" />
                  <Label htmlFor="absolute" className="text-sm flex items-center gap-2">
                    Error absoluto <FormulaBlock inline latex={String.raw`\Delta^{*}_{f}`} />
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                inputMode="decimal"
                value={targetError}
                onChange={(e) => setTargetError(e.target.value)}
                placeholder={locale === "ES" ? "0,01" : "0.01"}
                aria-label="Objetivo de error"
              />
              <p className="text-xs text-muted-foreground">
                {isRelativeTarget ? "Ej: 0.02 para 2%" : "Valor absoluto deseado"}
              </p>
            </div>
          </div>
        </div>

        {/* Mother Equation */}
        <div className="p-4 bg-blue-accent/5 rounded-lg border border-blue-accent/20">
          <h4 className="font-medium mb-3">Ecuación madre</h4>
          <FormulaBlock
            latex={String.raw`\Delta^{*}_{f} = \sum_{i=1}^{n} \left|\frac{\partial f}{\partial x_i}\right| \Delta^{*}(x_i)`}
          />
        </div>

        {/* Hypothesis Selection */}
        <div className="space-y-4">
          <h4 className="font-medium">Hipótesis de reparto</h4>
          <RadioGroup value={hypothesis} onValueChange={(value) => setHypothesis(value as "H1" | "H2" | "H3")}>
            {(["H1", "H2", "H3"] as const).map((hyp) => {
              const info = getHypothesisExplanation(hyp)
              return (
                <div
                  key={hyp}
                  className="flex items-start space-x-3 p-4 rounded-lg border border-muted hover:bg-muted/30 transition-colors"
                >
                  <RadioGroupItem value={hyp} id={hyp} className="mt-1" />
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={hyp} className="text-sm font-medium flex items-center gap-2">
                      <Badge variant="secondary" className={`bg-${info.color}/20`}>{hyp}</Badge>
                      {info.title}
                    </Label>

                    {/* ✅ corregidas: llaves cerradas */}
                    <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1">
                      {hyp === "H1" && (
                        <>
                          Todas las variables tienen la misma cota absoluta
                          <FormulaBlock inline latex={String.raw`\Delta^{*}(x_i) = \Delta^{*}_{\mathrm{gen}}`} />
                        </>
                      )}
                      {hyp === "H2" && (
                        <>
                          Todas las variables tienen el mismo error relativo
                          <FormulaBlock inline latex={String.raw`\varepsilon^{*}(x_i) = \varepsilon^{*}_{\mathrm{gen}}`} />
                        </>
                      )}
                      {hyp === "H3" && <>Cada variable contribuye por igual al error total</>}
                    </div>

                    <p className="text-xs text-blue-600 dark:text-blue-400">{info.recommendation}</p>
                  </div>
                </div>
              )
            })}
          </RadioGroup>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={reset} disabled={!results}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
          <Button
            onClick={calculate}
            disabled={variables.length === 0 || isCalculating}
            className="bg-blue-accent text-blue-accent-foreground hover:bg-blue-accent/90"
          >
            {isCalculating ? "Calculando..." : "Calcular"}
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Requirements Table */}
            <Card className="border-0 bg-blue-accent/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Cotas Requeridas - {getHypothesisExplanation(results.hypothesis).title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.variables.map((variable: any) => (
                    <div key={variable.name} className="grid grid-cols-3 gap-4 p-3 bg-background/50 rounded">
                      <span className="text-sm font-medium">{variable.name}:</span>
                      <div className="text-right">
                        <div className="text-sm flex items-center justify-end gap-1">
                          <FormulaBlock inline latex={String.raw`\Delta^{*} \le`} />
                          <span>{formatNumber(variable.requiredError, locale)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                          <FormulaBlock inline latex={String.raw`\varepsilon^{*} \le`} />
                          <span>{formatNumber(variable.requiredRelativeError * 100, locale)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Effects Pie Chart Simulation */}
            <Card className="border-0 bg-key-lime/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Distribución de Efectos Esperados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.effects.map((effect: any, index: number) => {
                    const colors = ["bg-key-lime", "bg-blue-accent", "bg-chart-3", "bg-chart-4"]
                    return (
                      <div
                        key={effect.variable}
                        className="flex items-center justify-between p-3 bg-background/50 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn("h-3 w-3 rounded-full", colors[index % colors.length])} />
                          <span className="text-sm font-medium">{effect.variable}</span>
                        </div>
                        <span className="text-sm">{effect.percentage.toFixed(1)}%</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Explicación */}
            <Card className="border-0 bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Explicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-1 flex-wrap">
                    <strong>Hipótesis {results.hypothesis}:</strong>
                    {results.hypothesis === "H1" && (
                      <>
                        Todas las variables tienen la misma cota absoluta
                        <FormulaBlock inline latex={String.raw`\Delta^{*}(x_i) = \Delta^{*}_{\mathrm{gen}}`} />
                      </>
                    )}
                    {results.hypothesis === "H2" && (
                      <>
                        Todas las variables tienen el mismo error relativo
                        <FormulaBlock inline latex={String.raw`\varepsilon^{*}(x_i) = \varepsilon^{*}_{\mathrm{gen}}`} />
                      </>
                    )}
                    {results.hypothesis === "H3" && <>Cada variable contribuye por igual al error total</>}
                  </p>

                  <p>
                    <strong>Objetivo:</strong> {isRelativeTarget ? "Error relativo" : "Error absoluto"} ≤{" "}
                    {formatNumber(parseNumber(targetError, locale), locale)}
                    {isRelativeTarget ? "" : " (unidades de la función)"}
                  </p>

                  <p>
                    <strong>Resultado:</strong> Para cumplir el objetivo, cada variable debe medirse con las cotas
                    mostradas arriba. La hipótesis {results.hypothesis} distribuye el "presupuesto de error" de manera{" "}
                    {results.hypothesis === "H1"
                      ? "uniforme en términos absolutos"
                      : results.hypothesis === "H2"
                        ? "uniforme en términos relativos"
                        : "equilibrada por contribución"}
                    .
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
