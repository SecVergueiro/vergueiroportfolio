import { useLang } from '../context/LangContext'
import styles from './Footer.module.css'

export default function Footer() {
  const { t } = useLang()
  const f = t.footer
  return (
    <footer className={styles.footer}>
      <p>© 2025 <span className={styles.accent}>Isaque Vergueiro</span>. {f.direitos}</p>
      <p className={styles.quote}>{f.tagline}</p>
    </footer>
  )
}
