import { useEffect, useState } from 'react'

/** True once the page has scrolled past `factor` × viewport height. Passive and rAF throttled. */
export function useScrolledPast(factor: number) {
  const [past, setPast] = useState(false)
  useEffect(() => {
    let raf = 0
    const check = () => {
      raf = 0
      setPast(window.scrollY > window.innerHeight * factor)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check) }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [factor])
  return past
}
