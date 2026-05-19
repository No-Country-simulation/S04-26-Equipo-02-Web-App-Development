import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { registerSchema, type RegisterFormData } from '../lib/schemas'
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { LoadingButton } from '@/components/auth/LoadingButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const { register } = useAuth()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'professional',
      location: '',
      phone: '',
    },
  })

  const selectedRole = useWatch({
    control: form.control,
    name: 'role',
    defaultValue: 'professional',
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true)

    try {
      await register({
        email: data.email,
        password: data.password,
        provider: data.role.toUpperCase() as 'PROFESSIONAL' | 'COMPANY',
        firstName: data.firstName,
        lastName: data.lastName,
        location: data.location,
        phone: data.phone,
      })
      setSuccess(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear la cuenta'
      form.setError('root', { message })
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">¡Cuenta creada!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Te hemos enviado un correo electrónico para verificar tu cuenta.
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Ir a iniciar sesión
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>
            Unite a la Red de Bienestar Laboral
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {form.formState.errors.root && (
                <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-md">
                  {form.formState.errors.root.message}
                </div>
              )}

              {/* Selector de rol */}
              <div className="role-selector">
                <label
                  className={`role-option ${selectedRole === 'professional' ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    value="professional"
                    {...form.register('role')}
                    className="sr-only"
                  />
                  <div>
                    <div className="font-medium">Profesional</div>
                    <div className="text-xs text-muted-foreground">Busco empleo</div>
                  </div>
                </label>
                <label
                  className={`role-option ${selectedRole === 'company' ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    value="company"
                    {...form.register('role')}
                    className="sr-only"
                  />
                  <div>
                    <div className="font-medium">Empresa</div>
                    <div className="text-xs text-muted-foreground">Busco talento</div>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Juan"
                      disabled={isSubmitting}
                      {...form.register('firstName')}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.firstName?.message}
                  </FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Pérez"
                      disabled={isSubmitting}
                      {...form.register('lastName')}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.lastName?.message}
                  </FormMessage>
                </FormItem>
              </div>

              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    disabled={isSubmitting}
                    {...form.register('email')}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.email?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Ubicación</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Ciudad, País"
                    disabled={isSubmitting}
                    {...form.register('location')}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.location?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+54 9 11 1234 5678"
                    disabled={isSubmitting}
                    {...form.register('phone')}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.phone?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    {...form.register('password')}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.password?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Confirmar contraseña</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    {...form.register('confirmPassword')}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.confirmPassword?.message}
                </FormMessage>
              </FormItem>

              <LoadingButton
                type="submit"
                className="w-full"
                loading={isSubmitting}
                loadingText="Creando cuenta..."
              >
                Crear cuenta
              </LoadingButton>

              <p className="text-center text-sm text-muted-foreground">
                ¿Ya tenés cuenta?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-primary hover:underline"
                >
                  Iniciá sesión
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}