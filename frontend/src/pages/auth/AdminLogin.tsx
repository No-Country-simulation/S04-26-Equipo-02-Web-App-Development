import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { adminLoginSchema, type AdminLoginFormData } from '../../lib/schemas';
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { FormField } from '@/components/FormField';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { LoadingButton } from '@/components/auth/LoadingButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminLogin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsSubmitting(true);

    try {
      await login({
        email: data.email,
        password: data.password,
        provider: 'ADMIN',
      });
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Email o contraseña incorrectos';
      form.setError('root', { message });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-brand-bg to-brand-card relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-brand-sage/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-gold/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Back button */}
      <div className="mb-6 w-full max-w-md">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Volver al ingreso general
        </Link>
      </div>

      <Card className="w-full max-w-md border border-brand-accent shadow-xl bg-white/90 backdrop-blur-sm relative z-10 transition-all duration-300 hover:shadow-2xl">
        {/* Top security border */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-gold to-brand-sage rounded-t-lg" />

        <CardHeader className="text-center pt-8 pb-4">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 shadow-sm animate-pulse">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-[10px] font-black tracking-widest text-brand-gold uppercase mx-auto mb-2 border border-brand-gold/30">
            Portal ADM
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
            Administración
          </CardTitle>
          <CardDescription className="text-gray-500">
            Ingresá tus credenciales autorizadas de administrador
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {form.formState.errors.root && (
                <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg border border-destructive/20 font-medium">
                  {form.formState.errors.root.message}
                </div>
              )}

              <FormField
                label="Email del Administrador"
                type="email"
                placeholder="admin@sitio.com"
                register={form.register('email')}
                error={form.formState.errors.email?.message}
                disabled={isSubmitting}
                autoComplete="off"
              />

              <FormItem>
                <div className="flex justify-between items-center mb-1.5">
                  <FormLabel className="text-sm font-semibold text-gray-700">Contraseña</FormLabel>
                </div>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    {...form.register('password')}
                    disabled={isSubmitting}
                    autoComplete="current-password"
                  />
                </FormControl>
                <FormMessage className="text-xs text-destructive mt-1">
                  {form.formState.errors.password?.message}
                </FormMessage>
              </FormItem>

              {/* Technical credentials info box */}
              <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex gap-3 text-xs text-gray-600">
                <Info className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-gray-700">Credenciales de Acceso:</p>
                  <p className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200 inline-block">admin@test.com</p>
                  <span className="mx-1">/</span>
                  <p className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200 inline-block">123456789</p>
                </div>
              </div>

              <LoadingButton
                type="submit"
                className="w-full bg-brand-charcoal text-white hover:bg-black font-bold py-6 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border border-black/10"
                loading={isSubmitting}
                loadingText="Verificando identidad..."
              >
                Ingresar al Panel
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
