import Link from 'next/link'
import { Ticket, ShieldCheck, Bell, Search } from 'lucide-react'
import styles from './page.module.css'

const FEATURES = [
  {
    icon: <Ticket size={22} />,
    title: 'Registra todo',
    desc: 'Loterías, rifas, sorteos, boletas y juegos ocasionales en un solo lugar.',
  },
  {
    icon: <Bell size={22} />,
    title: 'No te olvides',
    desc: 'Guarda la fecha del sorteo y el número jugado para no perder rastro.',
  },
  {
    icon: <Search size={22} />,
    title: 'Busca y filtra',
    desc: 'Encuentra cualquier boleta por nombre, número, tipo o estado al instante.',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Tu información segura',
    desc: 'Cuenta personal protegida con autenticación JWT. Solo tú ves tus boletas.',
  },
]

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} />

      {/* Navbar */}
      <header className={styles.nav}>
        <div className={styles.navBrand}>
          <Ticket size={24} color="#f43f5e" />
          <span className={styles.navName}>MiBoleta</span>
        </div>
        <div className={styles.navActions}>
          <Link href="/login" className={styles.navLink}>Iniciar sesión</Link>
          <Link href="/register" className={styles.navCta}>Crear cuenta</Link>
        </div>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={`${styles.tagline} anim-fade-up`} style={{ animationDelay: '0.05s' }}>
          ¿Y si sí me lo gané?
        </div>
        <h1 className={`${styles.heroTitle} anim-fade-up`} style={{ animationDelay: '0.15s' }}>
          Nunca vuelvas a perder
          <br />
          <span className={styles.heroAccent}>una boleta ganadora</span>
        </h1>
        <p className={`${styles.heroSubtitle} anim-fade-up`} style={{ animationDelay: '0.25s' }}>
          Registra y organiza todas tus rifas, loterías y sorteos. Con MiBoleta
          siempre sabes qué número jugaste, cuándo es el sorteo y si ganaste.
        </p>
        <div className={`${styles.heroCtas} anim-fade-up`} style={{ animationDelay: '0.35s' }}>
          <Link href="/register" className={styles.ctaPrimary}>
            Comenzar gratis
          </Link>
          <Link href="/login" className={styles.ctaSecondary}>
            Ya tengo cuenta
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className={`${styles.features} stagger`}>
        {FEATURES.map(({ icon, title, desc }) => (
          <div key={title} className={`${styles.featureCard} anim-fade-up`}>
            <div className={styles.featureIcon}>{icon}</div>
            <h3 className={styles.featureTitle}>{title}</h3>
            <p className={styles.featureDesc}>{desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>MiBoleta · {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
