import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangleIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log as last resort
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo.componentStack)

    // Notify caller if handler provided
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback
      return (
        <div
          data-slot="error-boundary-fallback"
          className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center"
        >
          <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangleIcon className="size-8 text-destructive" />
          </div>

          <div className="max-w-sm space-y-1">
            <h2 className="text-lg font-semibold text-foreground">
              Algo salió mal
            </h2>
            <p className="text-sm text-muted-foreground">
              {this.state.error?.message ||
                'Ocurrió un error inesperado en la aplicación.'}
            </p>
          </div>

          <Button variant="outline" onClick={this.handleRetry}>
            Reintentar
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export { ErrorBoundary, type ErrorBoundaryProps }
