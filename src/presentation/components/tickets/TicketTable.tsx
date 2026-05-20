'use client'

import { RefObject } from 'react'
import { Eye, Pencil, Trash2, Ticket as TicketIcon } from 'lucide-react'
import { Ticket } from '@/domain/entities/ticket'
import { StatusBadge, GameTypeBadge } from '@/presentation/components/ui/Badge'
import { Button } from '@/presentation/components/ui/Button'
import styles from './TicketTable.module.css'

interface Props {
  tickets: Ticket[]
  loading: boolean
  wrapperRef?: RefObject<HTMLDivElement | null>
  onView: (ticket: Ticket) => void
  onEdit: (ticket: Ticket) => void
  onDelete: (ticket: Ticket) => void
  showOwner?: boolean
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatAmount(amount?: number | null) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount)
}

export function TicketTable({ tickets, loading, wrapperRef, onView, onEdit, onDelete, showOwner }: Props) {
  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.skeletonRow} />
        ))}
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className={styles.empty}>
        <span style={{ color: 'var(--ticket)', display: 'flex' }}><TicketIcon size={40} /></span>
        <p>No se encontraron boletas</p>
        <span>Ajusta los filtros o registra una nueva</span>
      </div>
    )
  }

  return (
    <div className={styles.tableWrapper} ref={wrapperRef}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Número</th>
            <th>Fecha sorteo</th>
            <th>Valor</th>
            {showOwner && <th>Propietario</th>}
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} className={styles.row} onClick={() => onView(ticket)}>
              <td className={styles.titleCell}>{ticket.title}</td>
              <td><GameTypeBadge gameType={ticket.gameType} /></td>
              <td className={styles.mono}>{ticket.gameNumber ?? '—'}</td>
              <td>{formatDate(ticket.gameDate)}</td>
              <td className={styles.amount}>{formatAmount(ticket.amount)}</td>
              {showOwner && (
                <td className={styles.owner}>
                  <span>{ticket.owner?.name ?? '—'}</span>
                  <span className={styles.ownerEmail}>{ticket.owner?.email}</span>
                </td>
              )}
              <td><StatusBadge status={ticket.status} /></td>
              <td onClick={(e) => e.stopPropagation()}>
                <div className={styles.actions}>
                  <Button variant="ghost" size="sm" onClick={() => onView(ticket)} icon={<Eye size={14} />} />
                  {!showOwner && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(ticket)} icon={<Pencil size={14} />} />
                      <Button variant="danger" size="sm" onClick={() => onDelete(ticket)} icon={<Trash2 size={14} />} />
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
