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

export interface ITicketRepository {
  getAll(filters: Partial<TicketFilters>, signal?: AbortSignal): Promise<TicketsResult>
  getById(id: string): Promise<Ticket>
  create(dto: CreateTicketDto): Promise<Ticket>
  update(id: string, dto: UpdateTicketDto): Promise<Ticket>
  delete(id: string): Promise<void>
  getAllAdmin(
    filters: Partial<TicketFilters> & { userId?: string },
    signal?: AbortSignal,
  ): Promise<TicketsResult>
}
