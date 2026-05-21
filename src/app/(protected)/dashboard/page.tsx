'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Ticket, Clock, Trophy, XCircle, Plus, ArrowRight, TicketX } from 'lucide-react'
import { StatsCard } from '@/presentation/components/dashboard/StatsCard'
import { StatusChart } from '@/presentation/components/dashboard/StatusChart'
import { GameTypeChart } from '@/presentation/components/dashboard/GameTypeChart'
import { useDashboard } from '@/application/hooks/useDashboard'
import { useAuthContext } from '@/presentation/providers/AuthProvider'
import styles from './page.module.css'

export default function DashboardPage() {
  const { user } = useAuthContext()
  const { stats, loading, fetch } = useDashboard()

  useEffect(() => { fetch() }, [fetch])

  return (
    <div className={`${styles.page} anim-fade-in`}>
      <div className={`${styles.header} anim-fade-up`}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Hola, <strong>{user?.name}</strong> — aquí está el resumen de tus boletas
          </p>
        </div>
      </div>

      <div className={`${styles.stats} stagger`}>
        <StatsCard
          label="Total registradas"
          value={stats?.total ?? 0}
          icon={<Ticket size={22} />}
          color="primary"
          loading={loading}
        />
        <StatsCard
          label="Pendientes"
          value={stats?.pendiente ?? 0}
          icon={<Clock size={22} />}
          color="warning"
          loading={loading}
        />
        <StatsCard
          label="Ganadas"
          value={stats?.ganado ?? 0}
          icon={<Trophy size={22} />}
          color="success"
          loading={loading}
        />
        <StatsCard
          label="Perdidas"
          value={stats?.perdido ?? 0}
          icon={<XCircle size={22} />}
          color="danger"
          loading={loading}
        />
      </div>

      {!loading && stats?.total === 0 ? (
        <div className={`${styles.empty} anim-fade-up`}>
          <div className={styles.emptyIcon}>
            <TicketX size={36} />
          </div>
          <h2 className={styles.emptyTitle}>Aún no tienes boletas</h2>
          <p className={styles.emptySub}>Registra tu primera boleta y empieza a llevar el control de tus rifas, loterías y sorteos.</p>
          <Link href="/tickets?new=1" className={styles.emptyBtn}>
            <Plus size={16} />
            Registrar mi primera boleta
          </Link>
        </div>
      ) : (
        <div className={`${styles.bottom} stagger`}>
          <div className={`${styles.charts} anim-fade-up`}>
            <StatusChart data={stats?.byStatus ?? []} />
            <GameTypeChart data={stats?.byGameType ?? []} />
          </div>

          <Link href="/tickets?new=1" className={`${styles.cta} anim-fade-up`}>
            <div className={styles.ctaLeft}>
              <div className={styles.ctaIcon}>
                <Plus size={20} />
              </div>
              <div>
                <p className={styles.ctaTitle}>Registra una nueva boleta</p>
                <p className={styles.ctaSub}>Lleva el control de todas tus rifas, loterías y sorteos</p>
              </div>
            </div>
            <ArrowRight size={18} className={styles.ctaArrow} />
          </Link>
        </div>
      )}
    </div>
  )
}
