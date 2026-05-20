'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PaginationMeta } from '@/domain/entities/ticket'
import styles from './Pagination.module.css'

interface Props {
  meta: PaginationMeta
  onPage: (page: number) => void
}

export function Pagination({ meta, onPage }: Props) {
  const { page, totalPages, total, pageSize } = meta
  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className={styles.wrapper}>
      <span className={styles.info}>
        {from}–{to} de {total}
      </span>
      <div className={styles.controls}>
        <button
          className={styles.btn}
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>
        <span className={styles.pages}>
          {page} / {totalPages}
        </span>
        <button
          className={styles.btn}
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
