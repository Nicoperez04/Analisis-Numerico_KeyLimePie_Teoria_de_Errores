"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (elements?: any[]) => Promise<void>
      typesetClear?: (elements?: any[]) => void
    }
  }
}

type Props = {
  latex: string
  inline?: boolean
  className?: string
  ariaLabel?: string
}

// Normaliza marcadores a LaTeX válido
function normalizeLatex(s: string) {
  return s
    .replace(/Δ\*\*\s*\(/g, "\\Delta^{*}(")
    .replace(/ε\*\*\s*\(/g, "\\varepsilon^{*}(")
    .replace(/Δ\*/g, "\\Delta^{*}")
    .replace(/ε\*/g, "\\varepsilon^{*}")
    .replace(/∂/g, "\\partial")
    .trim()
}

export function FormulaBlock({ latex, inline = false, className, ariaLabel }: Props) {
  const ref = useRef<HTMLDivElement | HTMLSpanElement>(null)

  useEffect(() => {
    let cancelled = false

    const typeset = () => {
      const el = ref.current
      const mj = typeof window !== "undefined" ? window.MathJax : undefined
      if (!el) return

      if (mj?.typesetPromise) {
        mj.typesetClear?.([el])
        mj.typesetPromise([el]).catch(() => {})
      } else if (!cancelled) {
        // Reintenta hasta que cargue MathJax
        setTimeout(typeset, 60)
      }
    }

    typeset()
    return () => { cancelled = true }
  }, [latex, inline])

  const tex = normalizeLatex(latex)
  const Wrapper: any = inline ? "span" : "div"
  const content = inline ? `\\(${tex}\\)` : `\\[${tex}\\]`

  return (
    <Wrapper
      ref={ref as any}
      role="img"
      aria-label={ariaLabel || "Fórmula"}
      className={className ?? (inline ? "" : "my-2")}
    >
      {content}
    </Wrapper>
  )
}

export default FormulaBlock

