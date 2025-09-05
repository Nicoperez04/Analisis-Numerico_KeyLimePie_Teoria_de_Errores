"use client"

import { TheoryCard } from "@/components/theory-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Palette, Calculator, BarChart3, FileText, Zap, Layers, Globe, ExternalLink } from "lucide-react"

export default function TecnologiasPage() {
  const technologies = [
    {
      name: "React + Vite",
      category: "Framework Base",
      icon: <Zap className="h-5 w-5 text-blue-500" />,
      description: "Framework de JavaScript para interfaces de usuario con herramientas de desarrollo rápido",
      why: "React permite crear componentes reutilizables y manejar estado de forma eficiente. Vite proporciona desarrollo local ultrarrápido con hot reload instantáneo.",
      integration:
        "Base de toda la aplicación, maneja el estado de calculadoras, ejercicios y configuración de usuario.",
      example: `// Componente React con estado
function Calculator() {
  const [result, setResult] = useState(null)
  return <div>{result}</div>
}`,
      docs: "https://react.dev",
      color: "blue",
    },
    {
      name: "TailwindCSS + shadcn/ui",
      category: "Diseño y Estilos",
      icon: <Palette className="h-5 w-5 text-cyan-500" />,
      description: "Framework CSS utility-first con componentes pre-construidos accesibles y modernos",
      why: "TailwindCSS permite estilos rápidos y consistentes. shadcn/ui proporciona componentes accesibles que siguen las mejores prácticas de diseño.",
      integration:
        "Todos los estilos visuales, desde el layout responsivo hasta los componentes interactivos como botones y tarjetas.",
      example: `// Estilos con Tailwind + componente shadcn
<Card className="rounded-2xl shadow-lg">
  <Button className="bg-key-lime hover:bg-key-lime/90">
    Calcular
  </Button>
</Card>`,
      docs: "https://tailwindcss.com",
      color: "cyan",
    },
    {
      name: "KaTeX",
      category: "Renderizado Matemático",
      icon: <Calculator className="h-5 w-5 text-green-500" />,
      description: "Biblioteca rápida para renderizar notación matemática LaTeX en el navegador",
      why: "Renderizado matemático de alta calidad y velocidad. Esencial para mostrar fórmulas de propagación de errores de forma profesional.",
      integration:
        "Componente FormulaBlock que convierte strings LaTeX en fórmulas matemáticas renderizadas en toda la aplicación.",
      example: `// Renderizado de fórmulas LaTeX
<FormulaBlock 
  latex="\\Delta^*(u) = \\sum_i |\\frac{\\partial f}{\\partial x_i}| \\Delta^*(x_i)"
/>`,
      docs: "https://katex.org",
      color: "green",
    },
    {
      name: "math.js",
      category: "Motor Matemático",
      icon: <Calculator className="h-5 w-5 text-purple-500" />,
      description: "Biblioteca completa para evaluación de expresiones matemáticas y cálculo de derivadas",
      why: "Permite evaluar expresiones matemáticas dinámicas y calcular derivadas parciales automáticamente, esencial para los métodos directo e inverso.",
      integration:
        "Motor de cálculo en las calculadoras, evalúa expresiones personalizadas y calcula derivadas para propagación de errores.",
      example: `// Evaluación y derivadas
import { evaluate, derivative } from 'mathjs'
const result = evaluate('x^2 + y', {x: 3, y: 2})
const deriv = derivative('x^2 + y', 'x')`,
      docs: "https://mathjs.org",
      color: "purple",
    },
    {
      name: "decimal.js",
      category: "Precisión Numérica",
      icon: <Globe className="h-5 w-5 text-orange-500" />,
      description: "Biblioteca para aritmética decimal de precisión arbitraria, evita errores de punto flotante",
      why: "JavaScript tiene limitaciones con números decimales. decimal.js garantiza precisión en cálculos críticos de propagación de errores.",
      integration:
        "Cálculos de alta precisión en las operaciones matemáticas, especialmente importante para cotas de error pequeñas.",
      example: `// Aritmética de precisión
import Decimal from 'decimal.js'
const precise = new Decimal(0.1).plus(0.2)
// Resultado: exactamente 0.3`,
      docs: "https://mikemcl.github.io/decimal.js",
      color: "orange",
    },
    {
      name: "Recharts",
      category: "Visualización",
      icon: <BarChart3 className="h-5 w-5 text-indigo-500" />,
      description: "Biblioteca de gráficos React para crear visualizaciones interactivas y responsivas",
      why: "Visualización clara de sensibilidad y efectos. Los gráficos ayudan a entender qué variables tienen mayor impacto en el error.",
      integration:
        "Componente SensitivityBars para mostrar contribuciones porcentuales y gráficos de distribución de efectos.",
      example: `// Gráfico de barras de sensibilidad
<BarChart data={effects}>
  <Bar dataKey="percentage" fill="#C0F000" />
  <XAxis dataKey="variable" />
</BarChart>`,
      docs: "https://recharts.org",
      color: "indigo",
    },
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
      cyan: "bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-800",
      green: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
      purple: "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800",
      orange: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800",
      indigo: "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800",
      red: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-balance">
          Stack <span className="text-key-lime">Tecnológico</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
          Conoce las herramientas y bibliotecas que hacen posible esta aplicación educativa de propagación de errores
        </p>
      </div>

      {/* Architecture Overview */}
      <TheoryCard title="Arquitectura de la Aplicación" icon={<Layers className="h-5 w-5 text-key-lime" />}>
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            Esta aplicación está construida como una <strong>Single Page Application (SPA)</strong> que funciona
            completamente en el navegador, sin necesidad de servidor backend. Esto garantiza rapidez, disponibilidad
            offline y facilidad de despliegue.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-key-lime/5 rounded-lg border border-key-lime/20">
              <h4 className="font-semibold text-sm mb-2">Capa de Presentación</h4>
              <p className="text-xs text-muted-foreground">
                React + TailwindCSS + shadcn/ui para interfaces responsivas y accesibles
              </p>
            </div>
            <div className="p-4 bg-blue-accent/5 rounded-lg border border-blue-accent/20">
              <h4 className="font-semibold text-sm mb-2">Capa de Lógica</h4>
              <p className="text-xs text-muted-foreground">
                math.js + decimal.js para cálculos precisos de propagación de errores
              </p>
            </div>
            <div className="p-4 bg-chart-3/20 rounded-lg border border-chart-3/40">
              <h4 className="font-semibold text-sm mb-2">Capa de Visualización</h4>
              <p className="text-xs text-muted-foreground">
                KaTeX + Recharts para fórmulas matemáticas y gráficos interactivos
              </p>
            </div>
          </div>
        </div>
      </TheoryCard>

      {/* Technologies Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Tecnologías Utilizadas</h2>

        <div className="grid gap-6">
          {technologies.map((tech, index) => (
            <Card key={index} className={`rounded-2xl border-0 shadow-lg ${getColorClasses(tech.color)}`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-background/50 flex items-center justify-center">
                      {tech.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tech.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {tech.category}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={tech.docs} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">{tech.description}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">¿Por qué esta tecnología?</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tech.why}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Integración en la app</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tech.integration}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Ejemplo de uso
                  </h4>
                  <div className="bg-background/50 rounded-lg p-3 border">
                    <pre className="text-xs font-mono overflow-x-auto">
                      <code>{tech.example}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Integration Benefits */}
      <TheoryCard title="Beneficios de la Integración" icon={<Zap className="h-5 w-5 text-blue-accent" />}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-key-lime">Ventajas Técnicas</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong>Rendimiento:</strong> Vite + React ofrecen desarrollo y carga ultrarrápidos
              </li>
              <li>
                • <strong>Precisión:</strong> decimal.js elimina errores de punto flotante críticos
              </li>
              <li>
                • <strong>Accesibilidad:</strong> shadcn/ui garantiza componentes inclusivos
              </li>
              <li>
                • <strong>Mantenibilidad:</strong> Arquitectura modular y componentes reutilizables
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-blue-accent">Ventajas Educativas</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong>Visualización:</strong> Fórmulas LaTeX y gráficos interactivos
              </li>
              <li>
                • <strong>Interactividad:</strong> Calculadoras en tiempo real para experimentación
              </li>
              <li>
                • <strong>Portabilidad:</strong> Funciona offline, ideal para aulas sin internet
              </li>
              <li>
                • <strong>Escalabilidad:</strong> Fácil agregar nuevos ejercicios y funcionalidades
              </li>
            </ul>
          </div>
        </div>
      </TheoryCard>

      {/* Development Info */}
      <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-r from-key-lime/5 to-blue-accent/5">
        <CardHeader>
          <CardTitle className="text-xl text-center">Información de Desarrollo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-key-lime">100%</div>
              <div className="text-sm text-muted-foreground">Cliente (Sin servidor)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-accent">7</div>
              <div className="text-sm text-muted-foreground">Tecnologías principales</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-chart-3">TypeScript</div>
              <div className="text-sm text-muted-foreground">Tipado estático</div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Desarrollado por el equipo <strong className="text-key-lime">Key Lime Pie</strong> para el curso de
              Análisis Numérico
            </p>
            <p className="text-xs text-muted-foreground">
              Código fuente disponible bajo licencia educativa • Optimizado para aprendizaje interactivo
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
