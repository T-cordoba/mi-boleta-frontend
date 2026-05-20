'use client'

import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { ticketService } from '@/application/services/ticket.service'
import { Ticket } from '@/domain/entities/ticket'

export interface DashboardStats {
  total: number
  pendiente: number
  ganado: number
  perdido: number
  recent: Ticket[]
  byStatus: { name: string; value: number; color: string }[]
  byGameType: { name: string; count: number }[]
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const [allRes, pendRes, ganRes, perRes] = await Promise.all([
        ticketService.getTickets({ pageSize: 5, page: 1 }),
        ticketService.getTickets({ status: 'Pendiente', pageSize: 1, page: 1 }),
        ticketService.getTickets({ status: 'Ganado', pageSize: 1, page: 1 }),
        ticketService.getTickets({ status: 'Perdido', pageSize: 1, page: 1 }),
      ])

      const allFull = await ticketService.getTickets({ pageSize: 100, page: 1 })
      const all = allFull.tickets

      const gameTypeCounts: Record<string, number> = {}
      all.forEach((t) => {
        gameTypeCounts[t.gameType] = (gameTypeCounts[t.gameType] ?? 0) + 1
      })

      setStats({
        total: allRes.meta.total,
        pendiente: pendRes.meta.total,
        ganado: ganRes.meta.total,
        perdido: perRes.meta.total,
        recent: allRes.tickets,
        byStatus: [
          { name: 'Pendiente', value: pendRes.meta.total, color: '#f59e0b' },
          { name: 'Ganado', value: ganRes.meta.total, color: '#10b981' },
          { name: 'Perdido', value: perRes.meta.total, color: '#ef4444' },
        ],
        byGameType: Object.entries(gameTypeCounts).map(([name, count]) => ({ name, count })),
      })
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { stats, loading, fetch }
}
