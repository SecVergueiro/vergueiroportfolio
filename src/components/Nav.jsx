import { useLang } from '../context/LangContext'
import styles from './Nav.module.css'

export default function Nav() {
  const { lang, toggle, t } = useLang()
  const nav = t.nav

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
      <a href="#inicio" className={styles.brand} aria-label="Início">
        I<span>V</span>
      </a>
      <ul className={styles.links} role="list">
        {LINKS.map(l => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
      <button
        className={styles.langBtn}
        onClick={toggle}
        aria-label={lang === 'pt' ? 'Switch to English' : 'Mudar para Português'}
        title={lang === 'pt' ? 'Switch to English' : 'Mudar para Português'}
      >
        {lang === 'pt' ? 'EN' : 'PT'}
      </button>
    </nav>
  )
}
