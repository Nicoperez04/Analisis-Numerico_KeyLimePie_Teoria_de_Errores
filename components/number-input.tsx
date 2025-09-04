"use client"

import { useState, useEffect } from "react"

type Props = {
  value?: number | null
  onChange: (num: number | null) => void
  placeholder?: string
  className?: string
}

function parseLocaleNumber(s: string): number | null {
  if (s.trim() === "" || s === "-" || s === "." || s === ",") return null
  const normalized = s.replace(/\s/g, "").replace(",", ".")
  const n = Number(normalized)
  return Number.isFinite(n) ? n : null
}

export default function NumberInput({ value, onChange, placeholder, className }: Props) {
  const [raw, setRaw] = useState<string>((value ?? value === 0) ? String(value).replace(".", ",") : "")

  useEffect(() => {
    if (value === null || value === undefined) setRaw("")
    else setRaw(String(value).replace(".", ","))
  }, [value])

  return (
    <input
      inputMode="decimal"
      pattern="[0-9]*[.,]?[0-9]*"
      value={raw}
      onChange={(e) => {
        const v = e.target.value
        setRaw(v) // Allows 0, -, ., , and commas while typing
        const num = parseLocaleNumber(v)
        onChange(num)
      }}
      placeholder={placeholder}
      className={className || "w-full rounded-md border px-3 py-2"}
    />
  )
}
