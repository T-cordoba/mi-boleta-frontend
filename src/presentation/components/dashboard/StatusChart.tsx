'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import styles from './Chart.module.css'

interface Props {
  data: { name: string; value: number; color: string }[]
}

export function StatusChart({ data }: Props) {
  const hasData = data.some((d) => d.value > 0)

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Por estado</h3>
      {hasData ? (
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
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className={styles.empty}>Sin datos aún</div>
      )}
    </div>
  )
}
