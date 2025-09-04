// Mathematical engine for error propagation calculations

export interface Variable {
  name: string
  value: number
  absoluteError: number
}

export interface DirectResult {
  value: number
  absoluteError: number
  relativeError: number
  interval: [number, number]
  effects: Array<{
    variable: string
    partialDerivative: number
    effect: number
    percentage: number
  }>
}

export interface InverseResult {
  hypothesis: "H1" | "H2" | "H3"
  targetError: number
  isRelative: boolean
  variables: Array<{
    name: string
    requiredError: number
    requiredRelativeError: number
  }>
  effects: Array<{
    variable: string
    effect: number
    percentage: number
  }>
}

// Preset functions for common formulas
export const PRESET_FUNCTIONS = {
  "R=V/I": {
    formula: "V/I",
    variables: ["V", "I"],
    latex: "R = \\frac{V}{I}",
    description: "Resistencia eléctrica",
  },
  "V=πr²h": {
    formula: "PI * r^2 * h",
    variables: ["r", "h"],
    latex: "V = \\pi r^2 h",
    description: "Volumen de cilindro",
  },
  "ρ=m/V": {
    formula: "m/V",
    variables: ["m", "V"],
    latex: "\\rho = \\frac{m}{V}",
    description: "Densidad",
  },
  "A=½bh": {
    formula: "0.5 * b * h",
    variables: ["b", "h"],
    latex: "A = \\frac{1}{2}bh",
    description: "Área de triángulo",
  },
}

// Simple expression evaluator (placeholder for math.js)
export function evaluateExpression(expression: string, variables: Record<string, number>): number {
  try {
    // Replace variable names with their values
    let expr = expression
    for (const [name, value] of Object.entries(variables)) {
      expr = expr.replace(new RegExp(`\\b${name}\\b`, "g"), value.toString())
    }

    // Replace PI with Math.PI
    expr = expr.replace(/\bPI\b/g, Math.PI.toString())

    // Simple evaluation (in real implementation, use math.js)
    return Function(`"use strict"; return (${expr})`)()
  } catch (error) {
    console.error("Error evaluating expression:", error)
    return 0
  }
}

// Numerical partial derivative calculation
export function partialDerivative(
  expression: string,
  variables: Record<string, number>,
  variableName: string,
  h = 1e-8,
): number {
  const originalValue = variables[variableName]

  // f(x + h)
  const variablesPlus = { ...variables, [variableName]: originalValue + h }
  const fPlus = evaluateExpression(expression, variablesPlus)

  // f(x - h)
  const variablesMinus = { ...variables, [variableName]: originalValue - h }
  const fMinus = evaluateExpression(expression, variablesMinus)

  // Central difference: (f(x+h) - f(x-h)) / (2h)
  return (fPlus - fMinus) / (2 * h)
}

// Direct method calculation
export function calculateDirect(expression: string, variables: Variable[]): DirectResult {
  // Create variables object
  const varValues: Record<string, number> = {}
  variables.forEach((v) => {
    varValues[v.name] = v.value
  })

  // Calculate function value
  const value = evaluateExpression(expression, varValues)

  // Calculate effects for each variable
  const effects = variables.map((variable) => {
    const partialDeriv = partialDerivative(expression, varValues, variable.name)
    const effect = Math.abs(partialDeriv) * variable.absoluteError

    return {
      variable: variable.name,
      partialDerivative: partialDeriv,
      effect,
      percentage: 0, // Will be calculated after total
    }
  })

  // Calculate total absolute error
  const absoluteError = effects.reduce((sum, effect) => sum + effect.effect, 0)

  // Calculate percentages
  effects.forEach((effect) => {
    effect.percentage = absoluteError > 0 ? (effect.effect / absoluteError) * 100 : 0
  })

  // Calculate relative error
  const relativeError = Math.abs(value) > 0 ? absoluteError / Math.abs(value) : 0

  // Calculate interval
  const interval: [number, number] = [value - absoluteError, value + absoluteError]

  return {
    value,
    absoluteError,
    relativeError,
    interval,
    effects,
  }
}

