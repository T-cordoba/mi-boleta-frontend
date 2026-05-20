import { TicketStatus, GameType } from '@/domain/entities/ticket'
import styles from './Badge.module.css'

interface StatusBadgeProps {
  status: TicketStatus
}

interface GameTypeBadgeProps {
  gameType: GameType
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const map: Record<TicketStatus, string> = {
    Pendiente: styles.pendiente,
    Ganado: styles.ganado,
    Perdido: styles.perdido,
  }
  return <span className={`${styles.badge} ${map[status]}`}>{status}</span>
}

export function GameTypeBadge({ gameType }: GameTypeBadgeProps) {
  const map: Record<GameType, string> = {
    Lotería: styles.loteria,
    Rifa: styles.rifa,
    Sorteo: styles.sorteo,
    Boleta: styles.boleta,
    'Juego ocasional': styles.juego,
  }
  return <span className={`${styles.badge} ${map[gameType]}`}>{gameType}</span>
}
