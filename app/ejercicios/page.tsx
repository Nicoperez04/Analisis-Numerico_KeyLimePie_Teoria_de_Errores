"use client"

import { useState, useEffect, useMemo } from "react"
import { ExerciseCard } from "@/components/exercise-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Target, Calculator, Shuffle, Trophy, BookOpen, RotateCcw } from "lucide-react"
import {
  getAllExercises,
  getExercisesByType,
  generateRandomExercise,
  type Exercise,
} from "@/lib/exercises"

type Progress = { attempted: number; correct: number }
const PROGRESS_KEY = "an_ejercicios_progress_v1"

export default function EjerciciosPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [activeTab, setActiveTab] = useState("todos")
  const [stats, setStats] = useState<Progress>({ attempted: 0, correct: 0 })

  // ---------- Utilidades de progreso ----------
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY)
      if (saved) setStats(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(stats))
    } catch {}
  }, [stats])

  const handleResult = ({ correct }: { correct: boolean }) => {
    setStats((p) => ({
      attempted: p.attempted + 1,
      correct: p.correct + (correct ? 1 : 0),
    }))
  }

  const resetProgress = () => setStats({ attempted: 0, correct: 0 })

  // ---------- Carga inicial ----------
  useEffect(() => {
    const initial = getAllExercises().slice(0, 4).map((ex) => generateRandomExercise(ex))
    setExercises(initial)
  }, [])

  // ---------- Tabs ----------
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    let filtered: Exercise[]
    switch (value) {
      case "directos":
        filtered = getExercisesByType("direct").slice(0, 2)
        break
      case "inversos":
        filtered = getExercisesByType("inverse").slice(0, 2)
        break
      default:
        filtered = getAllExercises().slice(0, 4)
    }

    // Siempre muestran parámetros aleatorios al entrar a un tab
    setExercises(filtered.map((ex) => generateRandomExercise(ex)))
  }

  // ---------- Generaciones ----------
  // Nuevo ejercicio (otro enunciado del mismo tipo)
  const replaceWithAnother = (exerciseId: string) => {
    setExercises((prev) => {
      const idx = prev.findIndex((e) => e.id === exerciseId)
      if (idx === -1) return prev

      const current = prev[idx]
      const pool = getExercisesByType(current.type)
      // Tomamos uno distinto (si hay más de 1 en el pool)
      const candidates = pool.filter((e) => e.id !== current.id)
      const base = (candidates.length ? candidates : pool)[
        Math.floor(Math.random() * (candidates.length ? candidates.length : pool.length))
      ]
      const randomized = generateRandomExercise(base)

      const next = [...prev]
      next[idx] = randomized
      return next
    })
  }

  // Nuevos parámetros (misma lista de ejercicios visibles)
  const regenerateAllParameters = () => {
    setExercises((prev) => prev.map((ex) => generateRandomExercise(ex)))
  }

  // ---------- Títulos amigables ----------
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

  const friendlyTitle = (ex: Exercise, idx: number) => {
    const typeLabel = ex.type === "direct" ? "Directo" : "Inverso"
    const diff = getDifficultyLabel((ex as any).difficulty ?? "")
    const num = idx + 1
    return `Ejercicio ${typeLabel}${diff ? ` — ${diff}` : ""} (Nº ${num})`
  }

  // ---------- Render ----------
  const totalShown = exercises.length

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-balance">
          <span className="text-key-lime">Ejercicios</span> Autoevaluables
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
          4 ejercicios esenciales: 2 directos (R=V/I, A=½bh) y 2 inversos con tolerancia ±2%
        </p>
      </div>

      {/* Progreso + Controles globales */}
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
                <div className="text-2xl font-bold text-key-lime">{totalShown}</div>
                <div className="text-xs text-muted-foreground">Ejercicios</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-accent">{stats.attempted}</div>
                <div className="text-xs text-muted-foreground">Intentados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
                <div className="text-xs text-muted-foreground">Correctos</div>
              </div>
            </div>
            <div className="mt-3 flex gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={resetProgress} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reiniciar progreso
              </Button>
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
            <Button onClick={regenerateAllParameters} className="w-full bg-transparent" variant="outline">
              <Shuffle className="h-4 w-4 mr-2" />
              Generar Nuevos Parámetros (±10%)
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Cambia los valores numéricos para practicar con diferentes casos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs / categorías */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todos">Todos (4)</TabsTrigger>
          <TabsTrigger value="directos">Directos (2)</TabsTrigger>
          <TabsTrigger value="inversos">Inversos (2)</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Colección Completa</h3>
            <p className="text-muted-foreground">
              Ejercicios de ambos métodos organizados por dificultad creciente
            </p>
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
            <p className="text-muted-foreground">
              Determina las cotas necesarias para cumplir un objetivo de error
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Lista de ejercicios */}
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
              title={friendlyTitle(exercise, index)}  // << título legible
              statement={exercise.statement}
              answer={exercise.answer}
              tolerance={exercise.tolerance}
              solution={exercise.solution}
              onNewRandom={() => replaceWithAnother(exercise.id)} // << ahora sí cambia a otro
              onResult={handleResult} // << actualiza progreso
            />
          </div>
        ))}
      </div>

      {/* Consejos */}
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

