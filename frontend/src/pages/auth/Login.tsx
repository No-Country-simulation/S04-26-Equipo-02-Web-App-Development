import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { loginSchema, type LoginFormData } from '../../lib/schemas'
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { FormField } from '@/components/FormField'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { LoadingButton } from '@/components/auth/LoadingButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      provider: 'professional',
    },
  })

  const selectedProvider = useWatch({
    control: form.control,
    name: 'provider',
    defaultValue: 'professional',
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)

    try {
      await login({
        email: data.email,
        password: data.password,
        provider: data.provider.toUpperCase() as 'PROFESSIONAL' | 'COMPANY'
      })
      navigate('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Email o contraseña incorrectos'
      form.setError('root', { message })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full bg-brand-sage/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-[250px] h-[250px] rounded-full bg-brand-gold/5 blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
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
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-md"
                  >
                    {form.formState.errors.root.message}
                  </motion.div>
                )}

                {/* Selector de rol */}
                <div className="role-selector">
                  <label
                    className={`role-option ${selectedProvider === 'professional' ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      value="professional"
                      {...form.register('provider')}
                      className="sr-only"
                    />
                    <div>
                      <div className="font-medium">Profesional</div>
                      <div className="text-xs text-muted-foreground">Busco empleo</div>
                    </div>
                  </label>
                  <label
                    className={`role-option ${selectedProvider === 'company' ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      value="company"
                      {...form.register('provider')}
                      className="sr-only"
                    />
                    <div>
                      <div className="font-medium">Empresa</div>
                      <div className="text-xs text-muted-foreground">Busco talento</div>
                    </div>
                  </label>
                </div>

                <FormField
                  label="Email"
                  type="email"
                  placeholder="tu@email.com"
                  register={form.register('email')}
                  error={form.formState.errors.email?.message}
                  disabled={isSubmitting}
                  autoComplete="off"
                />

                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="••••••••"
                      {...form.register('password')}
                      disabled={isSubmitting}
                      autoComplete="new-password"
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

                <div className="text-center text-xs text-muted-foreground pt-2 border-t border-gray-100">
                  ¿Sos administrador?{' '}
                  <Link 
                    to="/admin/login" 
                    className="font-semibold text-brand-gold hover:underline"
                  >
                    Ingresá acá
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}