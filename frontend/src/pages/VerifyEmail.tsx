import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { API_ENDPOINTS } from '../lib/constants';
import { handleApiError } from '@/lib/errors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

const VERIFY_ERROR_MESSAGES: Record<number, string> = {
  400: 'El enlace de verificación ya no es válido o expiró.',
  404: 'El enlace de verificación ya no es válido o expiró.',
  409: 'Este email ya fue verificado. Podés iniciar sesión.',
};

export function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    token ? 'loading' : 'error'
  );
  const [message, setMessage] = useState(token ? '' : 'El enlace de verificación es inválido.');

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      try {
        await api.patch(API_ENDPOINTS.auth.verifyEmail(token));
        setStatus('success');
        setMessage('Email verificado exitosamente. Ya podés iniciar sesión.');
      } catch (err) {
        const apiError = handleApiError(err);
        const message = VERIFY_ERROR_MESSAGES[apiError.status]
          ?? (apiError.status >= 500 ? 'Error del servidor. Intentá de nuevo más tarde.' : 'No pudimos verificar tu email. El enlace podría haber expirado.');
        setStatus('error');
        setMessage(message);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Verificando email...'}
            {status === 'success' && '¡Email verificado!'}
            {status === 'error' && 'Error de verificación'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'loading' && (
            <div className="flex justify-center py-4">
              <Spinner className="h-8 w-8" />
            </div>
          )}
          {status === 'success' && (
            <>
              <p className="text-muted-foreground mb-4">{message}</p>
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Ir a iniciar sesión
              </Link>
            </>
          )}
          {status === 'error' && (
            <>
              <p className="text-destructive mb-4">{message}</p>
              <Link 
                to="/register" 
                className="text-sm text-primary hover:underline"
              >
                Volver a registrarse
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}