import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { FormField } from '../components/FormField';
// import api from '../api/axios'; // Descomentar cuando el backend esté listo

// Schema para recuperación de contraseña
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: Descomentar cuando el backend esté listo
      // await api.post('/auth/forgot-password', { email: data.email });

      // SIMULACIÓN - Eliminar cuando conectes el backend
      console.log('📤 Solicitud de recuperación:', data);
      setSubmitSuccess(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error en recuperación:', err);
      setSubmitError('No pudimos encontrar una cuenta con ese email');
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="container-main py-24 lg:py-32">
        <div className="container-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Revisa tu email
          </h1>
          <p className="mt-4 text-gray-600">
            Te enviamos instrucciones para recuperar tu contraseña.
            Revisa tu bandeja de entrada (y spam).
          </p>
          <Link to="/login" className="btn-primary mt-8 w-[200px] text-center">
            Volver al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-24 lg:py-32">
      <div className="container-center">
        <svg
          className="w-16 h-16 mx-auto mb-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="mt-4 text-gray-600">
          Ingresá tu email y te enviaremos instrucciones para recuperarla
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form mt-8">
          {submitError && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">
              {submitError}
            </div>
          )}

          <FormField
            label="Email"
            type="email"
            placeholder="tu@email.com"
            register={register('email')}
            error={errors.email?.message}
            disabled={isSubmitting}
          />

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
          </button>

          <p className="text-center text-sm text-gray-600">
            ¿Recordaste tu contraseña?{' '}
            <Link to="/login" className="text-gray-900 font-medium hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}