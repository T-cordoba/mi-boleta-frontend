import { ReactNode } from 'react'
import styles from './StatsCard.module.css'

interface Props {
  label: string
  value: number | string
  icon: ReactNode
  color: 'primary' | 'warning' | 'success' | 'danger'
  loading?: boolean
}

export function StatsCard({ label, value, icon, color, loading }: Props) {
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <div className={styles.iconWrapper}>{icon}</div>
      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        {loading ? (
          <span className={styles.skeleton} />
        ) : (
          <span className={styles.value}>{value}</span>
        )}
      </div>
    </div>
  )
}
