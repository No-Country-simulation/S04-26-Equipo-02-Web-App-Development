import {
  AlertCircleIcon,
  AlertTriangleIcon,
  FileQuestionIcon,
  LockIcon,
  ServerCrashIcon,
  ShieldOffIcon,
  WifiOffIcon,
  type LucideIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { isApiError } from '@/lib/errors'
import type { ApiError } from '@/lib/errors'

interface ErrorDisplayProps {
  error: Error | ApiError | string
  onRetry?: () => void
  fullPage?: boolean
  className?: string
}

interface ErrorMeta {
  icon: LucideIcon
  title: string
  message: string
}

function getErrorMeta(error: Error | ApiError | string): ErrorMeta {
  // String error
  if (typeof error === 'string') {
    return {
      icon: AlertCircleIcon,
      title: 'Algo salió mal',
      message: error,
    }
  }

  // ApiError with status code mapping
  if (isApiError(error)) {
    switch (error.status) {
      case 0:
        return {
          icon: WifiOffIcon,
          title: 'Sin conexión al servidor',
          message: error.message || 'No pudimos conectar con el servidor',
        }
      case 401:
        return {
          icon: LockIcon,
          title: 'Sesión expirada',
          message: error.message || 'Tu sesión expiró. Iniciá sesión de nuevo.',
        }
      case 403:
        return {
          icon: ShieldOffIcon,
          title: 'No tenés permisos',
          message: error.message || 'No tenés acceso a esta sección.',
        }
      case 404:
        return {
          icon: FileQuestionIcon,
          title: 'No encontrado',
          message: error.message || 'El recurso que buscás no existe.',
        }
      case 422:
        return {
          icon: AlertTriangleIcon,
          title: 'Datos inválidos',
          message: error.message || 'Revisá los datos ingresados.',
        }
      default: {
        // 500+
        if (error.status >= 500) {
          return {
            icon: ServerCrashIcon,
            title: 'Error del servidor',
            message:
              error.message ||
              'Ocurrió un error en el servidor. Intentalo de nuevo.',
          }
        }
        // Other status codes
        return {
          icon: AlertCircleIcon,
          title: 'Algo salió mal',
          message: error.message || 'Ocurrió un error inesperado.',
        }
      }
    }
  }

  // Generic Error
  return {
    icon: AlertCircleIcon,
    title: 'Algo salió mal',
    message: error.message || 'Ocurrió un error inesperado.',
  }
}

function ErrorDisplay({
  error,
  onRetry,
  fullPage = false,
  className,
}: ErrorDisplayProps) {
  const { icon: Icon, title, message } = getErrorMeta(error)

  return (
    <div
      data-slot="error-display"
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 text-center',
        fullPage && 'min-h-screen py-24',
        className,
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <Icon className="size-8 text-destructive" />
      </div>

      <div className="max-w-sm space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>

      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}

export { ErrorDisplay, type ErrorDisplayProps }
