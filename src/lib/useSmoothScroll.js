import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ duration: 1.15, lerp: 0.085, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    let programmatic = false

    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]')
      if (!a || a.classList.contains('skip')) return
      const id = a.getAttribute('href')
      if (id.length < 2) return
      const el = document.querySelector(id)
      if (!el) return
      e.preventDefault()
      programmatic = true
      lenis.scrollTo(el, { offset: 0, duration: 1.4, onComplete: () => (programmatic = false) })
    }
    document.addEventListener('click', onClick)

    // ---- scroll snapping: al detenerse cerca de una zona, la cámara "aterriza" en su borde ----
    // No es un snap forzado de una pantalla por scroll (varias zonas son más altas que el viewport
    // y necesitan poder leerse en scroll libre); en cambio, cuando el usuario se detiene YA cerca
    // de un límite de zona, se termina de acomodar suavemente — como una cámara que hace foco al
    // dejar de moverse, no como un salto brusco entre diapositivas.
    const snapEligible = () => Array.from(document.querySelectorAll('.zone')).filter((el) => !el.classList.contains('track-pin'))
    // el rango pineado de Z04 (scroll horizontal) no es solo un target inválido: mientras el
    // usuario esté DENTRO de ese rango, tampoco hay que "tirar" de él hacia z03/z05 — está ocupado
    // en el scroll horizontal, no detenido entre zonas.
    const pinnedRange = () => {
      const st = ScrollTrigger.getAll().find((t) => t.trigger?.classList?.contains('track-pin'))
      return st ? [st.start, st.end] : null
    }

    let settleTimer
    const trySettle = () => {
      if (programmatic) return
      const els = snapEligible()
      if (!els.length) return
      const y = window.scrollY
      const pinned = pinnedRange()
      if (pinned && y >= pinned[0] && y <= pinned[1]) return
      let nearest = null
      let nearestDist = Infinity
      for (const el of els) {
        const d = Math.abs(el.offsetTop - y)
        if (d < nearestDist) {
          nearestDist = d
          nearest = el
        }
      }
      if (!nearest || nearestDist <= 6 || nearestDist > window.innerHeight * 0.62) return
      programmatic = true
      document.documentElement.classList.add('is-settling')
      lenis.scrollTo(nearest, {
        offset: 0,
        duration: 0.9,
        onComplete: () => {
          programmatic = false
          document.documentElement.classList.remove('is-settling')
        },
      })
    }
    const onSettleCheck = () => {
      clearTimeout(settleTimer)
      settleTimer = setTimeout(trySettle, 160)
    }
    lenis.on('scroll', onSettleCheck)

    return () => {
      document.removeEventListener('click', onClick)
      clearTimeout(settleTimer)
      gsap.ticker.remove(raf)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])
}
