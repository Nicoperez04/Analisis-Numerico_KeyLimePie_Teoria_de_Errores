import { TheoryCard } from "@/components/theory-card"
import { FormulaBlock } from "@/components/formula-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calculator, ArrowRight, ArrowLeft, AlertTriangle, Lightbulb, Target, Zap } from "lucide-react"

const L = String.raw

export default function TeoriaPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-balance">
          Teoría de <span className="text-key-lime">Propagación de Errores</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
          Fundamentos teóricos, métodos de cálculo y herramientas prácticas para el análisis de propagación de errores
        </p>
      </div>

      {/* Glosario */}
      <TheoryCard title="Glosario de Términos" icon={<BookOpen className="h-5 w-5 text-key-lime" />}>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Valor exacto (α)</h4>
              <p className="text-sm text-muted-foreground">El valor verdadero e inalcanzable de una magnitud física.</p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Aproximación (a)</h4>
              <p className="text-sm text-muted-foreground">
                Valor calculado o medido que se usa en lugar del valor exacto.
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Error absoluto</h4>
              <FormulaBlock latex={L`\Delta(a) = |\alpha - a|`} inline />
              <p className="text-sm text-muted-foreground mt-2">
                Diferencia absoluta entre el valor exacto y la aproximación.
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Cota absoluta</h4>
              <FormulaBlock latex={L`\Delta^*(a)`} inline />
              <p className="text-sm text-muted-foreground mt-2">Límite superior conocido del error absoluto.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Intervalo de confianza</h4>
              <FormulaBlock latex={L`\alpha \in [a - \Delta^*(a),\, a + \Delta^*(a)]`} inline />
              <p className="text-sm text-muted-foreground mt-2">Rango donde se encuentra el valor exacto.</p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Error relativo</h4>
              <FormulaBlock latex={L`\varepsilon(a) = \frac{|\alpha - a|}{|\alpha|}`} inline />
              <p className="text-sm text-muted-foreground mt-2">Error absoluto como fracción del valor exacto.</p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Cota relativa</h4>
              <FormulaBlock latex={L`\varepsilon^*(a) = \frac{\Delta^*(a)}{|a|}`} inline />
              <p className="text-sm text-muted-foreground mt-2">Límite superior del error relativo.</p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Sensibilidad y Efecto</h4>
              <FormulaBlock
                latex={L`\left|\frac{\partial f}{\partial x_i}\right| \text{ y } \left|\frac{\partial f}{\partial x_i}\right| \Delta^*(x_i)`}
                inline
              />
              <p className="text-sm text-muted-foreground mt-2">Derivada parcial y su contribución al error total.</p>
            </div>
          </div>
        </div>
      </TheoryCard>

      {/* Fórmula General */}
      <TheoryCard title="Fórmula General de Propagación" icon={<Target className="h-5 w-5 text-blue-accent" />}>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Para una función u = f(x₁, x₂, ..., xₙ):</h4>
            <div className="bg-blue-accent/5 p-6 rounded-xl border border-blue-accent/20">
              <FormulaBlock
                latex={L`\Delta^*(u) = \sum_{i=1}^{n} \left|\frac{\partial f}{\partial x_i}\right| \Delta^*(x_i)`}
              />
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Error relativo:</h4>
            <div className="bg-key-lime/5 p-6 rounded-xl border border-key-lime/20">
              <FormulaBlock latex={L`\varepsilon^*(u) = \frac{\Delta^*(u)}{|u|}`} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h5 className="font-medium mb-2">Donde:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  • <FormulaBlock latex={L`\frac{\partial f}{\partial x_i}`} inline /> es la derivada parcial
                </li>
                <li>
                  • <FormulaBlock latex={L`\Delta^*(x_i)`} inline /> es la cota absoluta de cada variable
                </li>
                <li>• La suma representa el peor caso posible</li>
              </ul>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h5 className="font-medium mb-2">Interpretación:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Cada término es un "efecto" individual</li>
                <li>• La sensibilidad amplifica el error de entrada</li>
                <li>• El resultado es conservador (pesimista)</li>
              </ul>
            </div>
          </div>
        </div>
      </TheoryCard>

      {/* Método Directo */}
      <TheoryCard title="Método Directo" icon={<ArrowRight className="h-5 w-5 text-key-lime" />}>
        <div className="space-y-6">
          <div className="bg-key-lime/5 p-6 rounded-xl border border-key-lime/20">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Receta en 3 pasos
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="h-8 w-8 rounded-full bg-key-lime text-key-lime-foreground font-bold flex items-center justify-center mx-auto">
                  1
                </div>
                <h5 className="font-medium text-sm">Calcular u = f(x₁, ..., xₙ)</h5>
                <p className="text-xs text-muted-foreground">Evaluar la función en los valores nominales</p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-8 w-8 rounded-full bg-key-lime text-key-lime-foreground font-bold flex items-center justify-center mx-auto">
                  2
                </div>
                <h5 className="font-medium text-sm">Calcular ∂f/∂xᵢ</h5>
                <p className="text-xs text-muted-foreground">Derivadas parciales en el punto nominal</p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-8 w-8 rounded-full bg-key-lime text-key-lime-foreground font-bold flex items-center justify-center mx-auto">
                  3
                </div>
                <h5 className="font-medium text-sm">Aplicar fórmula</h5>
                <p className="text-xs text-muted-foreground">Sumar todos los efectos individuales</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Reglas de bolsillo para operaciones comunes:</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-0 bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Suma y Resta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <FormulaBlock latex={L`\Delta^*(x \pm y) = \Delta^*(x) + \Delta^*(y)`} />
                  <p className="text-xs text-muted-foreground">Los errores absolutos se suman</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Producto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <FormulaBlock latex={L`\varepsilon^*(xy) = \varepsilon^*(x) + \varepsilon^*(y)`} />
                  <p className="text-xs text-muted-foreground">Los errores relativos se suman</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Cociente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <FormulaBlock latex={L`\varepsilon^*(x/y) = \varepsilon^*(x) + \varepsilon^*(y)`} />
                  <p className="text-xs text-muted-foreground">Igual que el producto</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Potencia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <FormulaBlock latex={L`\varepsilon^*(x^p) \approx |p| \varepsilon^*(x)`} />
                  <p className="text-xs text-muted-foreground">El exponente amplifica el error</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </TheoryCard>

      {/* Método Inverso */}
      <TheoryCard title="Método Inverso" icon={<ArrowLeft className="h-5 w-5 text-blue-accent" />}>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Ecuación madre:</h4>
            <div className="bg-blue-accent/5 p-6 rounded-xl border border-blue-accent/20">
              <FormulaBlock
                latex={L`\Delta^*_f = \sum_{i=1}^{n} \left|\frac{\partial f}{\partial x_i}\right| \Delta^*(x_i)`}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Dado un objetivo Δ*_f o ε*_f, determinar las cotas Δ*(xᵢ) necesarias en las variables de entrada.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Hipótesis de reparto:</h4>
            <div className="grid gap-4">
              <Card className="border-0 bg-gradient-to-r from-key-lime/5 to-transparent">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Badge variant="secondary" className="bg-key-lime/20 text-key-lime-foreground">
                      H1
                    </Badge>
                    Errores absolutos iguales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <FormulaBlock
                    latex={L`\Delta^*(x_i) = \Delta^*_{Gen} = \frac{\Delta^*_f}{\sum_j |\partial f/\partial x_j|}`}
                  />
                  <p className="text-xs text-muted-foreground">
                    Todas las variables tienen la misma cota absoluta. Útil cuando las variables tienen magnitudes
                    similares.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-r from-blue-accent/5 to-transparent">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-accent/20 text-blue-accent-foreground">
                      H2
                    </Badge>
                    Errores relativos iguales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <FormulaBlock latex={L`\varepsilon^*(x_i) = \varepsilon^*_{Gen}`} />
                  <p className="text-xs text-muted-foreground">
                    Todas las variables tienen el mismo error relativo. Recomendado cuando las variables tienen órdenes
                    de magnitud diferentes.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-r from-chart-3/20 to-transparent">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Badge variant="secondary" className="bg-chart-3/20">
                      H3
                    </Badge>
                    Efectos iguales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <FormulaBlock
                    latex={L`\left|\frac{\partial f}{\partial x_i}\right| \Delta^*(x_i) = \frac{\Delta^*_f}{n}`}
                  />
                  <p className="text-xs text-muted-foreground">
                    Cada variable contribuye por igual al error total. Útil para análisis de sensibilidad equilibrado.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </TheoryCard>

      {/* Recetario */}
      <TheoryCard title="Recetario de Fórmulas" icon={<Calculator className="h-5 w-5 text-key-lime" />}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-blue-accent">Operaciones Básicas</h4>
            <div className="space-y-3">
              <div className="p-3 bg-muted/30 rounded-lg">
                <FormulaBlock latex={L`\Delta^*(x + y) = \Delta^*(x) + \Delta^*(y)`} />
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <FormulaBlock latex={L`\Delta^*(x - y) = \Delta^*(x) + \Delta^*(y)`} />
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <FormulaBlock latex={L`\varepsilon^*(xy) = \varepsilon^*(x) + \varepsilon^*(y)`} />
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <FormulaBlock latex={L`\varepsilon^*(x/y) = \varepsilon^*(x) + \varepsilon^*(y)`} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-blue-accent">Funciones Especiales</h4>
            <div className="space-y-3">
              <div className="p-3 bg-muted/30 rounded-lg">
                <FormulaBlock latex={L`\varepsilon^*(x^n) = |n| \varepsilon^*(x)`} />
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <FormulaBlock latex={L`\varepsilon^*(\sqrt{x}) = \frac{1}{2} \varepsilon^*(x)`} />
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <FormulaBlock latex={L`\Delta^*(\ln x) = \frac{\Delta^*(x)}{|x|}`} />
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <FormulaBlock latex={L`\Delta^*(e^x) = e^x \Delta^*(x)`} />
              </div>
            </div>
          </div>
        </div>
      </TheoryCard>

      {/* Trampas Comunes */}
      <TheoryCard title="Trampas y Precauciones" icon={<AlertTriangle className="h-5 w-5 text-red-500" />}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Cancelación Catastrófica
              </h5>
              <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                En operaciones como x - y donde x ≈ y, el error relativo se amplifica enormemente.
              </p>
              <FormulaBlock latex={L`\varepsilon^*(x-y) = \frac{\Delta^*(x) + \Delta^*(y)}{|x-y|}`} />
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <h5 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Denominadores Pequeños</h5>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                En f = g/h, si h es pequeño, el error se amplifica significativamente.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">No Linealidad</h5>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Las fórmulas lineales son aproximaciones. Para errores grandes, usar métodos de Monte Carlo.
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Correlaciones</h5>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Si las variables están correlacionadas, la fórmula estándar sobreestima el error.
              </p>
            </div>
          </div>
        </div>
      </TheoryCard>
    </div>
  )
}
