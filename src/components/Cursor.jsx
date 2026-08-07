import { useEffect, useRef, useState } from 'react'
import styles from './Cursor.module.css'

/**
 * Cursor customizado só faz sentido onde existe um ponteiro fino de verdade e
 * onde a pessoa não pediu menos movimento. No toque ele é peso morto.
 */
const CONSULTA = '(pointer: fine) and (prefers-reduced-motion: no-preference)'

export default function Cursor() {
  const [ativo, setAtivo] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(CONSULTA).matches,
  )
  const pontoRef = useRef(null)
  const anelRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia(CONSULTA)
    const aoMudar = () => setAtivo(mq.matches)
    mq.addEventListener('change', aoMudar)
    return () => mq.removeEventListener('change', aoMudar)
  }, [])

  useEffect(() => {
    if (!ativo) return
    const ponto = pontoRef.current
    const anel = anelRef.current
    if (!ponto || !anel) return

    const alvo = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const suave = { ...alvo }
    let raf = 0

    // O handler só anota a posição. Escrever no DOM aqui significaria escrever
    // mais vezes do que a tela desenha — mousemove dispara mais que 60 Hz.
    const aoMover = (evento) => {
      alvo.x = evento.clientX
      alvo.y = evento.clientY
    }

    const animar = () => {
      suave.x += (alvo.x - suave.x) * 0.12
      suave.y += (alvo.y - suave.y) * 0.12
      // `translate3d` fica no compositor e não toca em layout. Era `left`/`top`
      // que obrigava o navegador a recalcular a página inteira a cada frame.
      ponto.style.transform = `translate3d(${alvo.x}px, ${alvo.y}px, 0)`
      anel.style.transform = `translate3d(${suave.x}px, ${suave.y}px, 0)`
      raf = requestAnimationFrame(animar)
    }

    window.addEventListener('mousemove', aoMover, { passive: true })
    raf = requestAnimationFrame(animar)

    return () => {
      window.removeEventListener('mousemove', aoMover)
      cancelAnimationFrame(raf)
    }
  }, [ativo])

  if (!ativo) return null

  return (
    <>
      <div ref={pontoRef} className={styles.dot} aria-hidden="true" />
      <div ref={anelRef} className={styles.ring} aria-hidden="true" />
    </>
  )
}
