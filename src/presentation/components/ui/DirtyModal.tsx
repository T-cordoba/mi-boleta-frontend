'use client'

import { useState, useCallback, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'
import styles from './DirtyModal.module.css'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: (onDirtyChange: (dirty: boolean) => void) => ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function DirtyModal({ open, onClose, title, children, size = 'md' }: Props) {
  const [isDirty, setIsDirty] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleDirtyChange = useCallback((dirty: boolean) => setIsDirty(dirty), [])

  function handleClose() {
    if (isDirty) {
      setConfirmOpen(true)
    } else {
      setIsDirty(false)
      onClose()
    }
  }

  function confirmDiscard() {
    setConfirmOpen(false)
    setIsDirty(false)
    onClose()
  }

  return (
    <>
      <Modal open={open} onClose={handleClose} title={title} size={size}>
        {children(handleDirtyChange)}
      </Modal>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="¿Descartar cambios?" size="sm">
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <AlertTriangle size={26} />
          </div>
          <p className={styles.message}>
            Tienes información sin guardar. Si cierras ahora se perderá todo lo que escribiste.
          </p>
          <div className={styles.actions}>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Seguir editando
            </Button>
            <Button variant="danger" onClick={confirmDiscard}>
              Descartar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
