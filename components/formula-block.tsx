"use client"

type Props = {
  latex: string
  inline?: boolean
  className?: string
  ariaLabel?: string
}

export function FormulaBlock({ latex, inline = false, className, ariaLabel }: Props) {
  // Convert common LaTeX symbols to Unicode equivalents
  const convertLatexToUnicode = (latex: string): string => {
    return latex
      .replace(/\\Delta/g, "Δ")
      .replace(/\\delta/g, "δ")
      .replace(/\\varepsilon/g, "ε")
      .replace(/\\epsilon/g, "ε")
      .replace(/\\alpha/g, "α")
      .replace(/\\beta/g, "β")
      .replace(/\\gamma/g, "γ")
      .replace(/\\pi/g, "π")
      .replace(/\\sum/g, "∑")
      .replace(/\\int/g, "∫")
      .replace(/\\partial/g, "∂")
      .replace(/\\infty/g, "∞")
      .replace(/\\pm/g, "±")
      .replace(/\\times/g, "×")
      .replace(/\\div/g, "÷")
      .replace(/\\leq/g, "≤")
      .replace(/\\geq/g, "≥")
      .replace(/\\neq/g, "≠")
      .replace(/\\approx/g, "≈")
      .replace(/\\sqrt{([^}]+)}/g, "√($1)")
      .replace(/\\frac{([^}]+)}{([^}]+)}/g, "($1)/($2)")
      .replace(/\\left\|/g, "|")
      .replace(/\\right\|/g, "|")
      .replace(/\\left\(/g, "(")
      .replace(/\\right\)/g, ")")
      .replace(/\\left\[/g, "[")
      .replace(/\\right\]/g, "]")
      .replace(/\\\\/g, " ")
      .replace(/\\,/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  }

  const displayText = convertLatexToUnicode(latex)

  if (inline) {
    return (
      <span
        role="img"
        aria-label={ariaLabel || "Fórmula"}
        className={`font-mono text-sm bg-muted/50 px-2 py-1 rounded border ${className || ""}`}
      >
        {displayText}
      </span>
    )
  }

  return (
    <div
      role="img"
      aria-label={ariaLabel || "Fórmula"}
      className={`font-mono text-center p-4 bg-muted/30 rounded-lg border text-lg ${className || "overflow-x-auto my-2"}`}
    >
      {displayText}
    </div>
  )
}

export default FormulaBlock