// Inverse method calculation
export function calculateInverse(
  expression: string,
  variables: Variable[],
  targetError: number,
  isRelative: boolean,
  hypothesis: "H1" | "H2" | "H3",
): InverseResult {
  // Create variables object
  const varValues: Record<string, number> = {}
  variables.forEach((v) => {
    varValues[v.name] = v.value
  })

  // Calculate function value and partial derivatives
  const functionValue = evaluateExpression(expression, varValues)
  const partialDerivatives = variables.map((variable) => ({
    name: variable.name,
    value: variable.value,
    partialDerivative: partialDerivative(expression, varValues, variable.name),
  }))

  // Convert relative target to absolute if needed
  const absoluteTarget = isRelative ? targetError * Math.abs(functionValue) : targetError

  let resultVariables: Array<{
    name: string
    requiredError: number
    requiredRelativeError: number
  }> = []

  switch (hypothesis) {
    case "H1": // Equal absolute errors
      {
        const sumAbsPartials = partialDerivatives.reduce((sum, pd) => sum + Math.abs(pd.partialDerivative), 0)
        const commonAbsoluteError = sumAbsPartials > 0 ? absoluteTarget / sumAbsPartials : 0

        resultVariables = partialDerivatives.map((pd) => ({
          name: pd.name,
          requiredError: commonAbsoluteError,
          requiredRelativeError: Math.abs(pd.value) > 0 ? commonAbsoluteError / Math.abs(pd.value) : 0,
        }))
      }
      break

    case "H2": // Equal relative errors
      {
        const sumWeightedPartials = partialDerivatives.reduce(
          (sum, pd) => sum + Math.abs(pd.partialDerivative * pd.value),
          0,
        )
        const commonRelativeError = sumWeightedPartials > 0 ? absoluteTarget / sumWeightedPartials : 0

        resultVariables = partialDerivatives.map((pd) => ({
          name: pd.name,
          requiredError: commonRelativeError * Math.abs(pd.value),
          requiredRelativeError: commonRelativeError,
        }))
      }
      break

    case "H3": // Equal effects
      {
        const commonEffect = absoluteTarget / variables.length

        resultVariables = partialDerivatives.map((pd) => {
          const requiredError = Math.abs(pd.partialDerivative) > 0 ? commonEffect / Math.abs(pd.partialDerivative) : 0

          return {
            name: pd.name,
            requiredError,
            requiredRelativeError: Math.abs(pd.value) > 0 ? requiredError / Math.abs(pd.value) : 0,
          }
        })
      }
      break
  }

  // Calculate effects for visualization
  const effects = resultVariables.map((rv) => {
    const pd = partialDerivatives.find((p) => p.name === rv.name)
    const effect = pd ? Math.abs(pd.partialDerivative) * rv.requiredError : 0

    return {
      variable: rv.name,
      effect,
      percentage: absoluteTarget > 0 ? (effect / absoluteTarget) * 100 : 0,
    }
  })

  return {
    hypothesis,
    targetError: absoluteTarget,
    isRelative,
    variables: resultVariables,
    effects,
  }
}

// Extremes validation by sampling
export function validateByExtremes(
  expression: string,
  variables: Variable[],
  predictedInterval: [number, number],
  maxSamples = 128,
): {
  min: number
  max: number
  isCoherent: boolean
  samplesUsed: number
} {
  const n = variables.length
  const samples: Array<Record<string, number>> = []

  if (n <= 6) {
    // Generate all combinations for small n
    const combinations = Math.pow(2, n)
    for (let i = 0; i < combinations; i++) {
      const sample: Record<string, number> = {}
      variables.forEach((variable, index) => {
        const bit = (i >> index) & 1
        sample[variable.name] =
          bit === 0 ? variable.value - variable.absoluteError : variable.value + variable.absoluteError
      })
      samples.push(sample)
    }
  } else {
    // Random sampling for large n
    for (let i = 0; i < maxSamples; i++) {
      const sample: Record<string, number> = {}
      variables.forEach((variable) => {
        const sign = Math.random() < 0.5 ? -1 : 1
        sample[variable.name] = variable.value + sign * variable.absoluteError
      })
      samples.push(sample)
    }
  }

  // Evaluate function at all sample points
  const values = samples.map((sample) => evaluateExpression(expression, sample))

  const min = Math.min(...values)
  const max = Math.max(...values)

  // Check coherence: does the sampled interval fall within the predicted interval?
  const isCoherent = min >= predictedInterval[0] && max <= predictedInterval[1]

  return {
    min,
    max,
    isCoherent,
    samplesUsed: samples.length,
  }
}
