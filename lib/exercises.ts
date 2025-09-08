// =============================================================================
// 4 ejercicios base con solución “paso a paso” + Sanitizador anti-NaN (sin lookbehind)
// =============================================================================

export interface Exercise {
  id: string
  statement: string
  answer: number
  tolerance: number
  solution: string[]
  type: "direct" | "inverse"
  difficulty: "easy" | "medium" | "hard"
  /** Opcional: otras respuestas consideradas válidas (se validan con la misma tolerancia) */
  altAnswers?: number[]
}

// -------- Utilidades ---------------------------------------------------------
const newId = () => Math.random().toString(36).slice(2, 10)
const fix = (x: number, dp = 6) => Number(x.toFixed(dp))

/** Sanitiza enunciados: borra bloques antiguos, NaN/undefined y normaliza espacios. */
function sanitize(text: string): string {
  let s = (text ?? "").toString()
  s = s.replace(/\n*\s*Par[áa]metros actuales:[\s\S]*$/i, "")
  s = s.replace(/NaN/gi, "").replace(/undefined/gi, "")
  s = s.replace(/\s{2,}/g, " ").replace(/\s+([,.;:])/g, "$1").trim()
  return s
}

// =============================================================================
// EJERCICIO 1 — Directo (R = V/I)  V=12.0 ±0.10 ; I=2.00 ±0.02 → Δ*(R)=0.11 Ω
// =============================================================================
const e1 = (() => {
  const V = 12.0, dV = 0.10, I = 2.00, dI = 0.02
  const R = V / I
  const dRdV = 1 / I
  const dRdI = V / (I * I)
  const effV = Math.abs(dRdV) * dV
  const effI = Math.abs(dRdI) * dI
  const delta = effV + effI

  const statement = sanitize(
    `Calcular la resistencia R = V/I con V = ${V.toFixed(1)} ± ${dV.toFixed(2)} V e I = ${I.toFixed(2)} ± ${dI.toFixed(2)} A. Determinar Δ*(R) y ε*(R).`
  )

  const solution = [
    "Paso 1: Calcular el valor nominal",
    `R = V/I = ${V.toFixed(1)}/${I.toFixed(2)} = ${R.toFixed(2)} Ω`,
    "Paso 2: Calcular las derivadas parciales",
    `∂R/∂V = 1/I = ${dRdV.toFixed(1)} ;  ∂R/∂I = V/I² = ${dRdI.toFixed(1)}`,
    "Paso 3: Calcular los efectos",
    `Efecto de V: |∂R/∂V|·ΔV = ${dRdV.toFixed(1)} × ${dV.toFixed(2)} = ${effV.toFixed(2)}`,
    `Efecto de I: |∂R/∂I|·ΔI = ${dRdI.toFixed(1)} × ${dI.toFixed(2)} = ${effI.toFixed(2)}`,
    "Paso 4: Cota absoluta del error",
    `Δ*(R) = ${effV.toFixed(2)} + ${effI.toFixed(2)} = ${delta.toFixed(2)} Ω`,
    "Paso 5: Error relativo",
    `ε*(R) = Δ*(R)/R = ${delta.toFixed(2)}/${R.toFixed(2)} ≈ ${(delta/R*100).toFixed(2)}%`,
  ]

  return {
    id: `e1-${newId()}`,
    type: "direct" as const,
    difficulty: "easy" as const,
    statement,
    answer: fix(delta, 2),   // 0.11
    tolerance: 0.02,
    solution,
  }
})()

