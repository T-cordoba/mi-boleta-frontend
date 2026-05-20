'use client'

import { useEffect, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { Pagination } from '@/presentation/components/ui/Pagination'
import { TicketTable } from '@/presentation/components/tickets/TicketTable'
import { TicketFilters } from '@/presentation/components/tickets/TicketFilters'
import { TicketDetailModal } from '@/presentation/components/tickets/TicketDetailModal'
import { useAdmin } from '@/application/hooks/useAdmin'
import { Ticket } from '@/domain/entities/ticket'
import styles from './page.module.css'

export default function AdminPage() {
  const { result, filters, loading, fetch, applyFilters } = useAdmin()
  const [viewTicket, setViewTicket] = useState<Ticket | null>(null)

  useEffect(() => { fetch() }, [fetch])

  return (
    <div className={`${styles.page} anim-fade-in`}>
      <div className={`${styles.header} anim-fade-up`}>
        <div className={styles.headerLeft}>
          <div className={styles.adminBadge}>
            <ShieldCheck size={16} />
            Administrador
          </div>
          <h1 className={styles.title}>Todos los sorteos</h1>
          <p className={styles.subtitle}>{result.meta.total} boleta{result.meta.total !== 1 ? 's' : ''} en el sistema</p>
        </div>
      </div>

      <div className={`${styles.filters} anim-fade-up`} style={{ animationDelay: '0.08s' }}>
        <TicketFilters filters={filters} onChange={applyFilters} />
      </div>

      <div className={`${styles.tableArea} anim-fade-up`} style={{ animationDelay: '0.16s' }}>
        <TicketTable
          tickets={result.tickets}
          loading={loading}
          page={filters.page}
          onView={setViewTicket}
          onEdit={() => {}}
          onDelete={() => {}}
          showOwner
        />
      </div>

      <Pagination meta={result.meta} onPage={(page) => applyFilters({ page })} />

      <TicketDetailModal ticket={viewTicket} onClose={() => setViewTicket(null)} />
    </div>
  )
}
