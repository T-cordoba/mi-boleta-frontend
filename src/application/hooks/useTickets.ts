'use client'

import { useState, useCallback, useRef } from 'react'
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
  const filtersRef = useRef<TicketFilters>(DEFAULT_FILTERS)
  const abortRef = useRef<AbortController | null>(null)

  const fetch = useCallback(async (f: TicketFilters = filtersRef.current) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    try {
      const data = await ticketService.getTickets(f, controller.signal)
      setResult(data)
    } catch (e) {
      if ((e as Error).name !== 'AbortError') toast.error((e as Error).message)
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [])

  const applyFilters = useCallback((partial: Partial<TicketFilters>) => {
    const next = { ...filtersRef.current, ...partial, page: partial.page ?? 1 }
    filtersRef.current = next
    setFilters(next)
    fetch(next)
  }, [fetch])

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