// =============================================================================
// EJERCICIO 2 — Directo (A = ½ b h)   b=48.5 ±0.1 cm ; h=12.8 ±0.1 cm → Δ*(A)=3.065 cm²
// =============================================================================
const e2 = (() => {
  const b = 48.5, db = 0.1, h = 12.8, dh = 0.1
  const A = 0.5 * b * h          // 310.4 cm²
  const dAdb = h / 2              // 6.4
  const dAdh = b / 2              // 24.25
  const effB = Math.abs(dAdb) * db // 0.64
  const effH = Math.abs(dAdh) * dh // 2.425
  const delta = effB + effH        // 3.065

  const statement = sanitize(
    `Para el área A = ½bh con b = ${b.toFixed(1)} ± ${db.toFixed(1)} cm y h = ${h.toFixed(1)} ± ${dh.toFixed(1)} cm, calcular Δ*(A).`
  )

  const solution = [
    "Paso 1: Calcular el valor nominal",
    `A = ½·b·h = ½ × ${b.toFixed(1)} × ${h.toFixed(1)} = ${A.toFixed(3)} cm²`,
    "Paso 2: Calcular las derivadas parciales",
    `∂A/∂b = h/2 = ${dAdb.toFixed(2)} ;  ∂A/∂h = b/2 = ${dAdh.toFixed(2)}`,
    "Paso 3: Calcular los efectos",
    `Efecto de b: ${dAdb.toFixed(2)} × ${db.toFixed(1)} = ${effB.toFixed(3)}`,
    `Efecto de h: ${dAdh.toFixed(2)} × ${dh.toFixed(1)} = ${effH.toFixed(3)}`,
    "Paso 4: Cota absoluta del error",
    `Δ*(A) = ${effB.toFixed(3)} + ${effH.toFixed(3)} = ${delta.toFixed(3)} cm²`,
  ]

  return {
    id: `e2-${newId()}`,
    type: "direct" as const,
    difficulty: "easy" as const,
    statement,
    answer: fix(delta, 3),  // 3.065
    tolerance: 0.06,
    solution,
  }
})()

// =============================================================================
// EJERCICIO 3 — Inverso (R = V/I)  V=12.2 V, I=2.18 A, objetivo Δ*(R) ≤ 0.20
// Acepta como correcto H1 (ΔGen), H2 (εGen) y H3 (ΔV o ΔI)
// =============================================================================
const e3 = (() => {
  const V = 12.2, I = 2.18, target = 0.20
  const R = V / I                            // 5.59633…
  const dRdV = 1 / I                         // 0.458716
  const dRdI = V / (I * I)                   // 2.567124

  const deltaGen_H1 = target / (Math.abs(dRdV) + Math.abs(dRdI)) // 0.066097…
  const epsGen_H2   = target / (2 * R)                           // 0.017869 (1.787%)
  const e = target / 2
  const deltaV_H3 = e / Math.abs(dRdV)       // ≈ 0.2180
  const deltaI_H3 = e / Math.abs(dRdI)       // ≈ 0.0390

  const statement = sanitize(
    // ⬅️ aquí quito la barra y dejo el texto claro
    `Para R = V/I con V = ${V.toFixed(1)} V e I = ${I.toFixed(2)} A, si queremos Δ*(R) ≤ ${target.toFixed(2)}, hallar ΔGen y εGen bajo H1, H2 y H3.`
  )

  // IMPORTANTE: sin delimitadores \[...\] para evitar \] sueltos en el render
  const solution = [
    "Paso 1: Calcular derivadas parciales",
    `R = V/I = ${R.toFixed(3)} Ω ;  ∂R/∂V = 1/I = ${dRdV.toFixed(6)} ;  ∂R/∂I = V/I² = ${dRdI.toFixed(6)}`,
    "Paso 2: Hipótesis H1 (errores absolutos iguales)",
    `ΔGen = Δ*(R) / ( |∂R/∂V| + |∂R/∂I| ) = ${target.toFixed(2)} / (${Math.abs(dRdV).toFixed(6)} + ${Math.abs(dRdI).toFixed(6)}) = ${deltaGen_H1.toFixed(6)}`,
    "Paso 3: Hipótesis H2 (errores relativos iguales)",
    // ⬅️ aquí escapo el porcentaje como \\%
    `εGen = Δ*(R) / (2R) = ${target.toFixed(2)} / (2 · ${R.toFixed(3)}) = ${epsGen_H2.toFixed(6)}  = ${(epsGen_H2*100).toFixed(3)}\\%`,
    "Paso 4: Hipótesis H3 (efectos iguales)",
    `e = Δ*(R)/2 = ${e.toFixed(2)} ;  ΔV = e/|∂R/∂V| = ${deltaV_H3.toFixed(3)} ;  ΔI = e/|∂R/∂I| = ${deltaI_H3.toFixed(3)}`,
  ]

  return {
    id: `e3-${newId()}`,
    type: "inverse" as const,
    difficulty: "medium" as const,
    statement,
    answer: fix(deltaGen_H1, 6),                    // H1: ΔGen
    altAnswers: [                                   // Aceptar también:
      fix(epsGen_H2, 6),                            // H2: εGen
      fix(deltaV_H3, 3),                            // H3: ΔV
      fix(deltaI_H3, 3),                            // H3: ΔI
    ],
    tolerance: 0.001,
    solution,
  }
})()


