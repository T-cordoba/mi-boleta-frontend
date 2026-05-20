'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import styles from './Chart.module.css'

interface Props {
  data: { name: string; count: number }[]
}

const COLORS = ['#6366f1', '#818cf8', '#a78bfa', '#60a5fa', '#34d399']

export function GameTypeChart({ data }: Props) {
  const hasData = data.length > 0

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Por tipo de juego</h3>
      {hasData ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barSize={20}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(99,102,241,0.06)' }}
              contentStyle={{
                background: '#121220',
                border: '1px solid rgba(99,102,241,0.18)',
                borderRadius: '10px',
                color: '#f1f5f9',
                fontSize: 12,
              }}
              labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
              itemStyle={{ color: '#f1f5f9' }}
            />
            <Bar dataKey="count" name="Boletas" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className={styles.empty}>Sin datos aún</div>
      )}
    </div>
  )
}
