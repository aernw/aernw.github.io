import type { CSSProperties } from 'react'
import type { Project } from '../content'
import { ProjectVisual } from './ProjectVisual'
import './ProjectCard.css'

interface ProjectCardProps {
  readonly project: Project
}

/** La teinte du projet est exposée en variable CSS, consommée par la feuille de style. */
type AccentStyle = CSSProperties & { readonly '--project-accent'?: string }

/**
 * Carte de projet.
 *
 * Le niveau d'emphase pilote la taille et la densité, pas un style différent :
 * un projet « feature » occupe toute la largeur et affiche sa description longue,
 * un projet « compact » se réduit à l'essentiel.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const { name, tagline, description, role, metrics, stack, links, year, emphasis } = project
  const isCompact = emphasis === 'compact'
  const style: AccentStyle =
    project.accent === undefined ? {} : { '--project-accent': project.accent }

  return (
    <article className={`project project--${emphasis}`} style={style}>
      <div className="project__layout">
        <div className="project__content">
          <div className="project__head">
            <h3 className="project__name">{name}</h3>
            <span className="project__year">{year}</span>
          </div>

          <p className="project__tagline">{tagline}</p>

          {!isCompact ? <p className="project__description">{description}</p> : null}

          <p className="project__role">{role}</p>

          {metrics && metrics.length > 0 ? (
            <ul className="project__metrics">
              {metrics.map((metric) => (
                <li key={metric} className="project__metric">
                  {metric}
                </li>
              ))}
            </ul>
          ) : null}

          <ul className="project__stack">
            {stack.map((item) => (
              <li key={item} className="project__stack-item">
                {item}
              </li>
            ))}
          </ul>

          {links.length > 0 ? (
            <ul className="project__links">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="project__link"
                  >
                    {link.label}
                    <span className="visually-hidden"> — {name} (nouvel onglet)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="project__visual" aria-hidden="true">
          <ProjectVisual visual={project.visual} />
        </div>
      </div>
    </article>
  )
}
