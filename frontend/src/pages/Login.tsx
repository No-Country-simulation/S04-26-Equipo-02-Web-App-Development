import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { loginSchema, type LoginFormData } from '../lib/schemas'
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { FormField } from '@/components/FormField'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { LoadingButton } from '@/components/auth/LoadingButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)

    try {
      // TODO: Conectar con backend
      console.log('📤 Login data:', data)
      setIsSubmitting(false)
    } catch (err) {
      console.error('Error en login:', err)
      form.setError('root', { message: 'Email o contraseña incorrectos' })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>
            Accedé a tu cuenta para continuar
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

              <FormField
                label="Email"
                type="email"
                placeholder="tu@email.com"
                register={form.register('email')}
                error={form.formState.errors.email?.message}
                disabled={isSubmitting}
              />

              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    {...form.register('password')}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.password?.message}
                </FormMessage>
              </FormItem>

              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <LoadingButton
                type="submit"
                className="w-full"
                loading={isSubmitting}
                loadingText="Iniciando sesión..."
              >
                Iniciar sesión
              </LoadingButton>

              <p className="text-center text-sm text-muted-foreground">
                ¿No tenés cuenta?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-primary hover:underline"
                >
                  Registrate aquí
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}