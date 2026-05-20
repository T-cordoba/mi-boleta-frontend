'use client'

import { SelectHTMLAttributes, ReactNode } from 'react'
import styles from './Select.module.css'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  icon?: ReactNode
}

export function Select({ label, error, icon, className = '', children, ...rest }: Props) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.selectWrapper}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <select
          {...rest}
          className={`${styles.select} ${icon ? styles.withIcon : ''} ${error ? styles.hasError : ''} ${className}`}
        >
          {children}
        </select>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
