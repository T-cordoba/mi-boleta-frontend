import { ticketRepository } from '@/infrastructure/repositories/ticket.repository'
import { ITicketRepository, TicketsResult } from '@/domain/repositories/ITicketRepository'
import { Ticket, TicketFilters, CreateTicketDto, UpdateTicketDto } from '@/domain/entities/ticket'

export type { TicketsResult }

export const ticketService = {
  async getTickets(filters: Partial<TicketFilters>, signal?: AbortSignal): Promise<TicketsResult> {
    return ticketRepository.getAll(filters, signal)
  },

  async getTicket(id: string): Promise<Ticket> {
    return ticketRepository.getById(id)
  },

  async createTicket(dto: CreateTicketDto): Promise<Ticket> {
    return ticketRepository.create(dto)
  },

  async updateTicket(id: string, dto: UpdateTicketDto): Promise<Ticket> {
    return ticketRepository.update(id, dto)
  },

  async deleteTicket(id: string): Promise<void> {
    return ticketRepository.delete(id)
  },

  async getAdminTickets(
    filters: Partial<TicketFilters> & { userId?: string },
    signal?: AbortSignal,
  ): Promise<TicketsResult> {
    return ticketRepository.getAllAdmin(filters, signal)
  },
}

export type TicketServiceDeps = { ticketRepository: ITicketRepository }
