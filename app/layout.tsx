import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Suspense } from "react"
import Script from "next/script"
import { MathJaxReady } from "../components/mathjax-ready" 
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Propagación de Errores - Análisis Numérico",
  description: "App educativa para el Tema 10: Propagación de Errores - Key Lime Pie",
  generator: "v0.app",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} antialiased`}>
        {/* Config de MathJax */}
        <Script id="mathjax-config" strategy="beforeInteractive">{`
          window.MathJax = {
            tex: {
              inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
              displayMath: [['$$','$$'], ['\\\\[','\\\\]']],
              processEscapes: true
            },
            options: {
              skipHtmlTags: ['script','noscript','style','textarea','pre','code']
            }
          };
        `}</Script>

        {/* Librería */}
        <Script
          id="mathjax"
          strategy="afterInteractive"
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
        />

        {/* Fuerza un typeset inicial desde un Client Component */}
        <MathJaxReady />

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            <Suspense fallback={<div>Loading...</div>}>
              <Header />
              <main className="container mx-auto max-w-6xl px-4 py-8">{children}</main>
            </Suspense>
          </div>
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  )
}

