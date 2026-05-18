import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { API_ENDPOINTS } from '../lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

export function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.patch(API_ENDPOINTS.auth.verifyEmail(token!));
        setStatus('success');
        setMessage(response.data.message || 'Email verificado exitosamente');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Error al verificar el email');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Token inválido');
    }
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