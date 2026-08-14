import { Suspense, lazy, useEffect, useState } from 'react'
import { useSide } from '../side/SideContext'
import './Walkman.css'

// La scène 3D pèse plus lourd que tout le reste du site : elle est chargée
// après le texte, jamais avant.
const WalkmanScene = lazy(() =>
  import('./WalkmanScene').then((module) => ({ default: module.WalkmanScene })),
)

// Les objets de fond du reste de la page, dans leur propre scène : celle du
// hero ne peut pas s'agrandir sans que son cadrage se dérègle.
const ScatterScene = lazy(() =>
  import('./ScatterScene').then((module) => ({ default: module.ScatterScene })),
)

const IDLE_HINT_MS = 9000

/** WebGL peut être absent ou désactivé : mieux vaut le savoir avant de monter la scène. */
function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return canvas.getContext('webgl2') !== null || canvas.getContext('webgl') !== null
  } catch {
    return false
  }
}

/**
 * Le walkman : objet central du site et commande de bascule.
 *
 * La scène occupe tout le viewport pour que les cassettes de fond puissent se
 * poser derrière le contenu. Sans WebGL, un bouton prend le relais et garde la
 * navigation.
 */
export function Walkman() {
  const { side, other, flip } = useSide()
  const [hinting, setHinting] = useState(false)
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null)

  useEffect(() => setWebglAvailable(detectWebGL()), [])

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

  // La scène est décorative : elle décrit ce qu'elle montre, sans annoncer
  // d'interaction, puisque toute la navigation passe par le bouton ci-dessous.
  const label = side === 'a' ? 'Ordinateur — face A' : 'Walkman et cassettes — face B'

  return (
    <>
      {webglAvailable === true ? (
        <Suspense fallback={null}>
          <WalkmanScene label={label} side={side} />
          <ScatterScene />
        </Suspense>
      ) : null}

      {/*
        Bouton toujours présent : il porte la navigation au clavier — un canvas
        n'est pas focusable — et devient l'unique commande sans WebGL.
      */}
      <button
        type="button"
        className={`walkman-toggle${hinting ? ' walkman-toggle--hinting' : ''}`}
        onClick={flip}
        aria-pressed={side === 'b'}
        title={`Passer sur la face ${other.toUpperCase()}`}
      >
        <span className="walkman-toggle__face" aria-hidden="true">
          {other.toUpperCase()}
        </span>
        <span className="walkman-toggle__label">Face {other.toUpperCase()}</span>
      </button>
    </>
  )
}
