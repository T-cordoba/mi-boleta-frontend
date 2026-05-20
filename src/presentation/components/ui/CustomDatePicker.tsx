'use client'

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import styles from './CustomDatePicker.module.css'

interface Props {
  label?: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']

function parseLocal(val: string): Date | null {
  if (!val) return null
  const d = new Date(val)
  return isNaN(d.getTime()) ? null : d
}

function toLocal(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

function formatDisplay(d: Date): string {
  const date = d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
  const time = d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${date}  ·  ${time}`
}

export function CustomDatePicker({ label, value, onChange, error, placeholder }: Props) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const selected = parseLocal(value)
  const now = new Date()

  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? now.getFullYear())
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? now.getMonth())
  const [hour, setHour] = useState(selected?.getHours() ?? 12)
  const [minute, setMinute] = useState(selected?.getMinutes() ?? 0)

  const calcPos = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    // Use actual rendered height if available, otherwise estimate conservatively
    const popoverH = popoverRef.current?.offsetHeight ?? 460
    const spaceBelow = window.innerHeight - rect.bottom - 8
    const spaceAbove = rect.top - 8
    let top: number
    if (spaceBelow >= popoverH || spaceBelow >= spaceAbove) {
      // open below — clamp so it never exits viewport
      top = Math.min(rect.bottom + 6, window.innerHeight - popoverH - 8)
    } else {
      // open above
      top = Math.max(8, rect.top - popoverH - 6)
    }
    setPos({ top, left: rect.left, width: Math.max(rect.width, 300) })
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
        popoverRef.current?.contains(e.target as Node)
      ) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onScroll = () => calcPos()
    document.addEventListener('mousedown', onMouse)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('mousedown', onMouse)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [open, calcPos])

  // After popover renders, re-check position with actual height
  useLayoutEffect(() => {
    if (!open || !popoverRef.current) return
    const el = popoverRef.current
    const bottom = el.getBoundingClientRect().bottom
    if (bottom > window.innerHeight - 8) {
      const overflow = bottom - window.innerHeight + 8
      setPos((prev) => ({ ...prev, top: Math.max(8, prev.top - overflow) }))
    }
  }, [open])

  // Sync hour/minute from external value changes
  useEffect(() => {
    if (selected) {
      setHour(selected.getHours())
      setMinute(selected.getMinutes())
      setViewYear(selected.getFullYear())
      setViewMonth(selected.getMonth())
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  function selectDay(day: number) {
    const d = new Date(viewYear, viewMonth, day, hour, minute)
    onChange(toLocal(d))
    setOpen(false)
  }

  function applyTime(h: number, m: number) {
    const safeH = Math.min(23, Math.max(0, h))
    const safeM = Math.min(59, Math.max(0, m))
    setHour(safeH)
    setMinute(safeM)
    if (selected) {
      const d = new Date(selected)
      d.setHours(safeH, safeM)
      onChange(toLocal(d))
    }
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11) }
    else setViewMonth((m) => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0) }
    else setViewMonth((m) => m + 1)
  }

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const popover = open && typeof document !== 'undefined'
    ? createPortal(
        <div
          ref={popoverRef}
          className={styles.popover}
          style={{ top: pos.top, left: pos.left, minWidth: pos.width }}
        >
          {/* Izquierda — Time picker */}
          <div className={styles.timePicker}>
            <Clock size={13} className={styles.timeIcon} />
            <div className={styles.timeControls}>
              <div className={styles.timeUnit}>
                <button type="button" className={styles.timeArrow} onClick={() => applyTime((hour + 1) % 24, minute)}>
                  <ChevronUp size={13} />
                </button>
                <span className={styles.timeVal}>{String(hour).padStart(2, '0')}</span>
                <button type="button" className={styles.timeArrow} onClick={() => applyTime((hour - 1 + 24) % 24, minute)}>
                  <ChevronDown size={13} />
                </button>
                <span className={styles.timeHint}>HH</span>
              </div>
              <span className={styles.timeSep}>:</span>
              <div className={styles.timeUnit}>
                <button type="button" className={styles.timeArrow} onClick={() => applyTime(hour, (minute + 1) % 60)}>
                  <ChevronUp size={13} />
                </button>
                <span className={styles.timeVal}>{String(minute).padStart(2, '0')}</span>
                <button type="button" className={styles.timeArrow} onClick={() => applyTime(hour, (minute - 1 + 60) % 60)}>
                  <ChevronDown size={13} />
                </button>
                <span className={styles.timeHint}>MM</span>
              </div>
            </div>
          </div>

          {/* Derecha — Calendario */}
          <div className={styles.calPanel}>
            <div className={styles.calHeader}>
              <button type="button" className={styles.navBtn} onClick={prevMonth}>
                <ChevronLeft size={14} />
              </button>
              <span className={styles.monthLabel}>{MONTHS[viewMonth]} {viewYear}</span>
              <button type="button" className={styles.navBtn} onClick={nextMonth}>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className={styles.dayHeaders}>
              {DAYS.map((d) => <span key={d} className={styles.dayHeader}>{d}</span>)}
            </div>

            <div className={styles.dayGrid}>
              {cells.map((day, i) => {
                if (!day) return <span key={`e-${i}`} />
                const isToday =
                  day === now.getDate() &&
                  viewMonth === now.getMonth() &&
                  viewYear === now.getFullYear()
                const isSel =
                  !!selected &&
                  day === selected.getDate() &&
                  viewMonth === selected.getMonth() &&
                  viewYear === selected.getFullYear()
                return (
                  <button
                    key={`d-${day}`}
                    type="button"
                    onClick={() => selectDay(day)}
                    className={`${styles.day} ${isToday ? styles.today : ''} ${isSel ? styles.selectedDay : ''}`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
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
        onClick={toggle}
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''} ${error ? styles.hasError : ''}`}
      >
        <Calendar size={14} className={styles.calIcon} />
        <span className={`${styles.triggerValue} ${!selected ? styles.placeholder : ''}`}>
          {selected ? formatDisplay(selected) : (placeholder ?? 'Seleccionar fecha y hora')}
        </span>
        <ChevronDown size={14} className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
      </button>
      {error && <p className={styles.errorMsg}>{error}</p>}
      {popover}
    </div>
  )
}
