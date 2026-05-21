import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from '@/presentation/providers/AuthProvider'
import { ThemeProvider, type Theme } from '@/presentation/providers/ThemeProvider'

export const metadata: Metadata = {
  title: 'MiBoleta — Gestiona tus sorteos',
  description: '¿Y si sí me lo gané? Registra y organiza todas tus boletas y sorteos.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const theme = (cookieStore.get('theme')?.value ?? 'dark') as Theme

  return (
    <html lang="es" data-theme={theme}>
      <body>
        <ThemeProvider initial={theme}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
