"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LocaleToggle() {
  const [locale, setLocale] = useState<"ES" | "EN">("ES")

  useEffect(() => {
    const savedLocale = localStorage.getItem("decimal-locale") as "ES" | "EN"
    if (savedLocale) {
      setLocale(savedLocale)
    }
  }, [])

  const toggleLocale = () => {
    const newLocale = locale === "ES" ? "EN" : "ES"
    setLocale(newLocale)
    localStorage.setItem("decimal-locale", newLocale)

    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent("locale-change", { detail: newLocale }))
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="h-9 px-3 text-xs font-medium"
      aria-label={`Switch to ${locale === "ES" ? "EN" : "ES"} decimal format`}
    >
      <Globe className="h-3 w-3 mr-1" />
      {locale}
    </Button>
  )
}
