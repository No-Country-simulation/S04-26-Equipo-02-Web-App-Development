import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { loginSchema, type LoginFormData } from '../lib/schemas';
import { FormField } from '../components/FormField';
// import api from '../api/axios'; // Descomentar cuando el backend esté listo
// import { useAuth } from '../hooks/useAuth'; // Descomentar cuando el backend esté listo

export function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // const { login } = useAuth(); // Descomentar cuando el backend esté listo
  // const navigate = useNavigate(); // Descomentar cuando el backend esté listo

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: Descomentar cuando el backend esté listo
      // await login({ email: data.email, password: data.password });
      // navigate('/dashboard');

      // SIMULACIÓN - Eliminar cuando conectes el backend
      console.log('📤 Datos enviados al backend:', data);
      alert('Login simulado - conectar con backend cuando esté listo');
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error en login:', err);
      setSubmitError('Email o contraseña incorrectos');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-main py-24 lg:py-32">
      <div className="container-center">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Iniciar sesión
        </h1>
        <p className="mt-4 text-gray-600">
          Accedé a tu cuenta para continuar
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

          <FormField
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            register={register('password')}
            error={errors.password?.message}
            disabled={isSubmitting}
          />

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <p className="text-center text-sm text-gray-600">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="text-gray-900 font-medium hover:underline">
              Registrate aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}