import { useEffect, useRef } from 'react'

const COLS = ['#cc1a1a','#8a0a0a','#6030a8','#a060ff','rgba(162,0,255,.4)','rgba(255,255,255,.3)']

export default function Particles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const c   = canvasRef.current
    const ctx = c.getContext('2d')
    let W, H, raf

    const resize = () => {
      W = c.width  = window.innerWidth
      H = c.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    resize()

    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * 1920, y: Math.random() * 1080,
      r: .6 + Math.random() * 1.8,
      dx: (Math.random() - .5) * .3, dy: -.1 - Math.random() * .4,
      col: COLS[Math.floor(Math.random() * COLS.length)],
      a: .1 + Math.random() * .5,
      life: 0, max: 80 + Math.random() * 200,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      pts.forEach(p => {
        p.x += p.dx; p.y += p.dy; p.life++
        if (p.y < -10 || p.life > p.max) {
          p.x = Math.random() * W; p.y = H + 10
          p.life = 0; p.max = 80 + Math.random() * 200
        }
        const f = p.life < 15 ? p.life / 15 : p.life > p.max - 15 ? (p.max - p.life) / 15 : 1
        ctx.globalAlpha = p.a * f
        ctx.beginPath()
        ctx.arc(p.x % W, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.col
        ctx.fill()
      })
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
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
