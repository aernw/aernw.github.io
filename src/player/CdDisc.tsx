import { useId, useRef } from 'react'
import { useDiscSpin } from './useDiscSpin'
import './CdDisc.css'

/*
 * Proportions d'un vrai CD, ramenées à un diamètre de 100 : trou central de
 * 15 mm, zone transparente jusqu'à 34 mm, sérigraphie de 46 à 117 mm.
 */
const HOLE_R = 6.25
const CLEAR_R = 14
const PRINT_INNER_R = 19
const PRINT_OUTER_R = 48.8
const TEXT_R = 38.5

/** Cercle complet en chemin SVG, parcouru dans le sens horaire depuis 9 h. */
const circlePath = (r: number) => `M ${50 - r},50 a ${r},${r} 0 1,1 ${2 * r},0 a ${r},${r} 0 1,1 ${-2 * r},0`

interface CdDiscProps {
  readonly spinning: boolean
  /** Texte imprimé en arc sur le disque quand il n'a pas de visuel. */
  readonly label: string
  readonly cover?: string | undefined
  /** Version réduite : la sérigraphie n'y serait plus lisible, seul l'arc reste. */
  readonly compact?: boolean
}

/**
 * Un CD vu du dessus, face imprimée.
 *
 * Seule la sérigraphie tourne. Le fond irisé et le reflet sont posés à part et
 * restent immobiles : sur un vrai disque, la lumière ne tourne pas avec lui,
 * et c'est ce contraste qui rend la rotation lisible.
 */
export function CdDisc({ spinning, label, cover, compact = false }: CdDiscProps) {
  const printRef = useRef<SVGSVGElement>(null)
  // `useId` peut produire des caractères refusés dans un `url(#…)`.
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const maskId = `cd-print-${id}`
  const textPathId = `cd-text-${id}`

  useDiscSpin(printRef, spinning)

  return (
    <div className={`cd-disc${compact ? ' cd-disc--compact' : ''}`} aria-hidden="true">
      <div className="cd-disc__base" />

      <svg ref={printRef} className="cd-disc__print" viewBox="0 0 100 100">
        <defs>
          <mask id={maskId}>
            <circle cx="50" cy="50" r={PRINT_OUTER_R} fill="#fff" />
            <circle cx="50" cy="50" r={PRINT_INNER_R} fill="#000" />
          </mask>
          <path id={textPathId} d={circlePath(TEXT_R)} />
        </defs>

        {/* Zone transparente du moyeu et son anneau d'empilement. */}
        <circle
          cx="50"
          cy="50"
          r={(HOLE_R + CLEAR_R) / 2}
          fill="none"
          stroke="rgba(255, 255, 255, 0.07)"
          strokeWidth={CLEAR_R - HOLE_R}
        />
        <circle cx="50" cy="50" r="11" fill="none" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="0.5" />

        {cover === undefined ? (
          <g mask={`url(#${maskId})`}>
            <rect width="100" height="100" fill="#191611" />
            {/* Un arc franc : c'est lui qui montre la rotation, même en tout petit. */}
            <circle
              cx="50"
              cy="50"
              r="26"
              fill="none"
              stroke="#d98324"
              strokeWidth="6"
              strokeDasharray={`${(2 * Math.PI * 26) / 3} ${2 * Math.PI * 26}`}
              transform="rotate(-140 50 50)"
            />
            <circle cx="50" cy="50" r="45.6" fill="none" stroke="#f7f3e8" strokeOpacity="0.35" strokeWidth="0.35" />
            {compact ? null : (
              <text className="cd-disc__label">
                <textPath href={`#${textPathId}`}>{label}</textPath>
              </text>
            )}
          </g>
        ) : (
          <image
            href={cover}
            width="100"
            height="100"
            preserveAspectRatio="xMidYMid slice"
            mask={`url(#${maskId})`}
          />
        )}
      </svg>

      <div className="cd-disc__sheen" />
    </div>
  )
}
