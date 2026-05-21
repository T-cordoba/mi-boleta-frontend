import { api } from '@/infrastructure/api/client'
import {
  Ticket,
  TicketFilters,
  CreateTicketDto,
  UpdateTicketDto,
  PaginationMeta,
} from '@/domain/entities/ticket'
import { ITicketRepository, TicketsResult } from '@/domain/repositories/ITicketRepository'

interface TicketsResponse {
  data: Ticket[]
  meta: PaginationMeta
}

interface TicketResponse {
  data: Ticket
}

function buildQuery(filters: Partial<TicketFilters>): string {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.gameType) params.set('gameType', filters.gameType)
  if (filters.q) params.set('q', filters.q)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.pageSize) params.set('pageSize', String(filters.pageSize))
  const q = params.toString()
  return q ? `?${q}` : ''
}

export const ticketRepository: ITicketRepository = {
  async getAll(filters: Partial<TicketFilters>, signal?: AbortSignal): Promise<TicketsResult> {
    const res = await api.get<TicketsResponse>(`/tickets${buildQuery(filters)}`, { signal })
    return { tickets: res.data, meta: res.meta }
  },

  async getById(id: string): Promise<Ticket> {
    const res = await api.get<TicketResponse>(`/tickets/${id}`)
    return res.data
  },

  async create(dto: CreateTicketDto): Promise<Ticket> {
    const res = await api.post<TicketResponse>('/tickets', dto)
    return res.data
  },

  async update(id: string, dto: UpdateTicketDto): Promise<Ticket> {
    const res = await api.put<TicketResponse>(`/tickets/${id}`, dto)
    return res.data
  },

  async delete(id: string): Promise<void> {
    await api.delete<void>(`/tickets/${id}`)
  },

  async getAllAdmin(
    filters: Partial<TicketFilters> & { userId?: string },
    signal?: AbortSignal,
  ): Promise<TicketsResult> {
    const res = await api.get<TicketsResponse>(`/admin/tickets${buildQuery(filters)}`, { signal })
    return { tickets: res.data, meta: res.meta }
  },
}
