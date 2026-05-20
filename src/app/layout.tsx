import type { Metadata } from 'next'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from '@/presentation/providers/AuthProvider'

export const metadata: Metadata = {
  title: 'MiBoleta — Gestiona tus sorteos',
  description: '¿Y si sí me lo gané? Registra y organiza todas tus boletas y sorteos.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="dark"
            toastStyle={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '13px',
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
