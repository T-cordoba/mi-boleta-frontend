'use client'

import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { ticketService, TicketsResult } from '@/application/services/ticket.service'
import {
  Ticket,
  TicketFilters,
  CreateTicketDto,
  UpdateTicketDto,
} from '@/domain/entities/ticket'

const DEFAULT_FILTERS: TicketFilters = { status: '', gameType: '', q: '', page: 1, pageSize: 10 }

export function useTickets() {
  const [result, setResult] = useState<TicketsResult>({
    tickets: [],
    meta: { total: 0, page: 1, pageSize: 10, totalPages: 0 },
  })
  const [filters, setFilters] = useState<TicketFilters>(DEFAULT_FILTERS)
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async (f: TicketFilters = filters) => {
    setLoading(true)
    try {
      const data = await ticketService.getTickets(f)
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

  const create = useCallback(async (dto: CreateTicketDto): Promise<Ticket | null> => {
    try {
      const ticket = await ticketService.createTicket(dto)
      toast.success('¡Boleta registrada exitosamente!')
      return ticket
    } catch (e) {
      toast.error((e as Error).message)
      return null
    }
  }, [])

  const update = useCallback(async (id: string, dto: UpdateTicketDto): Promise<Ticket | null> => {
    try {
      const ticket = await ticketService.updateTicket(id, dto)
      toast.success('Boleta actualizada correctamente.')
      return ticket
    } catch (e) {
      toast.error((e as Error).message)
      return null
    }
  }, [])

  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      await ticketService.deleteTicket(id)
      toast.success('Boleta eliminada.')
      return true
    } catch (e) {
      toast.error((e as Error).message)
      return false
    }
  }, [])

  return { result, filters, loading, fetch, applyFilters, create, update, remove }
}
