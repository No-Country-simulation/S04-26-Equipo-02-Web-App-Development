"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navigation = [
  { name: "Metodologia", href: "#metodologia" },
  { name: "Profesionales", href: "#profesionales" },
  { name: "Empresas", href: "#empresas" },
  { name: "Comunidad", href: "#comunidad" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 h-16 lg:px-8">
        <Link href="/" className="flex items-center">
          <span className="text-base font-semibold tracking-tight text-foreground">
            Red de Bienestar Laboral
          </span>
        </Link>

        <div className="hidden lg:flex lg:items-center lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-x-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Iniciar Sesion</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/register">Registrarse</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden -m-2.5 p-2.5 text-muted-foreground"
          aria-label={mobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="px-6 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2.5 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/auth/login">Iniciar Sesion</Link>
              </Button>
              <Button size="sm" asChild className="w-full">
                <Link href="/auth/register">Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
