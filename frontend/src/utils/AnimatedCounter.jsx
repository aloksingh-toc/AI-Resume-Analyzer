import { useState, useEffect } from 'react'

/**
 * Animated counter that counts up from 0 to the target number.
 * Used for score display with a smooth easing animation.
 */
export default function AnimatedCounter({ target, duration = 1200, style = {} }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (target === 0) { setCount(0); return }
    const startTime = performance.now()
    let raf

    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return <span style={style}>{count}</span>
}
