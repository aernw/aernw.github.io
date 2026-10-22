import { useRef } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import type { Project } from '../content'
import './ProjectSleeve.css'

interface ProjectSleeveProps {
  readonly project: Project
  readonly expanded: boolean
  /** Identifiant du panneau de notes que la pochette ouvre. */
  readonly controls: string
  readonly onToggle: () => void
}

/** La teinte du projet est exposée en variable CSS, consommée par la feuille de style. */
type SleeveStyle = CSSProperties & { readonly '--project-accent'?: string }

/** Identifiant du bouton d'une pochette, que le panneau de notes référence. */
export function sleeveId(projectId: string): string {
  return `pochette-${projectId}`
}

function clamp(value: number): number {
  return Math.min(1, Math.max(-1, value))
}

/**
 * Le dessin de la pochette : la pochette du projet, sinon son logo, sinon son
 * nom, posés sur sa teinte.
 */
function SleeveArt({ project }: { readonly project: Project }) {
  const { cover, logo, name } = project

  if (cover !== undefined) {
    return <img className="sleeve__media" src={cover} alt="" loading="lazy" decoding="async" />
  }

  if (logo !== undefined) {
    return <img className="sleeve__logo" src={logo} alt="" loading="lazy" decoding="async" />
  }

  return <span className="sleeve__type">{name}</span>
}

/**
 * Pochette d'un projet, dans le bac.
 *
 * Au survol, elle se soulève et flotte : elle suit le pointeur en s'inclinant,
 * son dessin glisse légèrement sous le reflet, et elle oscille doucement tant
 * qu'on la survole. Au clic, elle reste soulevée et ouvre ses notes sous sa
 * rangée.
 *
 * Le bouton porte le nom du projet ; le dessin, purement décoratif, est masqué
 * aux lecteurs d'écran. L'accroche est en dehors du bouton pour ne pas allonger
 * son nom, mais la zone cliquable s'étend jusqu'à elle.
 */
export function ProjectSleeve({ project, expanded, controls, onToggle }: ProjectSleeveProps) {
  const itemRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLSpanElement>(null)

  const style: SleeveStyle =
    project.accent === undefined ? {} : { '--project-accent': project.accent }

  // L'inclinaison ne suit que la souris : au doigt, il n'y a pas de survol à suivre.
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const item = itemRef.current
    const stage = stageRef.current
    if (event.pointerType !== 'mouse' || item === null || stage === null) return

    // Position du pointeur sur la pochette, de -1 à 1 sur chaque axe. On mesure
    // la scène, qui ne bouge pas, et non la pochette, qui s'incline : sinon
    // l'inclinaison modifierait sa propre mesure et tremblerait. La mesure est
    // reprise à chaque mouvement, pour rester juste si la page défile dessous.
    const rect = stage.getBoundingClientRect()
    const x = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1)
    const y = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1)
    item.style.setProperty('--tilt-x', x.toFixed(3))
    item.style.setProperty('--tilt-y', y.toFixed(3))
  }

  const handlePointerLeave = () => {
    itemRef.current?.style.removeProperty('--tilt-x')
    itemRef.current?.style.removeProperty('--tilt-y')
  }

  return (
    <div
      ref={itemRef}
      className={`crate__item${expanded ? ' crate__item--open' : ''}`}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <h3 className="crate__heading">
        <button
          type="button"
          id={sleeveId(project.id)}
          className="sleeve"
          aria-expanded={expanded}
          aria-controls={controls}
          onClick={onToggle}
        >
          <span ref={stageRef} className="sleeve__stage" aria-hidden="true">
            <span className="sleeve__cover">
              {/* Seul le dessin glisse sous l'inclinaison ; l'habillage reste
                  solidaire du carton. C'est cet écart qui donne la profondeur. */}
              <span className="sleeve__art">
                <SleeveArt project={project} />
              </span>
              <span className="sleeve__grain" />
              <span className="sleeve__sheen" />
            </span>
          </span>
          <span className="sleeve__name">{project.name}</span>
        </button>
      </h3>
      <p className="crate__tagline">{project.tagline}</p>
    </div>
  )
}
