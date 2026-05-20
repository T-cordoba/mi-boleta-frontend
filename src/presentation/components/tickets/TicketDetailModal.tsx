'use client'

import { Calendar, Hash, MapPin, DollarSign, FileText, Tag, Clock, User } from 'lucide-react'
import { Modal } from '@/presentation/components/ui/Modal'
import { StatusBadge, GameTypeBadge } from '@/presentation/components/ui/Badge'
import { Ticket } from '@/domain/entities/ticket'
import styles from './TicketDetailModal.module.css'

interface Props {
  ticket: Ticket | null
  onClose: () => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatAmount(amount?: number | null) {
  if (amount == null) return null
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount)
}

interface RowProps { icon: React.ReactNode; label: string; value: string | null }
function DetailRow({ icon, label, value }: RowProps) {
  if (!value) return null
  return (
    <div className={styles.row}>
      <span className={styles.rowIcon}>{icon}</span>
      <div>
        <span className={styles.rowLabel}>{label}</span>
        <span className={styles.rowValue}>{value}</span>
      </div>
    </div>
  )
}

export function TicketDetailModal({ ticket, onClose }: Props) {
  if (!ticket) return null

  return (
    <Modal open={!!ticket} onClose={onClose} title="Detalle de boleta" size="md">
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{ticket.title}</h3>
            <div className={styles.badges}>
              <GameTypeBadge gameType={ticket.gameType} />
              <StatusBadge status={ticket.status} />
            </div>
          </div>
        </div>

        <div className={styles.details}>
          <DetailRow icon={<Hash size={14} />} label="Número jugado" value={ticket.gameNumber ?? null} />
          <DetailRow icon={<Calendar size={14} />} label="Fecha del sorteo" value={formatDate(ticket.gameDate)} />
          <DetailRow icon={<DollarSign size={14} />} label="Valor apostado" value={formatAmount(ticket.amount)} />
          <DetailRow icon={<MapPin size={14} />} label="Lugar de compra" value={ticket.place ?? null} />
          <DetailRow icon={<Tag size={14} />} label="Tipo de juego" value={ticket.gameType} />
          <DetailRow icon={<FileText size={14} />} label="Notas" value={ticket.notes ?? null} />
          <DetailRow icon={<Clock size={14} />} label="Registrado el" value={formatDate(ticket.createdAt)} />
          {ticket.owner && (
            <DetailRow
              icon={<User size={14} />}
              label="Propietario"
              value={`${ticket.owner.name} (${ticket.owner.email})`}
            />
          )}
        </div>
      </div>
    </Modal>
  )
}
