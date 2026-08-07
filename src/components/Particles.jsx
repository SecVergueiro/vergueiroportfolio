import { useEffect, useRef } from 'react'

const COLS = ['#cc1a1a','#8a0a0a','#6030a8','#a060ff','rgba(162,0,255,.4)','rgba(255,255,255,.3)']

/**
 * Quantas partículas desenhar. Máquina fraca recebe menos em vez de receber
 * quadros perdidos: o efeito é decorativo e não vale um travamento.
 */
function quantidadeDeParticulas() {
  const nucleos = navigator.hardwareConcurrency ?? 4
  const larguraPequena = window.innerWidth < 768
  if (larguraPequena || nucleos <= 4) return 24
  return 55
}

export default function Particles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    // Quem pediu menos movimento não recebe animação nenhuma — e nem o custo.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d', { alpha: true })
    let W = 0
    let H = 0
    let raf = 0
    let pts = []

    const dimensionar = () => {
      W = window.innerWidth
      H = window.innerHeight
      // Sem isto o canvas sai borrado em tela HiDPI. O teto de 2 existe porque
      // acima disso o ganho visual é nulo e o custo de pintura quadruplica.
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      c.width = Math.round(W * dpr)
      c.height = Math.round(H * dpr)
      c.style.width = `${W}px`
      c.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const nascer = (p, primeiraVez) => {
      // Antes as partículas nasciam em `Math.random() * 1920` — numa janela
      // menor que isso, boa parte nascia fora da tela e nunca aparecia.
      p.x = Math.random() * W
      p.y = primeiraVez ? Math.random() * H : H + 10
      p.life = 0
      p.max = 80 + Math.random() * 200
      return p
    }

    const semear = () => {
      pts = Array.from({ length: quantidadeDeParticulas() }, () =>
        nascer(
          {
            r: 0.6 + Math.random() * 1.8,
            dx: (Math.random() - 0.5) * 0.3,
            dy: -0.1 - Math.random() * 0.4,
            col: COLS[Math.floor(Math.random() * COLS.length)],
            a: 0.1 + Math.random() * 0.5,
          },
          true,
        ),
      )
    }

    dimensionar()
    semear()

    // `resize` dispara em rajada ao arrastar a janela, e cada chamada
    // realocava o canvas. Um frame de atraso é imperceptível e corta o custo.
    let agendado = 0
    const aoRedimensionar = () => {
      cancelAnimationFrame(agendado)
      agendado = requestAnimationFrame(() => {
        dimensionar()
        semear()
      })
    }
    window.addEventListener('resize', aoRedimensionar)

    const desenhar = () => {
      ctx.clearRect(0, 0, W, H)
      for (const p of pts) {
        p.x += p.dx
        p.y += p.dy
        p.life++
        if (p.y < -10 || p.life > p.max) nascer(p, false)

        const f =
          p.life < 15 ? p.life / 15 : p.life > p.max - 15 ? (p.max - p.life) / 15 : 1
        ctx.globalAlpha = p.a * f
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.col
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(desenhar)
    }

    // Aba escondida não precisa de partícula. O rAF já pausa sozinho na maioria
    // dos navegadores, mas parar explícito evita um frame solto na volta.
    const aoTrocarVisibilidade = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(desenhar)
    }
    document.addEventListener('visibilitychange', aoTrocarVisibilidade)

    raf = requestAnimationFrame(desenhar)

    return () => {
      window.removeEventListener('resize', aoRedimensionar)
      document.removeEventListener('visibilitychange', aoTrocarVisibilidade)
      cancelAnimationFrame(agendado)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 0,
        pointerEvents: 'none', display: 'block',
      }}
    />
  )
}
