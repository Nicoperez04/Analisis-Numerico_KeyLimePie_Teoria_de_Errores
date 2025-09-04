"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SensitivityItem {
  name: string
  percent: number
  color?: string
}

interface SensitivityBarsProps {
  items: SensitivityItem[]
  title?: string
  className?: string
}

export function SensitivityBars({ items, title = "Análisis de Sensibilidad", className }: SensitivityBarsProps) {
  // Sort items by percentage in descending order
  const sortedItems = [...items].sort((a, b) => b.percent - a.percent)

  const getBarColor = (index: number) => {
    const colors = ["bg-key-lime", "bg-blue-accent", "bg-chart-3", "bg-chart-4", "bg-chart-5"]
    return colors[index % colors.length]
  }

  return (
    <Card className={cn("rounded-2xl border-0 shadow-lg", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedItems.map((item, index) => (
          <div key={item.name} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">{item.name}</span>
              <span className="text-muted-foreground">{item.percent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={cn("h-2 rounded-full transition-all duration-500", getBarColor(index))}
                style={{ width: `${Math.max(item.percent, 2)}%` }}
              />
            </div>
          </div>
        ))}
        {sortedItems.length === 0 && (
          <div className="text-center text-muted-foreground py-8">No hay datos para mostrar</div>
        )}
      </CardContent>
    </Card>
  )
}
