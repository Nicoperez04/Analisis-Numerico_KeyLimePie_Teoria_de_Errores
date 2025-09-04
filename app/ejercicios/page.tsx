"use client"

import { useState, useEffect } from "react"
import { ExerciseCard } from "@/components/exercise-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Target, Calculator, Shuffle, Trophy, BookOpen } from "lucide-react"
import { getAllExercises, getExercisesByType, generateRandomExercise, type Exercise } from "@/lib/exercises"

export default function EjerciciosPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [activeTab, setActiveTab] = useState("todos")
  const [stats, setStats] = useState({
    completed: 0,
    correct: 0,
    total: 0,
  })

  useEffect(() => {
    const allExercises = getAllExercises().slice(0, 4) // Limit to the first 4 exercises
    setExercises(allExercises)
    setStats((prev) => ({ ...prev, total: allExercises.length }))
  }, [])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    let filteredExercises: Exercise[]

    switch (value) {
      case "directos":
        filteredExercises = getExercisesByType("direct").slice(0, 2) // Limit to the first 2 direct exercises
        break
      case "inversos":
        filteredExercises = getExercisesByType("inverse").slice(0, 2) // Limit to the first 2 inverse exercises
        break
      default:
        filteredExercises = getAllExercises().slice(0, 4) // Limit to the first 4 exercises
    }

    setExercises(filteredExercises)
  }

  const generateNewExercise = (exerciseId: string) => {
    const currentExercise = exercises.find((ex) => ex.id === exerciseId)
    if (!currentExercise) return

    const newExercise = generateRandomExercise(currentExercise)
    setExercises((prev) => prev.map((ex) => (ex.id === exerciseId ? newExercise : ex)))
  }

  const generateAllRandom = () => {
    const newExercises = exercises.map((exercise) => generateRandomExercise(exercise))
    setExercises(newExercises)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Fácil"
      case "medium":
        return "Medio"
      case "hard":
        return "Difícil"
      default:
        return difficulty
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-balance">
          <span className="text-key-lime">Ejercicios</span> Autoevaluables
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
          4 ejercicios esenciales: 2 directos (R=V/I, A=½bh) y 2 inversos con tolerancia ±2%
        </p>
      </div>

      {/* Stats and Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Progreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-key-lime">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Ejercicios</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-accent">{stats.completed}</div>
                <div className="text-xs text-muted-foreground">Intentados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
                <div className="text-xs text-muted-foreground">Correctos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shuffle className="h-5 w-5 text-blue-accent" />
              Generación Aleatoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={generateAllRandom} className="w-full bg-transparent" variant="outline">
              <Shuffle className="h-4 w-4 mr-2" />
              Generar Nuevos Parámetros (±10%)
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Cambia los valores numéricos para practicar con diferentes casos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Exercise Categories */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todos">Todos (4)</TabsTrigger>
          <TabsTrigger value="directos">Directos (2)</TabsTrigger>
          <TabsTrigger value="inversos">Inversos (2)</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Colección Completa</h3>
            <p className="text-muted-foreground">Ejercicios de ambos métodos organizados por dificultad creciente</p>
          </div>
        </TabsContent>

        <TabsContent value="directos" className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
              <Calculator className="h-5 w-5 text-key-lime" />
              Método Directo
            </h3>
            <p className="text-muted-foreground">
              Calcula el error de la función conociendo los errores de las variables
            </p>
          </div>
        </TabsContent>

        <TabsContent value="inversos" className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
              <Target className="h-5 w-5 text-blue-accent" />
              Método Inverso
            </h3>
            <p className="text-muted-foreground">Determina las cotas necesarias para cumplir un objetivo de error</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Exercises Grid */}
      <div className="space-y-6">
        {exercises.map((exercise, index) => (
          <div key={exercise.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">
                  {exercise.type === "direct" ? "Directo" : "Inverso"}
                </Badge>
                <Badge className="text-xs bg-muted text-muted-foreground">Tolerancia ±2%</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Ejercicio {index + 1} de {exercises.length}
              </div>
            </div>
            <ExerciseCard
              id={exercise.id}
              statement={exercise.statement}
              answer={exercise.answer}
              tolerance={exercise.tolerance}
              solution={exercise.solution}
              onNewRandom={() => generateNewExercise(exercise.id)}
            />
          </div>
        ))}
      </div>

      {/* Study Tips */}
      <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-r from-key-lime/5 to-blue-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-5 w-5" />
            Consejos de Estudio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-key-lime">Estrategia de Resolución</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Lee cuidadosamente el enunciado e identifica las variables</li>
                <li>• Determina si es método directo o inverso</li>
                <li>• Aplica las fórmulas paso a paso</li>
                <li>• Verifica que las unidades sean consistentes</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-accent">Uso de la Herramienta</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Usa coma decimal si tienes configuración ES</li>
                <li>• Revisa la solución paso a paso si te equivocas</li>
                <li>• Genera nuevos parámetros para más práctica</li>
                <li>• La tolerancia permite pequeños errores de redondeo</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
