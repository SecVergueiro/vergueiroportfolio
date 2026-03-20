import { useState, useEffect, useCallback } from 'react'
import { STACK } from '../data'
import { useLang } from '../context/LangContext'
import styles from './Modal.module.css'

const ALIASES = {
  'html':     'html5',
  'css':      'css3',
  'nodejs':   'node.js',
  'node':     'node.js',
  'supabase': 'supabase',
}

const ICON_MAP = {}
;[...STACK.frontend, ...STACK.backend, ...STACK.tools].forEach(s => {
  ICON_MAP[s.nome.toLowerCase()] = { icon: s.icon, img: s.img, cor: s.cor }
})

function TechChip({ nome }) {
  const raw  = nome.toLowerCase()
  const key  = ALIASES[raw] ?? raw
  const meta = ICON_MAP[key]
  return (
    <span className={styles.techChip}>
      {meta?.icon
        ? <i className={meta.icon} style={{ color: meta.cor, fontSize: '1rem', filter: `drop-shadow(0 0 3px ${meta.cor})` }} aria-hidden="true" />
        : meta?.img
          ? <img src={meta.img} alt={nome} style={{ width: '1rem', height: '1rem', objectFit: 'contain' }} />
          : null
      }
      {nome}
    </span>
  )
}

export default function Modal({ projeto, onClose }) {
  const { t } = useLang()
  const m = t.modal
  const [idx, setIdx] = useState(0)

  const imagens = projeto?.imagens || (projeto?.thumbnail ? [projeto.thumbnail] : [])
  const multi = imagens.length > 1

  const prev = useCallback(() => setIdx(i => (i - 1 + imagens.length) % imagens.length), [imagens.length])
  const next = useCallback(() => setIdx(i => (i + 1) % imagens.length), [imagens.length])

  useEffect(() => { setIdx(0) }, [projeto])

  useEffect(() => {
    if (!projeto) return
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [projeto, onClose])

  useEffect(() => {
    document.body.style.overflow = projeto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [projeto])

  if (!projeto) return null

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true"
      aria-labelledby="modal-titulo"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.box}>
        <button className={styles.close} onClick={onClose} aria-label={m.fechar}>✕</button>

        <div className={styles.carousel} role="region" aria-label="Imagens do projeto">
          <img src={imagens[idx]} alt={`${projeto.titulo} — imagem ${idx + 1}`} className={styles.img} />
          {multi && (
            <>
              <button className={`${styles.carBtn} ${styles.prev}`} onClick={prev} aria-label={m.imgAnterior}>‹</button>
              <button className={`${styles.carBtn} ${styles.next}`} onClick={next} aria-label={m.proxImg}>›</button>
              <span className={styles.count} aria-live="polite">{idx + 1} / {imagens.length}</span>
            </>
          )}
        </div>

        <div className={styles.body}>
          {projeto.badge && <p className={styles.badge}>{projeto.badge}</p>}
          <h3 className={styles.titulo} id="modal-titulo">{projeto.titulo}</h3>
          <p className={styles.desc}>{projeto.descricao}</p>
          <div className={styles.chips}>
            {projeto.tecnologias.map(tech => <TechChip key={tech} nome={tech} />)}
          </div>
          <div className={styles.actions}>
            <a href={projeto.linkHospedagem} target="_blank" rel="noopener noreferrer" className="btn btn-red">
              {m.abrirProjeto}
            </a>
            <a href={projeto.linkRepositorio} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              {m.repositorio}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}