// =============================================================================
// EJERCICIO 4 — Inverso (V = π r² h)  r=4.8 cm, h=9.7 cm, objetivo ε*(V) ≤ 1.0%
// Acepta como correcto H1 (ΔGen), H2 (εGen) y H3 (Δr o Δh)
// =============================================================================
const e4 = (() => {
  const r = 4.8, h = 9.7
  const V = Math.PI * r * r * h                  // 702.108…
  const dVdr = 2 * Math.PI * r * h               // 292.545…
  const dVdh = Math.PI * r * r                   // 72.382…
  const targetRel = 0.01
  const targetAbs = targetRel * V                // 7.02108…

  const deltaGen_H1 = targetAbs / (Math.abs(dVdr) + Math.abs(dVdh)) // 0.019240
  const epsGen_H2   = targetAbs / (3 * V)                           // 0.003333…
  const e = targetAbs / 2
  const delta_r_H3 = e / Math.abs(dVdr)          // 0.0120
  const delta_h_H3 = e / Math.abs(dVdh)          // 0.0485

  const statement = sanitize(
    `Para V = πr²h con r = ${r.toFixed(1)} cm y h = ${h.toFixed(1)} cm, si queremos ε*(V) ≤ ${(targetRel*100).toFixed(1)}%, determinar las cotas bajo H1, H2 y H3.`
  )

  const solution = [
    "Paso 1: Calcular valor nominal y derivadas",
    `V = π r² h = π·${r.toFixed(1)}²·${h.toFixed(1)} = ${V.toFixed(3)} cm³`,
    `∂V/∂r = 2π r h = ${dVdr.toFixed(3)} ;  ∂V/∂h = π r² = ${dVdh.toFixed(3)}`,
    "Paso 2: Hipótesis H1 (errores absolutos iguales)",
    `ΔGen = 0.01·V / (|∂V/∂r| + |∂V/∂h|) = ${deltaGen_H1.toFixed(6)}`,

    // Paso 3 con LaTeX explícito (queda perfecto y no se auto-transforma)
    String.raw`Paso 3: Hipótesis H2 (errores relativos iguales)`,
    String.raw`\varepsilon_{\text{Gen}} \;=\; \frac{0.01}{3} \;=\; ${epsGen_H2.toFixed(6)} \;\;(\;=\; ${(epsGen_H2*100).toFixed(3)}\%\;)`,

    "Paso 4: Hipótesis H3 (efectos iguales)",
    `e = 0.01·V/2 = ${e.toFixed(6)}  →  Δr = e/|∂V/∂r| = ${delta_r_H3.toFixed(4)} ;  Δh = e/|∂V/∂h| = ${delta_h_H3.toFixed(4)}`,
  ]

  return {
    id: `e4-${newId()}`,
    type: "inverse" as const,
    difficulty: "medium" as const,
    statement,
    answer: fix(deltaGen_H1, 6),               // oficial: H1
    altAnswers: [fix(epsGen_H2, 6), fix(delta_r_H3, 4), fix(delta_h_H3, 4)], // H2+H3
    tolerance: 0.0004,
    solution,
  }
})()


// -------- Export API ---------------------------------------------------------
const BASE = [e1, e2, e3, e4]
export function getAllExercises(): Exercise[] { return BASE }
export function getExercisesByType(type: "direct" | "inverse"): Exercise[] {
  return BASE.filter((ex) => ex.type === type)
}
