import { ReactNode } from 'react'
import { Navbar } from './Navbar'
import styles from './AppLayout.module.css'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.root}>
      <Navbar />
      <main className={styles.main}>{children}</main>
    </div>
  )
}
