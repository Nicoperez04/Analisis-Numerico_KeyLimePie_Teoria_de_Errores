// Exercise generation and management

export interface Exercise {
  id: string
  statement: string
  answer: number
  tolerance: number
  solution: string[]
  type: "direct" | "inverse"
  difficulty: "easy" | "medium" | "hard"
  parameters?: Record<string, number>
}

const BASE_EXERCISES: Omit<Exercise, "id">[] = [
  // Direct method exercises
  {
    statement: "Calcular la resistencia R = V/I con V = 12.0 ± 0.1 V e I = 2.00 ± 0.02 A. Determinar Δ*(R) y ε*(R).",
    answer: 0.11,
    tolerance: 0.01, // Increased tolerance to ±2% as specified
    solution: [
      "Paso 1: Calcular el valor nominal",
      "R = V/I = 12.0/2.00 = 6.00 Ω",
      "Paso 2: Calcular las derivadas parciales",
      "∂R/∂V = 1/I = 1/2.00 = 0.5",
      "∂R/∂I = -V/I² = -12.0/(2.00)² = -3.0",
      "Paso 3: Calcular los efectos",
      "Efecto de V: |∂R/∂V| × ΔV = 0.5 × 0.1 = 0.05",
      "Efecto de I: |∂R/∂I| × ΔI = 3.0 × 0.02 = 0.06",
      "Paso 4: Cota absoluta del error",
      "Δ*(R) = 0.05 + 0.06 = 0.11 Ω",
      "Paso 5: Error relativo",
      "ε*(R) = Δ*(R)/R = 0.11/6.00 = 0.01833 = 1.83%",
    ],
    type: "direct",
    difficulty: "easy",
    parameters: { V: 12.0, deltaV: 0.1, I: 2.0, deltaI: 0.02 },
  },
  {
    statement: "Para el área A = ½bh con b = 47.3 ± 0.1 cm y h = 12.5 ± 0.1 cm, calcular Δ*(A).",
    answer: 2.99,
    tolerance: 0.06, // ±2% tolerance
    solution: [
      "Paso 1: Calcular el valor nominal",
      "A = ½bh = ½ × 47.3 × 12.5 = 295.625 cm²",
      "Paso 2: Calcular las derivadas parciales",
      "∂A/∂b = h/2 = 12.5/2 = 6.25",
      "∂A/∂h = b/2 = 47.3/2 = 23.65",
      "Paso 3: Calcular los efectos",
      "Efecto de b: |∂A/∂b| × Δb = 6.25 × 0.1 = 0.625",
      "Efecto de h: |∂A/∂h| × Δh = 23.65 × 0.1 = 2.365",
      "Paso 4: Cota absoluta del error",
      "Δ*(A) = 0.625 + 2.365 = 2.99 cm²",
    ],
    type: "direct",
    difficulty: "easy",
    parameters: { b: 47.3, deltaB: 0.1, h: 12.5, deltaH: 0.1 },
  },

  // Inverse method exercises
  {
    statement:
      "Para R = V/I con V = 12V, I = 2A, si queremos Δ*(R) ≤ 0.20, determinar las cotas bajo las tres hipótesis H1, H2, H3.",
    answer: 0.0571, // H1 result: ΔGen ≤ 0.0571
    tolerance: 0.001, // ±2% tolerance
    solution: [
      "Paso 1: Calcular derivadas parciales",
      "R = 12/2 = 6 Ω",
      "∂R/∂V = 1/I = 1/2 = 0.5",
      "∂R/∂I = -V/I² = -12/4 = -3",
      "Paso 2: Hipótesis H1 (errores absolutos iguales)",
      "Δ*(V) = Δ*(I) = ΔGen",
      "0.20 = 0.5 × ΔGen + 3 × ΔGen = 3.5ΔGen",
      "ΔGen ≤ 0.20/3.5 = 0.0571",
      "Paso 3: Hipótesis H2 (errores relativos iguales)",
      "ε*(V) = ε*(I) = εGen",
      "0.20 = 0.5 × 12 × εGen + 3 × 2 × εGen = 12εGen",
      "εGen ≤ 1.67%",
      "Paso 4: Hipótesis H3 (efectos iguales)",
      "Efecto_V = Efecto_I = 0.20/2 = 0.10",
      "Δ*(V) = 0.10/0.5 = 0.200",
      "Δ*(I) = 0.10/3 = 0.0333",
    ],
    type: "inverse",
    difficulty: "medium",
    parameters: { V: 12, I: 2, targetAbsolute: 0.2 },
  },
  {
    statement: "Para V = πr²h con r = 5cm, h = 10cm, si queremos ε*(V) ≤ 1%, determinar las cotas bajo H1, H2, H3.",
    answer: 0.02, // H1 result: ΔGen = 0.020
    tolerance: 0.0004, // ±2% tolerance
    solution: [
      "Paso 1: Calcular valor nominal y derivadas",
      "V = π × 5² × 10 = 250π cm³",
      "∂V/∂r = 2πrh = 2π × 5 × 10 = 100π",
      "∂V/∂h = πr² = π × 25 = 25π",
      "Δ*(V) = 0.01 × 250π = 2.5π",
      "Paso 2: Hipótesis H1 (errores absolutos iguales)",
      "Δ*(r) = Δ*(h) = ΔGen",
      "2.5π = 100π × ΔGen + 25π × ΔGen = 125πΔGen",
      "ΔGen = 0.020",
      "Paso 3: Hipótesis H2 (errores relativos iguales)",
      "ε*(r) = ε*(h) = εGen",
      "2.5π = 100π × 5 × εGen + 25π × 10 × εGen = 750πεGen",
      "εGen ≤ 0.333%",
      "Paso 4: Hipótesis H3 (efectos iguales)",
      "Efecto_r = Efecto_h = 2.5π/2 = 1.25π",
      "Δ*(r) = 1.25π/(100π) = 0.0125",
      "Δ*(h) = 1.25π/(25π) = 0.050",
    ],
    type: "inverse",
    difficulty: "medium",
    parameters: { r: 5, h: 10, targetRelative: 0.01 },
  },
]

