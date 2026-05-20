'use client'

import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { ticketService, TicketsResult } from '@/application/services/ticket.service'
import { TicketFilters } from '@/domain/entities/ticket'

const DEFAULT_FILTERS: TicketFilters = { status: '', gameType: '', q: '', page: 1, pageSize: 10 }

export function useAdmin() {
  const [result, setResult] = useState<TicketsResult>({
    tickets: [],
    meta: { total: 0, page: 1, pageSize: 10, totalPages: 0 },
  })
  const [filters, setFilters] = useState<TicketFilters>(DEFAULT_FILTERS)
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async (f: TicketFilters = filters) => {
    setLoading(true)
    try {
      const data = await ticketService.getAdminTickets(f)
      setResult(data)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const applyFilters = useCallback(
    (partial: Partial<TicketFilters>) => {
      const next = { ...filters, ...partial, page: partial.page ?? 1 }
      setFilters(next)
      fetch(next)
    },
    [filters, fetch],
  )

  return { result, filters, loading, fetch, applyFilters }
}
