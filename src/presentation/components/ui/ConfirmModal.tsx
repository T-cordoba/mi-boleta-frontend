'use client'

import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'
import styles from './ConfirmModal.module.css'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  loading?: boolean
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, loading }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <AlertTriangle size={28} />
        </div>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
