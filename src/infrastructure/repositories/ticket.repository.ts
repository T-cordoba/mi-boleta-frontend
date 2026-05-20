import { api } from '@/infrastructure/api/client'
import {
  Ticket,
  TicketFilters,
  CreateTicketDto,
  UpdateTicketDto,
  PaginationMeta,
} from '@/domain/entities/ticket'

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

export const ticketRepository = {
  getAll: (filters: Partial<TicketFilters>) =>
    api.get<TicketsResponse>(`/tickets${buildQuery(filters)}`),

  getById: (id: string) => api.get<TicketResponse>(`/tickets/${id}`),

  create: (dto: CreateTicketDto) => api.post<TicketResponse>('/tickets', dto),

  update: (id: string, dto: UpdateTicketDto) =>
    api.put<TicketResponse>(`/tickets/${id}`, dto),

  delete: (id: string) => api.delete<void>(`/tickets/${id}`),

  getAllAdmin: (filters: Partial<TicketFilters> & { userId?: string }) =>
    api.get<TicketsResponse>(`/admin/tickets${buildQuery(filters)}`),
}
