import type { ReactNode } from 'react'
import './Section.css'

interface SectionProps {
  readonly id: string
  /** Titre lisible, requis pour la structure du document même s'il est visuellement discret. */
  readonly title: string
  /** Masque le titre visuellement tout en le gardant pour les lecteurs d'écran. */
  readonly hideTitle?: boolean
  readonly lead?: string
  readonly children: ReactNode
}

/**
 * Conteneur de section.
 *
 * Volontairement sans fond, sans bordure et sans séparateur : la continuité
 * visuelle du site repose sur une surface unique. Seul l'espacement crée le rythme.
 */
export function Section({ id, title, hideTitle = false, lead, children }: SectionProps) {
  const headingId = `${id}-title`

  return (
    <section id={id} className="section" aria-labelledby={headingId}>
      <div className="section__inner">
        <header className="section__header">
          <h2 id={headingId} className={hideTitle ? 'visually-hidden' : 'section__title'}>
            {title}
          </h2>
          {lead ? <p className="section__lead">{lead}</p> : null}
        </header>
        {children}
      </div>
    </section>
  )
}
