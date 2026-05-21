'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/presentation/providers/ThemeProvider'
import styles from './ThemeToggle.module.css'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className={styles.btn}
      onClick={toggleTheme}
      aria-label="Cambiar tema"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
