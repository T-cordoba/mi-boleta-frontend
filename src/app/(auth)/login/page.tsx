'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Ticket } from 'lucide-react'
import { toast } from 'react-toastify'
import { Input } from '@/presentation/components/ui/Input'
import { Button } from '@/presentation/components/ui/Button'
import { authService } from '@/application/services/auth.service'
import { useAuthContext } from '@/presentation/providers/AuthProvider'
import styles from './page.module.css'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuthContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })

  function validate() {
    const errs = { email: '', password: '' }
    if (!email) errs.email = 'El correo es requerido'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Ingresa un correo válido'
    if (!password) errs.password = 'La contraseña es requerida'
    setErrors(errs)
    return !errs.email && !errs.password
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const user = await authService.login(email, password)
      setUser(user)
      toast.success(`¡Bienvenido, ${user.name}!`)
      router.push('/dashboard')
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.card}>
        <Link href="/" className={styles.icon} aria-label="Ir al inicio">
          <Ticket size={28} className="ticket-icon" />
        </Link>
        <h1 className={styles.title}>Bienvenido</h1>
        <p className={styles.subtitle}>Inicia sesión para gestionar tus boletas</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }}
            error={errors.email}
            icon={<Mail size={14} />}
            autoComplete="email"
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }}
            error={errors.password}
            icon={<Lock size={14} />}
            autoComplete="current-password"
          />
          <Button type="submit" size="lg" loading={loading} className={styles.submitBtn}>
            Iniciar sesión
          </Button>
        </form>

        <p className={styles.footer}>
          ¿No tienes cuenta?{' '}
          <Link href="/register" className={styles.link}>
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
