'use client'

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'
import styles from './CustomSelect.module.css'

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  label?: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  error?: string
  icon?: ReactNode
}

export function CustomSelect({ label, value, onChange, options, placeholder, error, icon }: Props) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  const calcPos = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ top: rect.bottom + 6, left: rect.left, width: rect.width })
  }, [])

  function toggle() {
    if (!open) calcPos()
    setOpen((v) => !v)
  }

  useEffect(() => {
    if (!open) return
    const onMouse = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onScroll = () => { calcPos() }
    document.addEventListener('mousedown', onMouse)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('mousedown', onMouse)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [open, calcPos])

  const dropdown = open && typeof document !== 'undefined'
    ? createPortal(
        <div
          ref={dropdownRef}
          className={styles.dropdown}
          style={{ top: pos.top, left: pos.left, width: pos.width }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.option} ${opt.value === value ? styles.optionSelected : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false) }}
            >
              <span className={styles.optionLabel}>{opt.label}</span>
              {opt.value === value && <Check size={12} className={styles.check} />}
            </button>
          ))}
        </div>,
        document.body,
      )
    : null

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''} ${error ? styles.hasError : ''}`}
        onClick={toggle}
      >
        {icon && <span className={styles.iconSlot}>{icon}</span>}
        <span className={`${styles.triggerValue} ${!selected ? styles.placeholder : ''}`}>
          {selected?.label ?? placeholder ?? 'Seleccionar...'}
        </span>
        <ChevronDown size={14} className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
      </button>
      {error && <p className={styles.errorMsg}>{error}</p>}
      {dropdown}
    </div>
  )
}
