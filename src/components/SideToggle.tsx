import { useSide } from '../side/SideContext'
import './SideToggle.css'

const SIDE_LABEL: Record<'a' | 'b', string> = {
  a: 'Pro',
  b: 'Artistique',
}

/**
 * Bascule entre les deux faces.
 *
 * Emplacement provisoire de la cassette : le composant occupe déjà sa position
 * flottante et son rôle (annoncer explicitement l'autre face), pour que le
 * remplacement par l'objet 2.5D ne change que le rendu, pas la structure.
 */
export function SideToggle() {
  const { side, other, flip } = useSide()

  return (
    <button
      type="button"
      className="side-toggle"
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