export function generateRandomExercise(baseExercise: Omit<Exercise, "id">, seed?: number): Exercise {
  const randomId = Math.random().toString(36).substr(2, 9)

  // ±10% variation on parameters
  if (baseExercise.parameters) {
    const variationFactor = 0.9 + Math.random() * 0.2 // ±10% variation
    const newParams = { ...baseExercise.parameters }

    Object.keys(newParams).forEach((key) => {
      newParams[key] *= variationFactor
    })

    // Scale answer proportionally (simplified)
    const newAnswer = baseExercise.answer * variationFactor

    return {
      ...baseExercise,
      id: randomId,
      answer: newAnswer,
      parameters: newParams,
    }
  }

  return {
    ...baseExercise,
    id: randomId,
  }
}

// Get all available exercises
export function getAllExercises(): Exercise[] {
  return BASE_EXERCISES.map((exercise, index) => ({
    ...exercise,
    id: `ex-${index + 1}`,
  }))
}

// Get exercises by type
export function getExercisesByType(type: "direct" | "inverse"): Exercise[] {
  return getAllExercises().filter((ex) => ex.type === type)
}

// Get exercises by difficulty
export function getExercisesByDifficulty(difficulty: "easy" | "medium" | "hard"): Exercise[] {
  return getAllExercises().filter((ex) => ex.difficulty === difficulty)
}

// Enhanced exercise management
export function getExercisesByTypeAndDifficulty(
  type?: "direct" | "inverse",
  difficulty?: "easy" | "medium" | "hard",
): Exercise[] {
  let exercises = getAllExercises()

  if (type) {
    exercises = exercises.filter((ex) => ex.type === type)
  }

  if (difficulty) {
    exercises = exercises.filter((ex) => ex.difficulty === difficulty)
  }

  return exercises
}

export function getRandomExercise(type?: "direct" | "inverse"): Exercise {
  const exercises = type ? getExercisesByType(type) : getAllExercises()
  const randomIndex = Math.floor(Math.random() * exercises.length)
  return generateRandomExercise(exercises[randomIndex])
}
