"use client"

import { useState, useEffect } from "react"
import { ExerciseCard } from "@/components/exercise-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Target, Calculator, Trophy, BookOpen, RotateCcw } from "lucide-react"
import { getAllExercises, getExercisesByType, type Exercise } from "@/lib/exercises"

type Progress = { attempted: number; correct: number }
const PROGRESS_KEY = "an_ejercicios_progress_v1"

export default function EjerciciosPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [activeTab, setActiveTab] = useState("todos")
  const [stats, setStats] = useState<Progress>({ attempted: 0, correct: 0 })

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

  const handleResult = ({ correct }: { correct: boolean }) =>
    setStats((p) => ({ attempted: p.attempted + 1, correct: p.correct + (correct ? 1 : 0) }))

  const resetProgress = () => setStats({ attempted: 0, correct: 0 })

  useEffect(() => {
    setExercises(getAllExercises().slice(0, 4))
  }, [])

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
    setExercises(filtered)
  }

  const getDifficultyLabel = (d: string) =>
    d === "easy" ? "Fácil" : d === "medium" ? "Medio" : d === "hard" ? "Difícil" : d

  const friendlyTitle = (ex: Exercise, idx: number) => {
    const typeLabel = ex.type === "direct" ? "Directo" : "Inverso"
    const diff = getDifficultyLabel((ex as any).difficulty ?? "")
    return `Ejercicio ${typeLabel}${diff ? ` — ${diff}` : ""} (Nº ${idx + 1})`
  }

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

      {/* Progreso */}
      <div className="grid md:grid-cols-1 gap-6">
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
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todos">Todos (4)</TabsTrigger>
          <TabsTrigger value="directos">Directos (2)</TabsTrigger>
          <TabsTrigger value="inversos">Inversos (2)</TabsTrigger>
        </TabsList>
        <TabsContent value="todos" />
        <TabsContent value="directos" />
        <TabsContent value="inversos" />
      </Tabs>

      {/* Lista */}
      <div className="space-y-6">
        {exercises.map((ex, idx) => (
          <div key={ex.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">
                  {ex.type === "direct" ? "Directo" : "Inverso"}
                </Badge>
                <Badge className="text-xs bg-muted text-muted-foreground">Tolerancia ±2%</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Ejercicio {idx + 1} de {exercises.length}
              </div>
            </div>

            <ExerciseCard
              id={ex.id}
              title={friendlyTitle(ex, idx)}
              statement={ex.statement}
              answer={ex.answer}
              tolerance={ex.tolerance}
              solution={ex.solution}
              /* nuevo: permitir varias respuestas válidas */
              altAnswers={ex.altAnswers}
              onResult={handleResult}
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
                <li>• La tolerancia permite pequeños errores de redondeo</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
