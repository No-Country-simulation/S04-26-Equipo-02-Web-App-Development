import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { registerSchema, type RegisterFormData } from '../lib/schemas'
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { LoadingButton } from '@/components/auth/LoadingButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'professional',
      companyName: '',
    },
  })

  const selectedRole = form.watch('role')

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true)

    try {
      // TODO: Conectar con backend
      console.log('📤 Register data:', data)
      setIsSubmitting(false)
    } catch (err) {
      console.error('Error en registro:', err)
      form.setError('root', { message: 'Error al crear la cuenta' })
      setIsSubmitting(false)
    }
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

              <FormItem>
                <FormLabel>
                  {selectedRole === 'company' ? 'Nombre del representante' : 'Nombre completo'}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Juan Pérez"
                    disabled={isSubmitting}
                    {...form.register('name')}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.name?.message}
                </FormMessage>
              </FormItem>

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

              {/* Solo mostrar companyName si es empresa */}
              {selectedRole === 'company' && (
                <FormItem>
                  <FormLabel>Nombre de la empresa</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Acme Corporation"
                      disabled={isSubmitting}
                      {...form.register('companyName')}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.companyName?.message}
                  </FormMessage>
                </FormItem>
              )}

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