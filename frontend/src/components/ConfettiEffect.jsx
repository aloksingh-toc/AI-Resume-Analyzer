import { useEffect, useRef } from 'react'

/**
 * Confetti burst animation triggered when the user gets a high score.
 * Renders on a canvas overlay for 2.5 seconds, then auto-removes.
 */
export default function ConfettiEffect({ active }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#22c55e', '#f59e0b', '#3b82f6', '#06b6d4']
    const particles = Array.from({ length: 120 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.5) * 14 - 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      opacity: 1,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }))

    const gravity = 0.3
    const friction = 0.98
    let animId
    let startTime = performance.now()

    const draw = (now) => {
      const elapsed = (now - startTime) / 1000
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let alive = false
      particles.forEach(p => {
        p.vy += gravity
        p.vx *= friction
        p.vy *= friction
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.opacity = Math.max(0, 1 - elapsed / 2.5)

        if (p.opacity > 0.01) {
          alive = true
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rotation * Math.PI) / 180)
          ctx.globalAlpha = p.opacity
          ctx.fillStyle = p.color

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
          } else {
            ctx.beginPath()
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.restore()
        }
      })

      if (alive && elapsed < 3) {
        animId = requestAnimationFrame(draw)
      }
    }

    animId = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(animId)
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 999,
        pointerEvents: 'none',
      }}
    />
  )
}
