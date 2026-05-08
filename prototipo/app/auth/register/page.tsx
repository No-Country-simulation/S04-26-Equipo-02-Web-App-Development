"use client"

import Link from "next/link"
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

const benefits = {
  profesional: [
    "Diagnóstico de habilidades gratuito",
    "Ruta de aprendizaje personalizada",
    "Perfil profesional dinámico",
    "Acceso al marketplace laboral",
  ],
  empresa: [
    "Galería de talento senior",
    "Filtros avanzados de búsqueda",
    "Perfiles con skills validadas",
    "Contacto directo con candidatos",
  ],
}

const registerSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  location: z.string().min(1, "La ubicación es obligatoria"),
  phone: z
    .string()
    .min(6, "El teléfono es muy corto")
    .regex(/^[0-9]+$/, "Solo se permiten números"),
  email: z.string().email("Correo electrónico no válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
})

type RegisterValues = z.infer<typeof registerSchema>

function RegisterForm() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("type") === "company" ? "empresa" : "profesional"
  
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (values: RegisterValues) => {
    setIsLoading(true)

    const payload = {
      ...values,
      provider: activeTab === "profesional" ? "PROFESSIONAL" : "COMPANY",
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Error al crear la cuenta")
      }

      toast.success("¡Cuenta creada con éxito! Por favor verifica tu correo electrónico.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-12"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          {/* <div className="mb-8">
            <span className="text-base font-semibold tracking-tight text-foreground">
              Red de Bienestar Laboral
            </span>
          </div> */}

          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Crear cuenta
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Selecciona tu tipo de perfil para comenzar
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    {activeTab === "profesional" ? "Nombre" : "Nombre de contacto"}
                  </Label>
                  <Input
                    id="firstName"
                    placeholder={activeTab === "profesional" ? "Tu nombre" : "Nombre del responsable"}
                    {...register("firstName")}
                    disabled={isLoading}
                    className={errors.firstName ? "border-destructive" : "h-11"}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive font-medium">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    {activeTab === "profesional" ? "Apellido" : "Nombre de la empresa"}
                  </Label>
                  <Input
                    id="lastName"
                    placeholder={activeTab === "profesional" ? "Tu apellido" : "Empresa S.A."}
                    {...register("lastName")}
                    disabled={isLoading}
                    className={errors.lastName ? "border-destructive" : "h-11"}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive font-medium">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    {activeTab === "profesional" ? "Ubicación" : "Ubicación de la empresa"}
                  </Label>
                  <Input
                    id="location"
                    placeholder="Ej: Buenos Aires, AR"
                    {...register("location")}
                    disabled={isLoading}
                    className={errors.location ? "border-destructive" : "h-11"}
                  />
                  {errors.location && (
                    <p className="text-xs text-destructive font-medium">{errors.location.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    {activeTab === "profesional" ? "Teléfono" : "Teléfono de contacto"}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Solo números"
                    {...register("phone", {
                      onChange: (e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "")
                      },
                    })}
                    disabled={isLoading}
                    className={errors.phone ? "border-destructive" : "h-11"}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive font-medium">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {activeTab === "profesional" ? "Correo electrónico" : "Correo corporativo"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={activeTab === "profesional" ? "tu@email.com" : "contacto@empresa.com"}
                  {...register("email")}
                  disabled={isLoading}
                  className={errors.email ? "border-destructive" : "h-11"}
                />
                {errors.email && (
                  <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    {...register("password")}
                    disabled={isLoading}
                    className={errors.password ? "border-destructive pr-10" : "h-11 pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive font-medium leading-tight">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  activeTab === "profesional" ? "Crear cuenta" : "Crear cuenta de empresa"
                )}
              </Button>
            </form>
          </Tabs>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Ya tienes cuenta?{" "}
              <Link href="/auth/login" className="font-medium text-foreground hover:underline">
                Iniciar sesion
              </Link>
            </p>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Al crear una cuenta, aceptas nuestros{" "}
            <Link href="#" className="hover:underline">Terminos de uso</Link>{" "}
            y{" "}
            <Link href="#" className="hover:underline">Politica de privacidad</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-1 bg-primary">
        <div className="flex flex-col justify-start px-12 pt-40 pb-24">
          <div className="max-w-md">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/60">
              {activeTab === "profesional" ? "Para Profesionales" : "Para Empresas"}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-primary-foreground">
              {activeTab === "profesional"
                ? "Inicia tu transformacion profesional"
                : "Acceda a talento senior actualizado"}
            </h2>
            <p className="mt-4 text-primary-foreground/70">
              {activeTab === "profesional"
                ? "Unete a mas de 650 profesionales que estan renovando su carrera."
                : "Conecte con profesionales experimentados con habilidades actualizadas."}
            </p>

            <ul className="mt-10 space-y-4">
              {benefits[activeTab as keyof typeof benefits].map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-primary-foreground">
                  <span className="h-1 w-1 bg-primary-foreground" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function RegisterLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterForm />
    </Suspense>
  )
}
