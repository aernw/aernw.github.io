import { useEffect } from 'react'

/** Degrés de rotation par pixel défilé : un tour complet tous les 1 440 px. */
const DEGREES_PER_PIXEL = 0.25

/**
 * Fait tourner les disques au rythme du défilement.
 *
 * Une seule écoute pour toute la page : la rotation est posée dans la
 * variable `--scroll-turn` de la racine, que la sérigraphie de chaque disque
 * lit. Une mise à jour par image au plus.
 *
 * Avec `prefers-reduced-motion`, les disques restent immobiles.
 */
export function useScrollTurn(): void {
  useEffect(() => {
    const root = document.documentElement
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const update = () => {
      frame = 0
      root.style.setProperty('--scroll-turn', `${(window.scrollY * DEGREES_PER_PIXEL).toFixed(1)}deg`)
    }

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update)
    }

    const sync = () => {
      window.removeEventListener('scroll', onScroll)
      if (frame !== 0) cancelAnimationFrame(frame)
      frame = 0

      if (motion.matches) {
        root.style.removeProperty('--scroll-turn')
        return
      }

      update()
      window.addEventListener('scroll', onScroll, { passive: true })
    }

    sync()
    motion.addEventListener('change', sync)

    return () => {
      motion.removeEventListener('change', sync)
      window.removeEventListener('scroll', onScroll)
      if (frame !== 0) cancelAnimationFrame(frame)
      root.style.removeProperty('--scroll-turn')
    }
  }, [])
}
