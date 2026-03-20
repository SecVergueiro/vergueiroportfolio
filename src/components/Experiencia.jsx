import { useEffect, useRef } from 'react'
import { EXPERIENCIAS } from '../data'
import { useReveal } from '../hooks/useReveal'
import { useLang } from '../context/LangContext'
import styles from './Experiencia.module.css'

export default function Experiencia() {
  const { lang, t } = useLang()
  const exp = t.experiencia
  const titleRef = useReveal()
  const itemRefs = useRef([])
  const data = t.experiencias_data

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add(styles.visible), i * 180)
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    itemRefs.current.forEach(el => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="experiencia" className={styles.exp} aria-labelledby="exp-heading">
      <div className="sec-wrap">
        <div className={styles.inner}>
          <div ref={titleRef} className="reveal">
            <p className="sec-label">{exp.label}</p>
            <h2 className="sec-heading" id="exp-heading">
              {exp.heading[0]}<span>{exp.heading[1]}</span>
            </h2>
          </div>

          <div className={styles.timeline} role="list">
            {data.map((e, i) => (
              <div key={i} ref={el => (itemRefs.current[i] = el)}
                className={styles.item} role="listitem">
                <p className={styles.period}>{e.periodo}</p>
                <p className={styles.role}>{e.cargo}</p>
                <p className={styles.company}>{e.empresa}</p>
                {e.tags.length > 0 && (
                  <div className={styles.tags}>
                    {e.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
