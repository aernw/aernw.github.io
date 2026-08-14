import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { useSide } from '../side/SideContext'
import { DEFAULT_CONFIG, anchor, createChain, impulse, step, toPath } from './simulation'
import './Thread.css'

/** Point d'ancrage du fil, en fraction de la largeur de la fenêtre. */
const ANCHOR_X_RATIO = 0.5
/** Convertit un delta de scroll en impulsion latérale. */
const SCROLL_TO_IMPULSE = 0.06
/** Impulsion maximale par frame : au-delà, le fil part en vrille. */
const MAX_IMPULSE = 9

interface ThreadProps {
  /**
   * Position d'ancrage en pixels, fournie par la cassette pour que le fil parte
   * réellement de l'objet.
   *
   * Passée par référence et non par valeur : la cassette la met à jour à chaque
   * frame, et une prop classique provoquerait un rendu React par frame.
   */
  readonly anchorRef?: RefObject<{ x: number; y: number }> | undefined
}

/**
 * Lit l'ancrage fourni par la cassette.
 *
 * Tant que la cassette ne s'est pas mesurée, sa position vaut {0,0} : accrocher
 * le fil là ferait partir le tracé du coin supérieur gauche. On retombe alors
 * sur une position par défaut.
 */
function readAnchor(
  ref: RefObject<{ x: number; y: number }> | undefined,
  fallbackX: number,
): { x: number; y: number } {
  const point = ref?.current
  if (point === undefined || point === null) return { x: fallbackX, y: 0 }
  if (point.x === 0 && point.y === 0) return { x: fallbackX, y: 0 }
  return point
}

/**
 * Le fil d'écouteurs qui traverse la page en fond.
 *
 * Un seul tracé continu, ancré à la cassette et retombant derrière tout le
 * contenu — c'est lui qui relie les deux faces du site et signale qu'il s'agit
 * du même endroit.
 *
 * Toute la simulation vit hors de React : le state React à 60 fps déclencherait
 * un rendu par frame. Ici, seul l'attribut `d` du tracé est muté directement
 * dans le DOM.
 */
export function Thread({ anchorRef }: ThreadProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const { side } = useSide()

  useEffect(() => {
    const path = pathRef.current
    if (path === null) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const syncViewBox = () => {
      const svg = svgRef.current
      if (svg === null) return
      svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`)
    }

    // Le viewBox doit exister dans les deux cas : sans lui, le SVG n'a pas de
    // système de coordonnées et le tracé se retrouve hors cadre.
    syncViewBox()

    const startX = window.innerWidth * ANCHOR_X_RATIO
    const points = createChain(startX, 0, DEFAULT_CONFIG)

    // Sans animation demandée, on dessine une courbe statique une fois pour
    // toutes : le fil reste présent, mais ne bouge plus.
    if (prefersReducedMotion) {
      // Le tracé est recalculé quand l'ancrage change (la cassette se déplace
      // entre son état hero et son état flottant), mais jamais animé.
      /**
       * Fait retomber le fil à sa position d'équilibre sous son ancrage.
       * `passes` est élevé au premier tracé (le fil part de rien) puis faible
       * pendant le suivi, où il ne s'agit que de rattraper un petit déplacement.
       */
      const settle = (passes: number) => {
        const point = readAnchor(anchorRef, startX)
        anchor(points, point.x, point.y)

        for (let i = 0; i < passes; i += 1) {
          step(points, DEFAULT_CONFIG, 1)
        }
        path.setAttribute('d', toPath(points))
      }

      // Un premier tracé tout de suite, pour que le fil existe dès le montage.
      // Il peut partir du repli si la cassette n'a pas encore publié sa
      // position ; le suivi ci-dessous le raccroche dès qu'elle le fait.
      settle(200)

      // Second passage après le cycle de montage : le fil est monté avant la
      // cassette dans l'arbre, sa position n'est donc pas encore publiée ici.
      const settleTimer = window.setTimeout(() => settle(200), 0)

      // Puis on suit la position de l'ancrage : la cassette la publie après son
      // propre montage et la déplace entre ses deux états. Se reposer sur
      // l'événement scroll ne suffit pas — la cassette bouge aussi par
      // transition CSS, sans qu'aucun scroll ne soit émis.
      let lastX = -1
      let lastY = -1
      let frame = 0

      const track = () => {
        const point = readAnchor(anchorRef, startX)
        if (point.x !== lastX || point.y !== lastY) {
          lastX = point.x
          lastY = point.y
          settle(6)
        }
        frame = window.requestAnimationFrame(track)
      }

      frame = window.requestAnimationFrame(track)
      window.addEventListener('resize', syncViewBox)

      return () => {
        window.clearTimeout(settleTimer)
        window.cancelAnimationFrame(frame)
        window.removeEventListener('resize', syncViewBox)
      }
    }

    let frame = 0
    let lastTime = performance.now()
    let lastScrollY = window.scrollY
    let pendingImpulse = 0

    const onScroll = () => {
      const delta = window.scrollY - lastScrollY
      lastScrollY = window.scrollY
      // Le sens du balancement suit celui du scroll.
      pendingImpulse += Math.max(-MAX_IMPULSE, Math.min(MAX_IMPULSE, -delta * SCROLL_TO_IMPULSE))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', syncViewBox)

    const loop = (time: number) => {
      // Normalisé pour 60 fps, et borné : un onglet en arrière-plan produit des
      // deltas énormes qui feraient exploser la simulation au retour.
      const dt = Math.min(2.5, (time - lastTime) / 16.667)
      lastTime = time

      const point = readAnchor(anchorRef, window.innerWidth * ANCHOR_X_RATIO)
      anchor(points, point.x, point.y)

      if (pendingImpulse !== 0) {
        impulse(points, pendingImpulse)
        pendingImpulse *= 0.55
        if (Math.abs(pendingImpulse) < 0.01) pendingImpulse = 0
      }

      step(points, DEFAULT_CONFIG, dt)
      path.setAttribute('d', toPath(points))

      frame = window.requestAnimationFrame(loop)
    }

    frame = window.requestAnimationFrame(loop)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', syncViewBox)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className="thread"
      aria-hidden="true"
      preserveAspectRatio="none"
      data-side={side}
    >
      <path ref={pathRef} className="thread__path" fill="none" />
    </svg>
  )
}
