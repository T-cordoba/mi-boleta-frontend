'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, ChevronDown, Shield, LayoutDashboard, Ticket, ShieldCheck } from 'lucide-react'
import { useAuthContext } from '@/presentation/providers/AuthProvider'
import styles from './Navbar.module.css'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tickets', label: 'Mis Boletas', icon: Ticket },
]

const ADMIN_ITEM = { href: '/admin', label: 'Administrador', icon: ShieldCheck }

export function Navbar() {
  const { user, logout, isAdmin } = useAuthContext()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initial = user?.name?.charAt(0).toUpperCase() ?? '?'
  const items = isAdmin ? [...NAV_ITEMS, ADMIN_ITEM] : NAV_ITEMS

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.logo}>🎟</span>
        <span className={styles.brandName}>MiBoleta</span>
      </div>

      <div className={styles.navLinks}>
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navLink} ${pathname === href ? styles.active : ''}`}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </div>

      <div className={styles.right} ref={ref}>
        <button className={styles.profileBtn} onClick={() => setOpen((v) => !v)}>
          <div className={styles.avatar}>{initial}</div>
          <div className={styles.info}>
            <span className={styles.name}>{user?.name}</span>
            {isAdmin && (
              <span className={styles.role}>
                <Shield size={10} /> Admin
              </span>
            )}
          </div>
          <ChevronDown size={14} className={`${styles.chevron} ${open ? styles.rotated : ''}`} />
        </button>

        {open && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownHeader}>
              <p className={styles.dropEmail}>{user?.email}</p>
            </div>
            <button className={styles.dropItem} onClick={() => { setOpen(false); logout() }}>
              <LogOut size={14} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
