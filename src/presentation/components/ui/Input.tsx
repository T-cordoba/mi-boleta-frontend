'use client'

import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'
import styles from './Input.module.css'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, icon, className = '', ...rest }, ref) => {
    return (
      <div className={styles.wrapper}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.inputWrapper}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <input
            ref={ref}
            {...rest}
            className={`${styles.input} ${icon ? styles.withIcon : ''} ${error ? styles.hasError : ''} ${className}`}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
