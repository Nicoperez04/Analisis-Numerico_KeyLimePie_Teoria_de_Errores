"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { Users, Menu } from "lucide-react"
import Logo from "../../../public/logo.png"  // Asegúrate de que la ruta sea correcta
const navigation = [
  { name: "Home", href: "/" },
  { name: "Teoría", href: "/teoria" },
  { name: "Práctica", href: "/practica" },
  { name: "Ejercicios", href: "/ejercicios" },
  { name: "Tecnologías", href: "/tecnologias" },
]

const teamMembers = ["Nicolás Perez", "Agustina Egüen", "Santiago Talavera", "Tomás Bellizzi"]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left section - Fixed text */}
          <div className="flex items-center">
            <div className="text-sm font-medium">Análisis Numérico | Tema 10: Propagación de Errores</div>
          </div>

          {/* Center navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-key-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-2 py-1",
                  pathname === item.href ? "text-key-lime" : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {/* Key Lime Pie Logo */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 hover:bg-key-lime/10 focus-visible:ring-2 focus-visible:ring-key-lime"
                    aria-label="Mostrar integrantes del equipo"
                    title="Ver integrantes"
                  >
                    <Image
                      src={Logo}
                      alt="Logo Key Lime Pie"
                      width={60}
                      height={60}
                      priority
                      className="h-8 w-8 object-contain"  // sin rounded-full para no cortar el aro/texto
                    />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" sideOffset={8} className="z-[60] w-56">
                  <div className="px-3 py-2 text-sm font-semibold flex items-center gap-2 border-b">
                    <Users className="h-4 w-4 text-key-lime" />
                    <span className="text-key-lime">Integrantes</span>
                  </div>
                  {teamMembers.map((member) => (
                    <DropdownMenuItem key={member} className="text-sm py-2 focus:bg-key-lime/10">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-key-lime/60" />
                        {member}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>



            {/* Mobile menu trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="text-sm font-semibold text-center pb-4 border-b">Propagación de Errores</div>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-key-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-3 py-2",
                        pathname === item.href ? "text-key-lime bg-key-lime/10" : "text-muted-foreground",
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
