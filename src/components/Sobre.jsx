import { useLang } from '../context/LangContext'
import { useReveal } from '../hooks/useReveal'
import styles from './Sobre.module.css'

function HTML({ text }) {
  return <span dangerouslySetInnerHTML={{ __html: text }} />
}

export default function Sobre() {
  const { t } = useLang()
  const s = t.sobre
  const sideRef = useReveal()
  const bodyRef = useReveal()

  return (
    <section id="sobre" className={styles.sobre}>
      <div className="sec-wrap">
        <div className={`${styles.inner} sec-wrap-inner`}>

          <div ref={sideRef} className={`${styles.side} reveal`}>
            <p className="sec-label">{s.label}</p>
            <h2 className="sec-heading">
              {s.heading[0]}<br /><span>{s.heading[1]}</span><br />{s.heading[2]}
            </h2>
            <div className={styles.stats}>
              {s.stats.map(st => (
                <div key={st.lbl} className={styles.statRow}>
                  <div className={styles.statNum}>{st.num}</div>
                  <div className={styles.statLbl}>{st.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          <div ref={bodyRef} className={`${styles.body} reveal`}>
            <p><HTML text={s.p1} /></p>
            <p><HTML text={s.p2} /></p>
            <p><HTML text={s.p3} /></p>
          </div>

        </div>
      </div>
    </section>
  )
}
