import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TheoryCardProps {
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export function TheoryCard({ title, children, icon, className }: TheoryCardProps) {
  return (
    <Card className={cn("rounded-2xl border-0 shadow-lg", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          {icon && <div className="h-10 w-10 rounded-xl bg-key-lime/10 flex items-center justify-center">{icon}</div>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 leading-relaxed">{children}</CardContent>
    </Card>
  )
}
