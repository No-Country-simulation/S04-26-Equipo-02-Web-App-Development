"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"

const loginSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [activeTab, setActiveTab] = useState("profesional")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true)

    const payload = {
      ...values,
      provider: activeTab === "profesional" ? "PROFESSIONAL" : "COMPANY",
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Credenciales inválidas")
      }

      // Guardar en Zustand
      setAuth(result.user)

      toast.success("¡Inicio de sesión exitoso!")

      // Redireccionar según el rol
      if (result.user.role === "PROFESSIONAL") {
        router.push("/dashboard/profesional")
      } else {
        router.push("/dashboard/empresa")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-12"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="mb-8">
            <span className="text-base font-semibold tracking-tight text-foreground">
              Red de Bienestar Laboral
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Iniciar sesión
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-11">
              <TabsTrigger value="profesional" className="text-sm">
                Profesional
              </TabsTrigger>
              <TabsTrigger value="empresa" className="text-sm">
                Empresa
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  {...register("email")}
                  disabled={isLoading}
                  className={errors.email ? "border-destructive" : "h-11"}
                />
                {errors.email && (
                  <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Contraseña
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    disabled={isLoading}
                    className={errors.password ? "border-destructive pr-10" : "h-11 pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </form>
          </Tabs>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link href="/auth/register" className="font-medium text-foreground hover:underline">
                Crear cuenta
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-1 bg-primary">
        <div className="flex flex-col justify-center px-12 py-24">
          <div className="max-w-md">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/60">
              Plataforma de Empleabilidad
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-primary-foreground">
              Tu experiencia tiene valor
            </h2>
            <p className="mt-4 text-primary-foreground/70">
              Accede a tu ruta de aprendizaje personalizada, actualiza tu perfil profesional y conecta con empresas que valoran tu trayectoria.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-8">
              {[
                { value: "650+", label: "Profesionales" },
                { value: "15+", label: "Años exp." },
                { value: "3", label: "Áreas skills" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-semibold text-primary-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-primary-foreground/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
