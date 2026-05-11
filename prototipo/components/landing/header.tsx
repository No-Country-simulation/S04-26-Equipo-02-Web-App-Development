"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, LayoutDashboard } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigation = [
  { name: "Metodologia", href: "#metodologia" },
  { name: "Profesionales", href: "#profesionales" },
  { name: "Empresas", href: "#empresas" },
  { name: "Comunidad", href: "#comunidad" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session } = authClient.useSession()
  const user = session?.user

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 h-20 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-sage flex items-center justify-center">
            <span className="text-white font-black text-sm">R</span>
          </div>
          <span className="text-lg font-black tracking-tight text-gray-900">
            Red de Bienestar
          </span>
        </Link>

        <div className="hidden lg:flex lg:items-center lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-bold text-gray-600 hover:text-brand-sage transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-x-4">
          {user ? (
            <Link 
              href={user.role === "COMPANY" ? "/dashboard/empresa" : "/dashboard/profesional"}
              className="flex items-center gap-3 bg-brand-bg/50 hover:bg-brand-sage/10 pr-4 p-1 rounded-full border border-gray-100 transition-all group"
            >
              <Avatar className="h-8 w-8 border border-white">
                {user.image && <AvatarImage src={user.image} alt={user.name} className="object-cover" />}
                <AvatarFallback className="bg-brand-sage text-white text-xs font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-bold text-gray-900 group-hover:text-brand-sage transition-colors">
                Ir al Panel
              </span>
              <LayoutDashboard className="w-4 h-4 text-brand-sage" />
            </Link>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="font-bold text-gray-600 hover:text-brand-sage">
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
              <Button size="sm" asChild className="bg-brand-sage hover:bg-brand-olive text-white font-bold rounded-xl shadow-md shadow-brand-sage/20">
                <Link href="/auth/register">Registrarse</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden -m-2.5 p-2.5 text-gray-600 hover:text-brand-sage"
          aria-label={mobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-6 py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-base font-bold text-gray-600 hover:text-brand-sage"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              {user ? (
                <Link 
                  href={user.role === "COMPANY" ? "/dashboard/empresa" : "/dashboard/profesional"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-3 bg-brand-bg/50 p-3 rounded-xl border border-gray-100"
                >
                  <Avatar className="h-8 w-8">
                    {user.image && <AvatarImage src={user.image} alt={user.name} className="object-cover" />}
                    <AvatarFallback className="bg-brand-sage text-white text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-bold text-gray-900">Ir al Panel</span>
                  <LayoutDashboard className="w-4 h-4 text-brand-sage" />
                </Link>
              ) : (
                <>
                  <Button variant="outline" size="lg" asChild className="w-full font-bold border-gray-200">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>Iniciar Sesión</Link>
                  </Button>
                  <Button size="lg" asChild className="w-full bg-brand-sage hover:bg-brand-olive text-white font-bold rounded-xl shadow-md">
                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>Registrarse</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
