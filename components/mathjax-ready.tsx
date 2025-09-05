"use client"

import { useEffect } from "react"

export function MathJaxReady() {
  useEffect(() => {
    const mj = (window as any).MathJax
    // Intento inmediato y reintentos cortos hasta que cargue
    const tick = () => mj?.typesetPromise?.().catch(() => {})
    tick()
    const id = window.setInterval(() => {
      if ((window as any).MathJax?.typesetPromise) {
        tick()
        window.clearInterval(id)
      }
    }, 80)
    return () => window.clearInterval(id)
  }, [])

  return null
}
