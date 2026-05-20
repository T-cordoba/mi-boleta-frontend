'use client'

import { useState, useEffect } from 'react'
import { Hash, MapPin, DollarSign, FileText, Tag, Activity } from 'lucide-react'
import { Input } from '@/presentation/components/ui/Input'
import { CustomSelect } from '@/presentation/components/ui/CustomSelect'
import { CustomDatePicker } from '@/presentation/components/ui/CustomDatePicker'
import { Button } from '@/presentation/components/ui/Button'
import {
  Ticket,
  CreateTicketDto,
  GAME_TYPES,
  TICKET_STATUSES,
  TicketStatus,
  GameType,
} from '@/domain/entities/ticket'
import styles from './TicketForm.module.css'

interface Props {
  initial?: Ticket
  onSubmit: (dto: CreateTicketDto) => Promise<void>
  onCancel: () => void
  onDirtyChange?: (dirty: boolean) => void
}

function toDatetimeLocal(iso?: string | null): string {
  if (!iso) return ''
  return iso.slice(0, 16)
}

const GAME_TYPE_OPTIONS = GAME_TYPES.map((g) => ({ value: g, label: g }))
const STATUS_OPTIONS = TICKET_STATUSES.map((s) => ({ value: s, label: s }))

export function TicketForm({ initial, onSubmit, onCancel, onDirtyChange }: Props) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState<CreateTicketDto>({
    title: initial?.title ?? '',
    gameType: initial?.gameType ?? 'Lotería',
    gameNumber: initial?.gameNumber ?? '',
    gameDate: toDatetimeLocal(initial?.gameDate),
    amount: initial?.amount ?? undefined,
    place: initial?.place ?? '',
    status: initial?.status ?? 'Pendiente',
    notes: initial?.notes ?? '',
  })

  useEffect(() => {
    if (!initial && onDirtyChange) {
      const dirty =
        !!form.title || !!form.gameNumber || !!form.place || !!form.notes ||
        form.amount != null || !!form.gameDate
      onDirtyChange(dirty)
    }
  }, [form, initial, onDirtyChange])

  function set<K extends keyof CreateTicketDto>(key: K, value: CreateTicketDto[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'El nombre del sorteo es requerido'
    if (!form.gameDate) errs.gameDate = 'La fecha del sorteo es requerida'
    if (form.amount !== undefined && form.amount < 0)
      errs.amount = 'El valor debe ser mayor o igual a 0'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const dto: CreateTicketDto = {
        ...form,
        gameDate: new Date(form.gameDate).toISOString(),
        gameNumber: form.gameNumber || undefined,
        place: form.place || undefined,
        notes: form.notes || undefined,
        amount: form.amount !== undefined && form.amount !== null ? Number(form.amount) : undefined,
      }
      await onSubmit(dto)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.grid}>
        <Input
          label="Nombre del sorteo *"
          placeholder="Ej: Lotería de Medellín"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          error={errors.title}
        />

        <CustomSelect
          label="Tipo de juego *"
          value={form.gameType}
          onChange={(v) => set('gameType', v as GameType)}
          options={GAME_TYPE_OPTIONS}
          icon={<Tag size={14} />}
        />

        <Input
          label="Número jugado"
          placeholder="Ej: 1234"
          value={form.gameNumber ?? ''}
          onChange={(e) => set('gameNumber', e.target.value)}
          icon={<Hash size={14} />}
        />

        <CustomDatePicker
          label="Fecha del sorteo *"
          value={form.gameDate}
          onChange={(v) => set('gameDate', v)}
          error={errors.gameDate}
          placeholder="Seleccionar fecha y hora"
        />

        <Input
          label="Valor apostado"
          type="number"
          placeholder="Ej: 5000"
          min={0}
          value={form.amount ?? ''}
          onChange={(e) => set('amount', e.target.value ? Number(e.target.value) : undefined)}
          error={errors.amount}
          icon={<DollarSign size={14} />}
        />

        <Input
          label="Lugar de compra"
          placeholder="Ej: Tienda La Esquina"
          value={form.place ?? ''}
          onChange={(e) => set('place', e.target.value)}
          icon={<MapPin size={14} />}
        />

        <CustomSelect
          label="Estado *"
          value={form.status}
          onChange={(v) => set('status', v as TicketStatus)}
          options={STATUS_OPTIONS}
          icon={<Activity size={14} />}
        />

        <Input
          label="Notas"
          placeholder="Ej: Premio: viaje a Cartagena"
          value={form.notes ?? ''}
          onChange={(e) => set('notes', e.target.value)}
          icon={<FileText size={14} />}
        />
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {initial ? 'Guardar cambios' : 'Registrar boleta'}
        </Button>
      </div>
    </form>
  )
}
