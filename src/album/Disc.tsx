import { useId } from 'react'
import './Disc.css'

/*
 * Proportions d'un vrai CD, ramenées à un diamètre de 100 : trou central de
 * 15 mm, zone transparente jusqu'à 34 mm, sérigraphie de 46 à 117 mm.
 */
const PRINT_INNER_R = 19
const PRINT_OUTER_R = 49
const TEXT_R = 40

/** Cercle complet en chemin SVG, parcouru dans le sens horaire depuis 9 h. */
const circlePath = (r: number) =>
  `M ${50 - r},50 a ${r},${r} 0 1,1 ${2 * r},0 a ${r},${r} 0 1,1 ${-2 * r},0`

interface DiscProps {
  /** Texte imprimé en arc sur le disque. Absent en version réduite. */
  readonly label?: string
  /** Sérigraphie colorée (côté Perso) ; sinon le disque reste argenté. */
  readonly printed?: boolean
}

/**
 * Un CD vu du dessus.
 *
 * Seule la sérigraphie tourne, au rythme du défilement de la page (variable
 * `--scroll-turn`, posée par useScrollTurn). Le fond irisé et le reflet sont
 * immobiles : sur un vrai disque la lumière ne tourne pas avec lui, et c'est
 * ce contraste qui rend la rotation lisible.
 *
 * Purement décoratif : le bouton qui le contient porte le nom accessible.
 */
export function Disc({ label, printed = false }: DiscProps) {
  // `useId` peut produire des caractères refusés dans un `url(#…)`.
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const maskId = `disc-print-${id}`
  const textPathId = `disc-text-${id}`
  const gradientId = `disc-ink-${id}`

  return (
    <span className={`disc${printed ? ' disc--printed' : ''}`} aria-hidden="true">
      <span className="disc__base" />

      <svg className="disc__print" viewBox="0 0 100 100">
        <defs>
          <mask id={maskId}>
            <circle cx="50" cy="50" r={PRINT_OUTER_R} fill="#fff" />
            <circle cx="50" cy="50" r={PRINT_INNER_R} fill="#000" />
          </mask>
          {/* En style et non en attribut : une variable CSS n'est pas lue dans `stop-color=`. */}
          <radialGradient id={gradientId}>
            <stop offset="0" style={{ stopColor: 'var(--art-3)' }} />
            <stop offset="0.5" style={{ stopColor: 'var(--art-1)' }} />
            <stop offset="1" style={{ stopColor: 'var(--art-base)' }} />
          </radialGradient>
          <path id={textPathId} d={circlePath(TEXT_R)} />
        </defs>

        <g mask={`url(#${maskId})`}>
          {printed ? <rect width="100" height="100" fill={`url(#${gradientId})`} /> : null}
          {/* Sillons : quelques cercles à peine visibles, qui accrochent la lumière. */}
          {[28, 34, 41].map((r) => (
            <circle key={r} cx="50" cy="50" r={r} className="disc__groove" />
          ))}
          {label === undefined ? null : (
            <text className="disc__label">
              <textPath href={`#${textPathId}`}>{label}</textPath>
            </text>
          )}
        </g>
      </svg>

      <span className="disc__sheen" />
    </span>
  )
}
