'use client'

import { useCallback, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { CustomSelect } from '@/presentation/components/ui/CustomSelect'
import { Input } from '@/presentation/components/ui/Input'
import { Button } from '@/presentation/components/ui/Button'
import { TicketFilters as Filters, GAME_TYPES, TICKET_STATUSES } from '@/domain/entities/ticket'
import styles from './TicketFilters.module.css'

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  ...TICKET_STATUSES.map((s) => ({ value: s, label: s })),
]

const GAME_TYPE_OPTIONS = [
  { value: '', label: 'Todos los tipos' },
  ...GAME_TYPES.map((g) => ({ value: g, label: g })),
]

interface Props {
  filters: Filters
  onChange: (partial: Partial<Filters>) => void
}

export function TicketFilters({ filters, onChange }: Props) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleQ = useCallback(
    (q: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => onChange({ q, page: 1 }), 400)
    },
    [onChange],
  )

  const hasFilters = filters.status || filters.gameType || filters.q

  return (
    <div className={styles.wrapper}>
      <Input
        placeholder="Buscar por nombre o número..."
        defaultValue={filters.q}
        onChange={(e) => handleQ(e.target.value)}
        icon={<Search size={14} />}
      />

      <CustomSelect
        value={filters.status ?? ''}
        onChange={(v) => onChange({ status: v as Filters['status'], page: 1 })}
        options={STATUS_OPTIONS}
      />

      <CustomSelect
        value={filters.gameType ?? ''}
        onChange={(v) => onChange({ gameType: v as Filters['gameType'], page: 1 })}
        options={GAME_TYPE_OPTIONS}
      />

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          icon={<X size={14} />}
          onClick={() => onChange({ status: '', gameType: '', q: '', page: 1 })}
        >
          Limpiar
        </Button>
      )}
    </div>
  )
}
