import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, BookOpen, PenTool, Cog, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-balance">
          Propagación de <span className="text-key-lime">Errores</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
          Aprende y practica los métodos directo e inverso para el análisis de propagación de errores en cálculos
          numéricos con herramientas interactivas y ejercicios autoevaluables.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-key-lime text-key-lime-foreground hover:bg-key-lime/90">
            <Link href="/teoria">
              <BookOpen className="mr-2 h-5 w-5" />
              Comenzar con Teoría
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/practica">
              <Calculator className="mr-2 h-5 w-5" />
              Ir a Práctica
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-accent/10 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-blue-accent" />
            </div>
            <CardTitle className="text-lg">Teoría Completa</CardTitle>
            <CardDescription>
              Glosario, fórmulas generales, métodos directo e inverso con ejemplos prácticos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full justify-between">
              <Link href="/teoria">
                Explorar
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-4">
            <div className="h-12 w-12 rounded-xl bg-key-lime/10 flex items-center justify-center mb-4">
              <Calculator className="h-6 w-6 text-key-lime" />
            </div>
            <CardTitle className="text-lg">Calculadoras</CardTitle>
            <CardDescription>
              Herramientas interactivas para métodos directo e inverso con visualizaciones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full justify-between">
              <Link href="/practica">
                Practicar
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-accent/10 flex items-center justify-center mb-4">
              <PenTool className="h-6 w-6 text-blue-accent" />
            </div>
            <CardTitle className="text-lg">Ejercicios</CardTitle>
            <CardDescription>
              Problemas autoevaluables con soluciones paso a paso y generación aleatoria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full justify-between">
              <Link href="/ejercicios">
                Resolver
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-4">
            <div className="h-12 w-12 rounded-xl bg-key-lime/10 flex items-center justify-center mb-4">
              <Cog className="h-6 w-6 text-key-lime" />
            </div>
            <CardTitle className="text-lg">Tecnologías</CardTitle>
            <CardDescription>
              Conoce las herramientas y librerías utilizadas en esta aplicación educativa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full justify-between">
              <Link href="/tecnologias">
                Descubrir
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Section */}
      <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-r from-key-lime/5 to-blue-accent/5">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">¿Nuevo en Propagación de Errores?</CardTitle>
          <CardDescription className="text-lg">
            Te recomendamos seguir este orden de aprendizaje para obtener el máximo provecho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="h-8 w-8 rounded-full bg-key-lime text-key-lime-foreground font-bold flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="font-semibold">Estudia la Teoría</h3>
              <p className="text-sm text-muted-foreground">Comprende los conceptos fundamentales y las fórmulas</p>
            </div>
            <div className="text-center space-y-2">
              <div className="h-8 w-8 rounded-full bg-blue-accent text-blue-accent-foreground font-bold flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="font-semibold">Practica con Calculadoras</h3>
              <p className="text-sm text-muted-foreground">Experimenta con las herramientas interactivas</p>
            </div>
            <div className="text-center space-y-2">
              <div className="h-8 w-8 rounded-full bg-key-lime text-key-lime-foreground font-bold flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="font-semibold">Resuelve Ejercicios</h3>
              <p className="text-sm text-muted-foreground">Pon a prueba tus conocimientos con problemas reales</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
