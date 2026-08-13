import type { ReactNode } from 'react'
import './Section.css'

/**
 * Largeur du contenu.
 * - `text`  : borné à la mesure de lecture, pour les paragraphes.
 * - `wide`  : large mais borné, pour les listes et grilles.
 * - `full`  : toute la largeur disponible, marges de page conservées.
 * - `bleed` : jusqu'aux bords de l'écran, marges annulées — pour les rails.
 */
export type SectionWidth = 'text' | 'wide' | 'full' | 'bleed'

interface SectionProps {
  readonly id: string
  /** Titre lisible, requis pour la structure du document même s'il est visuellement discret. */
  readonly title: string
  readonly hideTitle?: boolean
  readonly lead?: string
  readonly width?: SectionWidth
  /**
   * Le titre reste collé en haut pendant que le contenu défile.
   * À réserver aux sections longues — sur une section courte, l'effet ne se voit pas.
   */
  readonly stickyTitle?: boolean
  readonly children: ReactNode
}

/**
 * Conteneur de section.
 *
 * Pas de colonne centrée : le contenu part du bord gauche et seule la largeur du
 * texte est bornée. Le vide se retrouve donc à droite plutôt que réparti des deux
 * côtés — c'est ce déséquilibre qui donne l'impression d'espace.
 *
 * Aucun fond, aucune bordure, aucun séparateur : la continuité visuelle du site
 * repose sur une surface unique, et seul l'espacement crée le rythme.
 */
export function Section({
  id,
  title,
  hideTitle = false,
  lead,
  width = 'wide',
  stickyTitle = false,
  children,
}: SectionProps) {
  const headingId = `${id}-title`

  return (
    <section
      id={id}
      className={`section section--${width}${stickyTitle ? ' section--sticky' : ''}`}
      aria-labelledby={headingId}
    >
      <header className="section__header">
        <h2 id={headingId} className={hideTitle ? 'visually-hidden' : 'section__title'}>
          {title}
        </h2>
        {lead ? <p className="section__lead">{lead}</p> : null}
      </header>

      <div className="section__body">{children}</div>
    </section>
  )
}
