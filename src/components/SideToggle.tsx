import { useEffect, useState } from 'react'
import { useSide } from '../side/SideContext'
import './SideToggle.css'

const SIDE_LABEL: Record<'a' | 'b', string> = {
  a: 'Pro',
  b: 'Artistique',
}

/** Délai d'inactivité avant que la cassette ne se rappelle au bon souvenir du visiteur. */
const IDLE_HINT_MS = 9000

/**
 * Bascule entre les deux faces.
 *
 * Emplacement provisoire de la cassette : le composant occupe déjà sa position
 * flottante et son rôle (annoncer explicitement l'autre face), pour que le
 * remplacement par l'objet 2.5D ne change que le rendu, pas la structure.
 *
 * Le choix de face n'étant pas mémorisé, ce bouton est le seul signal indiquant
 * qu'une autre moitié du site existe — d'où le mouvement d'appel après un moment
 * sans interaction.
 */
export function SideToggle() {
  const { side, other, flip } = useSide()
  const [hinting, setHinting] = useState(false)

  useEffect(() => {
    let timer = window.setTimeout(() => setHinting(true), IDLE_HINT_MS)

    const resetIdleTimer = () => {
      setHinting(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setHinting(true), IDLE_HINT_MS)
    }

    // `passive` : ces écouteurs ne doivent jamais retarder le scroll.
    window.addEventListener('scroll', resetIdleTimer, { passive: true })
    window.addEventListener('pointerdown', resetIdleTimer, { passive: true })
    window.addEventListener('keydown', resetIdleTimer)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', resetIdleTimer)
      window.removeEventListener('pointerdown', resetIdleTimer)
      window.removeEventListener('keydown', resetIdleTimer)
    }
  }, [side])

  return (
    <button
      type="button"
      className={`side-toggle${hinting ? ' side-toggle--hinting' : ''}`}
      onClick={flip}
      aria-pressed={side === 'b'}
      title={`Passer sur la face ${other.toUpperCase()} — ${SIDE_LABEL[other]}`}
    >
      <span className="side-toggle__face" aria-hidden="true">
        {other.toUpperCase()}
      </span>
      <span className="side-toggle__label">
        Face {other.toUpperCase()} — {SIDE_LABEL[other]}
      </span>
    </button>
  )
}
