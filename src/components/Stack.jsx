import { useEffect, useRef } from 'react'
import { STACK, IDIOMAS } from '../data'
import { useReveal } from '../hooks/useReveal'
import { useLang } from '../context/LangContext'
import styles from './Stack.module.css'

function StackGrid({ items }) {
  const gridRef = useRef(null)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.' + styles.si).forEach(card => card.classList.add(styles.in))
          obs.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={gridRef} className={styles.grid}>
      {items.map((item, i) => (
        <div key={item.nome} className={styles.si} style={{ '--d': `${i * 0.07}s` }} title={item.nome}>
          {item.icon
            ? <i className={item.icon} style={{ color: item.cor, fontSize: '2.4rem', lineHeight: 1, filter: `drop-shadow(0 0 5px ${item.cor})` }} aria-hidden="true" />
            : <img src={item.img} alt={item.nome} className={styles.iconImg} />
          }
          <span>{item.nome}</span>
        </div>
      ))}
    </div>
  )
}

function LangBar({ nome, nivel, pct, nivelLabel }) {
  const fillRef = useRef(null)

  useEffect(() => {
    const el = fillRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.style.width = pct + '%'; obs.unobserve(el) }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [pct])

  return (
    <div className={styles.langRow}>
      <span className={styles.langName}>{nome}</span>
      <div className={styles.langTrack} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${nome}: ${nivelLabel}`}>
        <div ref={fillRef} className={styles.langFill} />
      </div>
      <span className={styles.langLvl}>{nivelLabel}</span>
    </div>
  )
}

export default function Stack() {
  const { t } = useLang()
  const s = t.stack
  const titleRef = useReveal()
  const langRef  = useReveal()

  const cats = [
    { label: s.frontend, count: STACK.frontend.length, items: STACK.frontend },
    { label: s.backend,  count: STACK.backend.length,  items: STACK.backend  },
    { label: s.tools,    count: STACK.tools.length,    items: STACK.tools    },
  ]

  return (
    <section id="stack" className={styles.stack}>
      <div className="sec-wrap">
        <div className={styles.inner}>

          <div ref={titleRef} className="reveal">
            <p className="sec-label">{s.label}</p>
            <h2 className="sec-heading">{s.heading[0]}<span>{s.heading[1]}</span></h2>
          </div>

          {cats.map(cat => (
            <div key={cat.label} className={styles.catBlock}>
              <div className={styles.catTitle}>
                {cat.label}
                <span className={styles.catNum}>{String(cat.count).padStart(2, '0')}</span>
              </div>
              <StackGrid items={cat.items} />
            </div>
          ))}

          <div ref={langRef} className={`reveal ${styles.langBlock}`}>
            <div className={styles.langTitle}>{s.idiomas}</div>
            <div className={styles.langRows}>
              {IDIOMAS.map(l => (
                <LangBar key={l.nome} {...l} nivelLabel={s.niveis[l.nivel] || l.nivel} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
