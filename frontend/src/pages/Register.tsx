import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { registerSchema, type RegisterFormData } from '../lib/schemas';
import { FormField } from '../components/FormField';
// import api from '../api/axios'; // Descomentar cuando el backend esté listo
// import { useAuth } from '../hooks/useAuth'; // Descomentar cuando el backend esté listo

export function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // const { register: registerUser } = useAuth(); // Descomentar cuando el backend esté listo

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'professional',
      companyName: '',
    },
  });

  // Watching para conditionally render campos
  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: Descomentar cuando el backend esté listo
      // await registerUser({
      //   name: data.name,
      //   email: data.email,
      //   password: data.password,
      //   role: data.role,
      //   ...(data.role === 'company' && { companyName: data.companyName }),
      // });

      // SIMULACIÓN - Eliminar cuando conectes el backend
      console.log('📤 Datos de registro enviados:', data);
      alert(`Registro simulado como ${data.role === 'company' ? 'empresa' : 'profesional'}`);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error en registro:', err);
      setSubmitError('Error al crear la cuenta');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-main py-24 lg:py-32">
      <div className="container-center">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Crear cuenta
        </h1>
        <p className="mt-4 text-gray-600">
          Unite a la Red de Bienestar Laboral
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form mt-8">
          {submitError && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">
              {submitError}
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
                {...register('role')}
                className="sr-only"
              />
              <div>
                <div className="font-medium">Profesional</div>
                <div className="text-xs text-gray-500">Busco empleo</div>
              </div>
            </label>
            <label
              className={`role-option ${selectedRole === 'company' ? 'selected' : ''}`}
            >
              <input
                type="radio"
                value="company"
                {...register('role')}
                className="sr-only"
              />
              <div>
                <div className="font-medium">Empresa</div>
                <div className="text-xs text-gray-500">Busco talento</div>
              </div>
            </label>
          </div>

          <FormField
            label={selectedRole === 'company' ? 'Nombre del representante' : 'Nombre completo'}
            type="text"
            placeholder={selectedRole === 'company' ? 'Juan Pérez' : 'Juan Pérez'}
            register={register('name')}
            error={errors.name?.message}
            disabled={isSubmitting}
          />

          <FormField
            label="Email"
            type="email"
            placeholder="tu@email.com"
            register={register('email')}
            error={errors.email?.message}
            disabled={isSubmitting}
          />

          {/* Solo mostrar companyName si es empresa */}
          {selectedRole === 'company' && (
            <FormField
              label="Nombre de la empresa"
              type="text"
              placeholder="Acme Corporation"
              register={register('companyName')}
              error={errors.companyName?.message}
              disabled={isSubmitting}
            />
          )}

          <FormField
            label="Contraseña"
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
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <p className="text-center text-sm text-gray-600">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-gray-900 font-medium hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}