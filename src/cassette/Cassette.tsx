import { useCallback, useEffect, useRef, useState } from 'react'
import { useSide } from '../side/SideContext'
import { CassetteShape } from './CassetteShape'
import './Cassette.css'

/** Au-delà de ce scroll, la cassette quitte le hero pour se caler en flottant. */
const DOCK_THRESHOLD_PX = 420
/** Durée du retournement, alignée sur la transition CSS. */
const FLIP_MS = 620
/** Délai d'inactivité avant le mouvement d'appel. */
const IDLE_HINT_MS = 9000

interface CassetteProps {
  /** Reçoit la position du connecteur, d'où part le fil. */
  readonly onAnchorChange?: (point: { x: number; y: number }) => void
}

/**
 * La cassette : objet central du site et unique commande de navigation
 * entre les deux faces.
 *
 * Deux états pour un seul objet — grande dans le hero, réduite et flottante une
 * fois qu'on a scrollé. Le changement de face est un vrai retournement, avec un
 * temps d'animation pendant lequel l'étiquette bascule.
 */
export function Cassette({ onAnchorChange }: CassetteProps) {
  const { side, other, flip } = useSide()
  const [docked, setDocked] = useState(false)
  const [flipping, setFlipping] = useState(false)
  const [hinting, setHinting] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const jackRef = useRef<HTMLSpanElement>(null)

  // Position du connecteur, remontée en continu pour que le fil y reste accroché.
  useEffect(() => {
    if (onAnchorChange === undefined) return

    let frame = 0

    const publish = () => {
      const node = jackRef.current
      if (node === null) return
      const rect = node.getBoundingClientRect()
      onAnchorChange({ x: rect.left + rect.width / 2, y: rect.bottom })
    }

    // Publication immédiate : requestAnimationFrame est suspendu tant que
    // l'onglet est en arrière-plan, et le fil resterait sinon détaché jusqu'au
    // retour de l'utilisateur.
    publish()

    // On mesure le connecteur lui-même plutôt que de calculer une position à
    // partir du conteneur : le SVG porte une transformation 3D, donc son
    // rectangle visuel ne coïncide pas avec celui du conteneur.
    const report = () => {
      publish()
      frame = window.requestAnimationFrame(report)
    }

    frame = window.requestAnimationFrame(report)
    return () => window.cancelAnimationFrame(frame)
  }, [onAnchorChange])

  useEffect(() => {
    const onScroll = () => setDocked(window.scrollY > DOCK_THRESHOLD_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Rappel après inactivité : le choix de face n'étant pas mémorisé, c'est le
  // seul signal qu'une autre moitié du site existe.
  useEffect(() => {
    let timer = window.setTimeout(() => setHinting(true), IDLE_HINT_MS)

    const reset = () => {
      setHinting(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setHinting(true), IDLE_HINT_MS)
    }

    window.addEventListener('scroll', reset, { passive: true })
    window.addEventListener('pointerdown', reset, { passive: true })
    window.addEventListener('keydown', reset)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', reset)
      window.removeEventListener('pointerdown', reset)
      window.removeEventListener('keydown', reset)
    }
  }, [side])

  const handleFlip = useCallback(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      flip()
      return
    }

    setFlipping(true)
    flip()
    window.setTimeout(() => setFlipping(false), FLIP_MS)
  }, [flip])

  const classes = [
    'cassette',
    docked ? 'cassette--docked' : 'cassette--hero',
    flipping ? 'cassette--flipping' : '',
    hinting ? 'cassette--hinting' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={rootRef} className={classes}>
      <button
        type="button"
        className="cassette__button"
        onClick={handleFlip}
        aria-pressed={side === 'b'}
        title={`Retourner la cassette — passer sur la face ${other.toUpperCase()}`}
      >
        <CassetteShape side={side} spinning={!flipping} />
        <span className="visually-hidden">
          Retourner la cassette pour passer sur la face {other.toUpperCase()}
        </span>
      </button>

      {/* Connecteur d'où sort le fil : il rend l'accroche crédible. */}
      <span ref={jackRef} className="cassette__jack" aria-hidden="true" />
    </div>
  )
}
