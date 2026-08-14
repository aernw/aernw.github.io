import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { useSide } from '../side/SideContext'
import './Walkman.css'

// La scène 3D pèse plus lourd que tout le reste du site : elle est chargée
// après le texte, jamais avant.
const WalkmanScene = lazy(() =>
  import('./WalkmanScene').then((module) => ({ default: module.WalkmanScene })),
)

/** Au-delà de ce scroll, le walkman quitte le hero pour se caler en flottant. */
const DOCK_THRESHOLD_PX = 420
const IDLE_HINT_MS = 9000

interface WalkmanProps {
  readonly onJackPosition?: (point: { x: number; y: number }) => void
}

/** WebGL peut être absent ou désactivé : mieux vaut le savoir avant de monter la scène. */
function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return (
      canvas.getContext('webgl2') !== null ||
      canvas.getContext('webgl') !== null
    )
  } catch {
    return false
  }
}

/**
 * Le walkman : objet central du site et commande de bascule entre les faces.
 *
 * Un seul objet en deux états — grand dans le hero, réduit et flottant après
 * défilement. Sans WebGL, un repli textuel garde la fonction de navigation.
 */
export function Walkman({ onJackPosition }: WalkmanProps) {
  const { side, other, flip } = useSide()
  const [docked, setDocked] = useState(false)
  const [hinting, setHinting] = useState(false)
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null)

  useEffect(() => setWebglAvailable(detectWebGL()), [])

  useEffect(() => {
    const onScroll = () => setDocked(window.scrollY > DOCK_THRESHOLD_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Le choix de face n'étant pas mémorisé, le walkman est le seul signal
  // qu'une autre moitié du site existe : il se rappelle après inactivité.
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

  const label = `Face ${side.toUpperCase()} — cliquer pour passer sur la face ${other.toUpperCase()}, glisser pour faire tourner`

  const handleActivate = useCallback(() => flip(), [flip])

  const classes = [
    'walkman',
    docked ? 'walkman--docked' : 'walkman--hero',
    hinting ? 'walkman--hinting' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      {webglAvailable === true ? (
        <Suspense fallback={<div className="walkman__placeholder" aria-hidden="true" />}>
          <WalkmanScene
            {...(onJackPosition === undefined ? {} : { onJackPosition })}
            onActivate={handleActivate}
            label={label}
          />
        </Suspense>
      ) : null}

      {/*
        Bouton toujours présent : il porte la fonction de navigation au clavier,
        et devient l'unique commande visible si WebGL est indisponible.
      */}
      <button
        type="button"
        className={`walkman__toggle${webglAvailable === false ? ' walkman__toggle--fallback' : ''}`}
        onClick={flip}
        aria-pressed={side === 'b'}
      >
        <span aria-hidden="true">{other.toUpperCase()}</span>
        <span className="visually-hidden">
          Passer sur la face {other.toUpperCase()}
        </span>
      </button>
    </div>
  )
}
