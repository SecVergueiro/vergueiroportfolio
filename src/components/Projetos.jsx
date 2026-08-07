import { useState, useMemo, useEffect } from 'react'
import { PROJETOS, SISVAC } from '../data'
import { useReveal } from '../hooks/useReveal'
import { useLang } from '../context/LangContext'
import Modal from './Modal'
import styles from './Projetos.module.css'

const LIMITE = 6

function projetoTraduzido(projeto, pd) {
  const tr = pd?.[projeto.id]
  if (!tr) return projeto
  return { ...projeto, resumo: tr.resumo, descricao: tr.descricao }
}

function ProjetoCard({ projeto, onClick, txt, pd }) {
  const proj = projetoTraduzido(projeto, pd)
  return (
    <article
      className={styles.card}
      onClick={() => onClick(proj)}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes de ${proj.titulo}`}
      onKeyDown={e => e.key === 'Enter' && onClick(proj)}
    >
      <div className={styles.cardImg}>
        <img src={proj.thumbnail} alt={proj.titulo} loading="lazy"
          onError={e => { e.target.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='170'><rect width='400' height='170' fill='%23161620'/><text x='200' y='90' text-anchor='middle' fill='%235a5a70' font-size='14' font-family='sans-serif'>${proj.titulo}</text></svg>` }} />
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{proj.titulo}</h3>
        <p className={styles.cardDesc}>{proj.resumo}</p>
        <div className={styles.cardChips}>
          {proj.tecnologias.slice(0, 4).map(t => (
            <span key={t} className={styles.cardChip}>{t}</span>
          ))}
        </div>
      </div>
      <div className={styles.cardActions}>
        <a href={proj.linkHospedagem} target="_blank" rel="noopener noreferrer"
          className={`${styles.pcBtn} ${styles.primary}`} onClick={e => e.stopPropagation()}>
          {txt.demo}
        </a>
        <a href={proj.linkRepositorio} target="_blank" rel="noopener noreferrer"
          className={`${styles.pcBtn} ${styles.ghost}`} onClick={e => e.stopPropagation()}>
          {txt.repo}
        </a>
        <button className={`${styles.pcBtn} ${styles.ghost}`}
          onClick={e => { e.stopPropagation(); onClick(proj) }}>
          {txt.detalhes}
        </button>
      </div>
    </article>
  )
}

export default function Projetos() {
  const { t } = useLang()
  const p  = t.projetos
  const pd = t.projetos_data

  const [filtro, setFiltro]     = useState('')
  const [verTodos, setVerTodos] = useState(false)
  const [modal, setModal]       = useState(null)

  const headerRef = useReveal()

  const lista = useMemo(() => {
    if (!filtro) return PROJETOS
    const todos = [SISVAC, ...PROJETOS]
    return todos.filter(proj =>
      proj.tecnologias.some(tech => tech.toLowerCase().includes(filtro.toLowerCase()))
    )
  }, [filtro])

  const exibidos = verTodos ? lista : lista.slice(0, LIMITE)

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll(`#projetos .${styles.card}`)
        .forEach(el => el.classList.add('visible'))
    }, 50)
    return () => clearTimeout(timer)
  }, [exibidos])

  const sisvacTraduzido = { ...SISVAC, ...pd?.sisvac }

  return (
    <section id="projetos" className={styles.projetos}>
      <div className="sec-wrap">
        <div className={styles.inner}>

          <div ref={headerRef} className={`reveal ${styles.header}`}>
            <div>
              <p className="sec-label">{p.label}</p>
              <h2 className="sec-heading">{p.heading[0]}<span>{p.heading[1]}</span></h2>
            </div>
            <input
              className={styles.filter}
              placeholder={p.filtroPlaceholder}
              value={filtro}
              onChange={e => { setFiltro(e.target.value); setVerTodos(false) }}
              aria-label={p.filtroPlaceholder}
            />
          </div>

          {!filtro && (
            <div className={styles.vitrine}>
              <p className={styles.vitrineLbl}><span>{p.vitrineLbl}</span></p>
              <div className={styles.vitrineCard} onClick={() => setModal(sisvacTraduzido)}
                role="button" tabIndex={0} aria-label="Ver detalhes do SISVAC"
                onKeyDown={e => e.key === 'Enter' && setModal(sisvacTraduzido)}>
                <div className={styles.vitImg}>
                  {/* 1,5 MB de PNG: sem lazy/async o decode acontece na thread
                      principal e trava a página antes de a seção aparecer. */}
                  <img src={SISVAC.thumbnail || SISVAC.imagens?.[0]} alt="SISVAC"
                    loading="lazy" decoding="async" />
                </div>
                <div className={styles.vitInfo}>
                  <span className={styles.vitBadge}>{sisvacTraduzido.badge}</span>
                  <h3 className={styles.vitTitle}>{sisvacTraduzido.titulo}</h3>
                  <p className={styles.vitDesc}>{sisvacTraduzido.descricao}</p>
                  <div className={styles.vitTechs}>
                    {SISVAC.tecnologias.map(tech => (
                      <span key={tech} className="chip">{tech}</span>
                    ))}
                  </div>
                  <div className={styles.vitActions}>
                    <a href={SISVAC.linkHospedagem} target="_blank" rel="noopener noreferrer"
                      className="btn btn-red" onClick={e => e.stopPropagation()}>
                      {p.verProjeto}
                    </a>
                    <button className="btn btn-ghost"
                      onClick={e => { e.stopPropagation(); setModal(sisvacTraduzido) }}>
                      {p.detalhes}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.grid}>
            {exibidos.map(proj => (
              <ProjetoCard key={proj.id} projeto={proj} onClick={setModal} txt={p} pd={pd} />
            ))}
          </div>

          {lista.length > LIMITE && (
            <div className={styles.verMais}>
              <button className="btn btn-ghost" onClick={() => setVerTodos(v => !v)}>
                {verTodos ? p.verMenos : p.verMais}
              </button>
            </div>
          )}

        </div>
      </div>
      <Modal projeto={modal} onClose={() => setModal(null)} />
    </section>
  )
}