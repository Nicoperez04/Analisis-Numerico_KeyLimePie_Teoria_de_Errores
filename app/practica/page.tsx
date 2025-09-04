import { DirectCalculator } from "@/components/direct-calculator"
import { InverseCalculator } from "@/components/inverse-calculator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Target, BarChart3 } from "lucide-react"

export default function PracticaPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-balance">
          Laboratorio de <span className="text-key-lime">Práctica</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
          Herramientas interactivas para experimentar con los métodos directo e inverso de propagación de errores
        </p>
      </div>

      {/* Quick Guide */}
      <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-r from-key-lime/5 to-blue-accent/5">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Guía de Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-xl bg-key-lime/10 flex items-center justify-center mx-auto">
                <Calculator className="h-6 w-6 text-key-lime" />
              </div>
              <h3 className="font-semibold">Método Directo</h3>
              <p className="text-sm text-muted-foreground">
                Conoces los errores de las variables de entrada y quieres calcular el error de la función
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-xl bg-blue-accent/10 flex items-center justify-center mx-auto">
                <Target className="h-6 w-6 text-blue-accent" />
              </div>
              <h3 className="font-semibold">Método Inverso</h3>
              <p className="text-sm text-muted-foreground">
                Tienes un objetivo de error para la función y necesitas determinar las cotas de las variables
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-xl bg-chart-3/20 flex items-center justify-center mx-auto">
                <BarChart3 className="h-6 w-6 text-chart-3" />
              </div>
              <h3 className="font-semibold">Análisis Visual</h3>
              <p className="text-sm text-muted-foreground">
                Gráficos de sensibilidad para identificar qué variables tienen mayor impacto
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Direct Calculator */}
      <DirectCalculator />

      {/* Inverse Calculator */}
      <InverseCalculator />

      {/* Tips */}
      <Card className="rounded-2xl border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Consejos Prácticos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-key-lime">Método Directo</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Usa el validador por extremos para verificar la aproximación lineal</li>
                <li>• Observa el gráfico "¿Quién manda?" para identificar variables críticas</li>
                <li>• Prueba diferentes presets para familiarizarte con casos comunes</li>
                <li>• Compara errores absolutos vs relativos según el contexto</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-accent">Método Inverso</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Experimenta con las tres hipótesis para ver diferentes estrategias</li>
                <li>• H2 es generalmente la más práctica para variables de diferentes escalas</li>
                <li>• Considera la factibilidad experimental de las cotas calculadas</li>
                <li>• El gráfico de efectos muestra cómo se distribuye el "presupuesto de error"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
