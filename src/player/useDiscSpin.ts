import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

/** Un tour toutes les 1,6 s : assez lent pour qu'on lise la sérigraphie tourner. */
const TURN_MS = 1600
/** Un lecteur met un instant à lancer le disque, et un peu plus à l'arrêter. */
const SPIN_UP_MS = 700
const SPIN_DOWN_MS = 1200

const easeOut = (t: number) => 1 - (1 - t) ** 3

/**
 * Fait tourner un disque, avec démarrage et arrêt progressifs.
 *
 * La rotation est une Web Animation en boucle : une fois lancée, c'est le
 * compositeur qui la fait tourner, sans JavaScript à chaque image. Seules les
 * rampes passent par `requestAnimationFrame`, le temps de faire varier la
 * vitesse — le disque repart donc de l'angle où il s'était arrêté.
 *
 * Avec `prefers-reduced-motion`, le disque reste immobile : l'afficheur suffit
 * à dire qu'il joue.
 */
export function useDiscSpin(ref: RefObject<Element | null>, spinning: boolean): void {
  const animationRef = useRef<Animation | null>(null)

  useEffect(() => {
    const node = ref.current
    if (node === null || typeof node.animate !== 'function') return

    const animation = node.animate([{ transform: 'rotate(0turn)' }, { transform: 'rotate(1turn)' }], {
      duration: TURN_MS,
      iterations: Infinity,
    })
    animation.pause()
    animationRef.current = animation

    return () => {
      animation.cancel()
      animationRef.current = null
    }
  }, [ref])

  useEffect(() => {
    const animation = animationRef.current
    if (animation === null) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animation.pause()
      return
    }

    const from = animation.playState === 'running' ? animation.playbackRate : 0
    const to = spinning ? 1 : 0
    if (from === to) return

    const rampMs = spinning ? SPIN_UP_MS : SPIN_DOWN_MS
    let frame = 0
    let start: number | null = null

    // Une vitesse nulle figerait l'animation dès `play()` : on démarre à peine au-dessus.
    if (spinning && animation.playState !== 'running') {
      animation.playbackRate = 0.01
      animation.play()
    }

    const step = (now: number) => {
      start ??= now
      const progress = Math.min((now - start) / rampMs, 1)
      animation.playbackRate = Math.max(from + (to - from) * easeOut(progress), 0.01)

      if (progress < 1) {
        frame = requestAnimationFrame(step)
      } else if (!spinning) {
        animation.pause()
      }
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [spinning])
}
