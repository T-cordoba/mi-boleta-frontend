'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/presentation/components/ui/Button'
import { Modal } from '@/presentation/components/ui/Modal'
import { DirtyModal } from '@/presentation/components/ui/DirtyModal'
import { ConfirmModal } from '@/presentation/components/ui/ConfirmModal'
import { Pagination } from '@/presentation/components/ui/Pagination'
import { TicketTable } from '@/presentation/components/tickets/TicketTable'
import { TicketForm } from '@/presentation/components/tickets/TicketForm'
import { TicketFilters } from '@/presentation/components/tickets/TicketFilters'
import { TicketDetailModal } from '@/presentation/components/tickets/TicketDetailModal'
import { useTickets } from '@/application/hooks/useTickets'
import { Ticket, CreateTicketDto } from '@/domain/entities/ticket'
import styles from './page.module.css'

export default function TicketsPage() {
  const { result, filters, loading, fetch, applyFilters, create, update, remove } = useTickets()
  const searchParams = useSearchParams()
  const router = useRouter()

  const tableRef = useRef<HTMLDivElement>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editTicket, setEditTicket] = useState<Ticket | null>(null)
  const [viewTicket, setViewTicket] = useState<Ticket | null>(null)
  const [deleteTicket, setDeleteTicket] = useState<Ticket | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => { fetch() }, [fetch])

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setCreateOpen(true)
      router.replace('/tickets')
    }
  }, [searchParams, router])

  async function handleCreate(dto: CreateTicketDto) {
    const ticket = await create(dto)
    if (ticket) { setCreateOpen(false); fetch(filters) }
  }

  async function handleEdit(dto: CreateTicketDto) {
    if (!editTicket) return
    const ticket = await update(editTicket.id, dto)
    if (ticket) { setEditTicket(null); fetch(filters) }
  }

  async function handleDelete() {
    if (!deleteTicket) return
    setDeleteLoading(true)
    const ok = await remove(deleteTicket.id)
    setDeleteLoading(false)
    if (ok) { setDeleteTicket(null); fetch(filters) }
  }

  return (
    <div className={`${styles.page} anim-fade-in`}>
      <div className={`${styles.header} anim-fade-up`}>
        <div>
          <h1 className={styles.title}>Mis Boletas</h1>
          <p className={styles.subtitle}>
            {result.meta.total} boleta{result.meta.total !== 1 ? 's' : ''} registrada{result.meta.total !== 1 ? 's' : ''}
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>
          Nueva boleta
        </Button>
      </div>

      <div className={`${styles.filters} anim-fade-up`} style={{ animationDelay: '0.08s' }}>
        <TicketFilters filters={filters} onChange={applyFilters} />
      </div>

      <div className={`${styles.tableArea} anim-fade-up`} style={{ animationDelay: '0.16s' }}>
        <TicketTable
          tickets={result.tickets}
          loading={loading}
          pageSize={filters.pageSize}
          wrapperRef={tableRef}
          onView={setViewTicket}
          onEdit={setEditTicket}
          onDelete={setDeleteTicket}
        />
      </div>

      <div className="anim-fade-up" style={{ animationDelay: '0.22s' }}>
        <Pagination meta={{ ...result.meta, page: filters.page }} onPage={(page) => { tableRef.current?.scrollTo({ top: 0 }); applyFilters({ page }) }} />
      </div>

      {/* Crear — con protección dirty */}
      <DirtyModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Registrar boleta"
        size="lg"
      >
        {(onDirtyChange) => (
          <TicketForm
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
            onDirtyChange={onDirtyChange}
          />
        )}
      </DirtyModal>

      {/* Editar — sin dirty (ya tiene datos iniciales) */}
      <Modal open={!!editTicket} onClose={() => setEditTicket(null)} title="Editar boleta" size="lg">
        <TicketForm
          initial={editTicket ?? undefined}
          onSubmit={handleEdit}
          onCancel={() => setEditTicket(null)}
        />
      </Modal>

      <TicketDetailModal ticket={viewTicket} onClose={() => setViewTicket(null)} />

      <ConfirmModal
        open={!!deleteTicket}
        onClose={() => setDeleteTicket(null)}
        onConfirm={handleDelete}
        title="Eliminar boleta"
        message={`¿Seguro que quieres eliminar "${deleteTicket?.title}"? Esta acción no se puede deshacer.`}
        loading={deleteLoading}
      />
    </div>
  )
}
