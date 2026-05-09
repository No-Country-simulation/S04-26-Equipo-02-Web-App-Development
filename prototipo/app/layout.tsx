import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from "sonner"
import './globals.css'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Red de Bienestar Laboral | Empleabilidad para Profesionales +45',
  description: 'Plataforma de upskilling y conexión laboral para profesionales mayores de 45 años. Diagnóstico, formación personalizada y acceso a empresas.',
  generator: 'Maxier Studios',
  icons: {
    icon: [
      {
        url: '/logo-espera.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo-espera.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo-espera.png',
        type: 'image/png',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster richColors position="top-center" />
       {/* {process.env.NODE_ENV === 'production' && <Analytics />} */}
      </body>
    </html>
  )
}
