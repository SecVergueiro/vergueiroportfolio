import { useState } from 'react'
import { useLang } from '../context/LangContext'
import styles from './Nav.module.css'

export default function Nav() {
  const { lang, toggle, t } = useLang()
  const nav = t.nav
  const [aberto, setAberto] = useState(false)

  const LINKS = [
    { href: '#inicio',      label: nav.inicio      },
    { href: '#sobre',       label: nav.sobre       },
    { href: '#experiencia', label: nav.experiencia },
    { href: '#stack',       label: nav.stack       },
    { href: '#projetos',    label: nav.projetos    },
    { href: '#contato',     label: nav.contato     },
  ]

  return (
    <nav className={styles.nav} role="navigation" aria-label="Menu principal">
      <a href="#inicio" className={styles.brand} aria-label="Inicio">
        I<span>V</span>
      </a>

      <ul className={styles.links} role="list">
        {LINKS.map(l => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>

      <div className={styles.navRight}>
        <button
          className={styles.langBtn}
          onClick={toggle}
          aria-label={lang === 'pt' ? 'Switch to English' : 'Mudar para Portugues'}
        >
          {lang === 'pt' ? 'EN' : 'PT'}
        </button>

        <button
          className={styles.hamburger}
          onClick={() => setAberto(v => !v)}
          aria-label="Abrir menu"
          aria-expanded={aberto}
        >
          <span className={aberto ? styles.hBarTop : ''} />
          <span className={aberto ? styles.hBarMid : ''} />
          <span className={aberto ? styles.hBarBottom : ''} />
        </button>
      </div>

      {aberto && (
        <div className={styles.mobileMenu}>
          {LINKS.map(l => (
            <a key={l.href} href={l.href} className={styles.mobileLink} onClick={() => setAberto(false)}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}