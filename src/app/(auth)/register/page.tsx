'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Ticket } from 'lucide-react'
import { toast } from 'react-toastify'
import { Input } from '@/presentation/components/ui/Input'
import { Button } from '@/presentation/components/ui/Button'
import { authService } from '@/application/services/auth.service'
import styles from '../login/page.module.css'

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ name: '', email: '', password: '' })

  function set(key: keyof typeof form, value: string) {
    setForm((p) => ({ ...p, [key]: value }))
    setErrors((p) => ({ ...p, [key]: '' }))
  }

  function validate() {
    const errs = { name: '', email: '', password: '' }
    if (form.name.trim().length < 2) errs.name = 'El nombre debe tener al menos 2 caracteres'
    if (!form.email) errs.email = 'El correo es requerido'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Ingresa un correo válido'
    if (form.password.length < 8) errs.password = 'La contraseña debe tener al menos 8 caracteres'
    setErrors(errs)
    return !errs.name && !errs.email && !errs.password
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await authService.register(form.name, form.email, form.password)
      toast.success('¡Cuenta creada! Ya puedes iniciar sesión.')
      router.push('/login')
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
          <span style={{ color: 'var(--ticket)', display: 'flex' }}><Ticket size={28} /></span>
        </Link>
        <h1 className={styles.title}>Crear cuenta</h1>
        <p className={styles.subtitle}>Empieza a organizar tus boletas hoy</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Nombre completo"
            placeholder="Juan Pérez"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            error={errors.name}
            icon={<User size={14} />}
            autoComplete="name"
          />
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@correo.com"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            error={errors.email}
            icon={<Mail size={14} />}
            autoComplete="email"
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            error={errors.password}
            icon={<Lock size={14} />}
            autoComplete="new-password"
          />
          <Button type="submit" size="lg" loading={loading} className={styles.submitBtn}>
            Crear cuenta
          </Button>
        </form>

        <p className={styles.footer}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className={styles.link}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
