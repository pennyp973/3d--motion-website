import { useEffect, useRef } from 'react'

// A plain requestAnimationFrame loop. Unlike gsap.ticker, this can never
// auto-sleep — the overlay must track scroll state every single frame.
export function useRafLoop(fn) {
  const fnRef = useRef(fn)
  fnRef.current = fn
  useEffect(() => {
    let raf
    const loop = () => {
      fnRef.current()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
}
