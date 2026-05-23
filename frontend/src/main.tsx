import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { SessionGuard } from './components/SessionGuard'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Toaster } from './components/ui/sonner'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <SessionGuard>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
            <Toaster position="top-center" richColors closeButton />
          </SessionGuard>
        </QueryClientProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)