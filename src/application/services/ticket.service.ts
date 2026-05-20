import { ticketRepository } from '@/infrastructure/repositories/ticket.repository'
import {
  Ticket,
  TicketFilters,
  CreateTicketDto,
  UpdateTicketDto,
  PaginationMeta,
} from '@/domain/entities/ticket'

export interface TicketsResult {
  tickets: Ticket[]
  meta: PaginationMeta
}

export const ticketService = {
  async getTickets(filters: Partial<TicketFilters>): Promise<TicketsResult> {
    const res = await ticketRepository.getAll(filters)
    return { tickets: res.data, meta: res.meta }
  },

  async getTicket(id: string): Promise<Ticket> {
    const res = await ticketRepository.getById(id)
    return res.data
  },

  async createTicket(dto: CreateTicketDto): Promise<Ticket> {
    const res = await ticketRepository.create(dto)
    return res.data
  },

  async updateTicket(id: string, dto: UpdateTicketDto): Promise<Ticket> {
    const res = await ticketRepository.update(id, dto)
    return res.data
  },

  async deleteTicket(id: string): Promise<void> {
    await ticketRepository.delete(id)
  },

  async getAdminTickets(
    filters: Partial<TicketFilters> & { userId?: string },
  ): Promise<TicketsResult> {
    const res = await ticketRepository.getAllAdmin(filters)
    return { tickets: res.data, meta: res.meta }
  },
}
