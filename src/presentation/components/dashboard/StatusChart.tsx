'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import styles from './Chart.module.css'

interface Props {
  data: { name: string; value: number; color: string }[]
}

export function StatusChart({ data }: Props) {
  const hasData = data.some((d) => d.value > 0)
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Por estado</h3>
      {hasData ? (
        <div className={styles.chartRow}>
          <div className={styles.chartArea}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#121220',
                    border: '1px solid rgba(99,102,241,0.18)',
                    borderRadius: '10px',
                    color: '#f1f5f9',
                    fontSize: 12,
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className={styles.legend}>
            {data.map((entry, i) => (
              <li key={i} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: entry.color }} />
                <span className={styles.legendName}>{entry.name}</span>
                <span className={styles.legendPct}>
                  {total > 0 ? Math.round((entry.value / total) * 100) : 0}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={styles.empty}>Sin datos aún</div>
      )}
    </div>
  )
}
