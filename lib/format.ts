// Utility functions for number formatting and decimal locale handling

export type DecimalLocale = "ES" | "EN"

export function getDecimalLocale(): DecimalLocale {
  if (typeof window === "undefined") return "ES"
  return (localStorage.getItem("decimal-locale") as DecimalLocale) || "ES"
}

export function formatNumber(value: number, locale: DecimalLocale = getDecimalLocale(), decimals?: number): string {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals ?? 6,
  }

  if (locale === "ES") {
    return value.toLocaleString("es-ES", options)
  } else {
    return value.toLocaleString("en-US", options)
  }
}

export function parseNumber(value: string, locale: DecimalLocale = getDecimalLocale()): number {
  if (!value) return 0

  // Remove spaces and handle locale-specific decimal separators
  let cleanValue = value.replace(/\s/g, "")

  if (locale === "ES") {
    // Convert comma to dot for parsing
    cleanValue = cleanValue.replace(",", ".")
  }

  return Number.parseFloat(cleanValue) || 0
}

export function formatScientific(value: number, locale: DecimalLocale = getDecimalLocale()): string {
  const formatted = value.toExponential(3)

  if (locale === "ES") {
    return formatted.replace(".", ",")
  }

  return formatted
}

export function roundToSignificantFigures(value: number, figures: number): number {
  if (value === 0) return 0

  const magnitude = Math.floor(Math.log10(Math.abs(value)))
  const factor = Math.pow(10, figures - 1 - magnitude)

  return Math.round(value * factor) / factor
}
