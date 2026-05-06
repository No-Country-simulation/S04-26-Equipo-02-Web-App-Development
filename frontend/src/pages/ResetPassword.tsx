import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams } from 'react-router-dom';
import { FormField } from '../components/FormField';
// import api from '../api/axios'; // Descomentar cuando el backend esté listo

// Schema para reset de contraseña
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe tener al menos un número'),
    confirmPassword: z.string().min(1, 'Confirmar contraseña es requerido'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Si no hay token, mostrar error
  if (!token) {
    return (
      <div className="container-main py-24 lg:py-32">
        <div className="container-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Enlace inválido
          </h1>
          <p className="mt-4 text-gray-600">
            Este enlace de recuperación ya no es válido o expiró.
          </p>
          <Link to="/forgot-password" className="btn-primary mt-8 w-[200px] text-center">
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: Descomentar cuando el backend esté listo
      // await api.post('/auth/reset-password', {
      //   token,
      //   password: data.password,
      // });

      // SIMULACIÓN - Eliminar cuando conectes el backend
      console.log('📤 Reset password con token:', token, 'password:', data.password);
      setSubmitSuccess(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error en reset password:', err);
      setSubmitError('No pudimos cambiar tu contraseña. Intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="container-main py-24 lg:py-32">
        <div className="container-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Contraseña actualizada
          </h1>
          <p className="mt-4 text-gray-600">
            Tu contraseña fue cambiada exitosamente.
          </p>
          <Link to="/login" className="btn-primary mt-8 w-[200px] text-center">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-24 lg:py-32">
      <div className="container-center">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Nueva contraseña
        </h1>
        <p className="mt-4 text-gray-600">
          Ingresá tu nueva contraseña
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form mt-8">
          {submitError && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">
              {submitError}
            </div>
          )}

          <FormField
            label="Nueva contraseña"
            type="password"
            placeholder="••••••••"
            register={register('password')}
            error={errors.password?.message}
            disabled={isSubmitting}
          />

          <FormField
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            register={register('confirmPassword')}
            error={errors.confirmPassword?.message}
            disabled={isSubmitting}
          />

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Cambiar contraseña'}
          </button>

          <p className="text-center text-sm text-gray-600">
            <Link to="/login" className="text-gray-900 font-medium hover:underline">
              Cancelar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}