import type { Side } from '../content'

interface CassetteShapeProps {
  readonly side: Side
  /** Les bobines ne tournent que lorsque la cassette « joue ». */
  readonly spinning: boolean
}

const LABEL: Record<Side, string> = { a: 'FACE A', b: 'FACE B' }
const SUBTITLE: Record<Side, string> = { a: 'PRO', b: 'ARTISTIQUE' }

/**
 * Cassette audio dessinée en SVG.
 *
 * Le tracé est volontairement simple : ce qui rend l'objet crédible, ce sont les
 * bobines qui tournent et la bande qui relie les deux moyeux, pas le niveau de
 * détail. Les couleurs viennent des tokens, donc la cassette change d'ambiance
 * avec la face sans qu'on ait à la redessiner.
 */
export function CassetteShape({ side, spinning }: CassetteShapeProps) {
  return (
    <svg
      className="cassette__svg"
      viewBox="0 0 200 128"
      role="img"
      aria-label={`Cassette, ${LABEL[side]} — ${SUBTITLE[side]}`}
    >
      {/* Corps */}
      <rect x="2" y="2" width="196" height="124" rx="7" className="cassette__body" />
      <rect x="8" y="8" width="184" height="112" rx="4" className="cassette__inner" />

      {/* Étiquette */}
      <rect x="16" y="15" width="168" height="46" rx="3" className="cassette__label" />
      <text x="24" y="34" className="cassette__label-text">
        {LABEL[side]}
      </text>
      <text x="24" y="50" className="cassette__label-sub">
        {SUBTITLE[side]}
      </text>
      {/* Lignes d'écriture de l'étiquette, comme sur une vraie cassette.
          Elles commencent après le sous-titre le plus long pour ne pas le croiser. */}
      <line x1="118" y1="42" x2="176" y2="42" className="cassette__label-rule" />
      <line x1="118" y1="52" x2="176" y2="52" className="cassette__label-rule" />

      {/* Fenêtre centrale, laissant voir la bande */}
      <rect x="52" y="68" width="96" height="40" rx="3" className="cassette__window" />

      {/* Bande tendue entre les deux moyeux */}
      <path d="M 72 88 Q 100 96 128 88" className="cassette__tape" fill="none" />

      {/* Bobines */}
      <g className={spinning ? 'cassette__reel cassette__reel--spinning' : 'cassette__reel'}>
        <circle cx="72" cy="88" r="15" className="cassette__reel-bg" />
        <g style={{ transformOrigin: '72px 88px' }} className="cassette__reel-spokes">
          {[0, 60, 120].map((angle) => (
            <line
              key={angle}
              x1="72"
              y1="76"
              x2="72"
              y2="100"
              className="cassette__spoke"
              transform={`rotate(${angle} 72 88)`}
            />
          ))}
          <circle cx="72" cy="88" r="5" className="cassette__hub" />
        </g>
      </g>

      <g className={spinning ? 'cassette__reel cassette__reel--spinning' : 'cassette__reel'}>
        <circle cx="128" cy="88" r="15" className="cassette__reel-bg" />
        <g style={{ transformOrigin: '128px 88px' }} className="cassette__reel-spokes">
          {[0, 60, 120].map((angle) => (
            <line
              key={angle}
              x1="128"
              y1="76"
              x2="128"
              y2="100"
              className="cassette__spoke"
              transform={`rotate(${angle} 128 88)`}
            />
          ))}
          <circle cx="128" cy="88" r="5" className="cassette__hub" />
        </g>
      </g>

      {/* Vis des quatre coins */}
      {[
        [14, 14],
        [186, 14],
        [14, 114],
        [186, 114],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" className="cassette__screw" />
      ))}
    </svg>
  )
}
