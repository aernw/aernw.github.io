import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, TransitionEvent } from 'react'
import type { Project } from '../content'
import { sleeveId } from './ProjectSleeve'
import './ProjectNotes.css'

interface ProjectNotesProps {
  readonly id: string
  /** Projet ouvert dans cette rangée, ou `null` si la rangée est fermée. */
  readonly project: Project | null
  readonly onClose: () => void
}

/** Séparateur de liste, collé à l'élément qui le précède : une ligne ne commence jamais par lui. */
const SEPARATOR = '\u00a0· '

/** Marge gardée au-dessus du panneau quand on le fait défiler jusqu'à l'écran. */
const VIEWPORT_MARGIN = 24

/**
 * Notes de pochette : le détail d'un projet, déployé sous sa rangée.
 *
 * Il y a un panneau par rangée, toujours monté. Fermé, il se réduit à l'écart
 * entre deux rangées et il est inerte, donc invisible des lecteurs d'écran et
 * du clavier. Ouvrir une autre pochette de la même rangée change le contenu
 * sans replier le panneau ; en ouvrir une d'une autre rangée replie celui-ci et
 * déploie l'autre.
 *
 * La hauteur est animée vers la hauteur mesurée du contenu : c'est ce qui
 * pousse doucement la suite de la page, au lieu de la faire sauter.
 */
export function ProjectNotes({ id, project, onClose }: ProjectNotesProps) {
  const innerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  // Le dernier projet affiché reste en place pendant que le panneau se replie :
  // sans lui, le contenu disparaîtrait avant la fin du mouvement.
  const [shown, setShown] = useState<Project | null>(project)
  if (project !== null && project !== shown) {
    setShown(project)
  }

  const open = project !== null

  useEffect(() => {
    const inner = innerRef.current
    if (inner === null) return

    const observer = new ResizeObserver(() => setHeight(inner.offsetHeight))
    observer.observe(inner)
    return () => observer.disconnect()
  }, [])

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'height') return

    if (!open) {
      setShown(null)
      return
    }

    // Déployé sous la ligne de flottaison, le panneau serait invisible : on
    // fait défiler juste ce qu'il faut, sans jamais en cacher le haut. Le bas
    // du panneau inclut déjà l'écart avant la rangée suivante.
    const rect = event.currentTarget.getBoundingClientRect()
    const overflow = rect.bottom - window.innerHeight
    if (overflow > 0) {
      window.scrollBy({ top: Math.min(overflow, Math.max(0, rect.top - VIEWPORT_MARGIN)) })
    }
  }

  // Fermé, la hauteur revient à celle de la feuille de style : l'écart entre
  // deux rangées.
  const style: CSSProperties = open ? { height } : {}

  return (
    <div
      id={id}
      className={`notes${open ? ' notes--open' : ''}`}
      role="region"
      {...(shown === null ? {} : { 'aria-labelledby': sleeveId(shown.id) })}
      inert={!open}
      style={style}
      onTransitionEnd={handleTransitionEnd}
    >
      <div ref={innerRef} className="notes__inner">
        {shown === null ? null : (
          <>
            <NotesContent key={shown.id} project={shown} />
            <button type="button" className="notes__close" onClick={onClose}>
              <span aria-hidden="true">×</span>
              <span className="visually-hidden">Fermer les notes de {shown.name}</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/** Le contenu des notes, remonté à chaque projet pour rejouer son apparition. */
function NotesContent({ project }: { readonly project: Project }) {
  const { name, tagline, description, role, metrics, stack, links, year, logo } = project

  return (
    <div className="notes__content">
      <p className={`notes__name${logo === undefined ? '' : ' notes__name--logo'}`}>
        {/* Décoratif : le nom du projet suit juste après. */}
        {logo === undefined ? null : (
          <img className="notes__logo" src={logo} alt="" decoding="async" />
        )}
        {name}
      </p>
      <p className="notes__tagline">{tagline}</p>

      <div className="notes__body">
        <div>
          <p className="notes__description">{description}</p>

          {links.length > 0 ? (
            <ul className="notes__links">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noreferrer noopener">
                    {link.label} ↗
                    <span className="visually-hidden"> — {name} (nouvel onglet)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <dl className="notes__credits">
          <div>
            <dt>Rôle</dt>
            <dd>{role}</dd>
          </div>

          {metrics && metrics.length > 0 ? (
            <div>
              <dt>En chiffres</dt>
              <dd>{metrics.join(SEPARATOR)}</dd>
            </div>
          ) : null}

          <div>
            <dt>Stack</dt>
            <dd className="notes__stack">{stack.join(SEPARATOR)}</dd>
          </div>

          <div>
            <dt>Année</dt>
            <dd>{year}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
