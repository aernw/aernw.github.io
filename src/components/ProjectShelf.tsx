import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Disc } from '../album/Disc'
import type { Project } from '../content'
import './ProjectShelf.css'

interface ProjectShelfProps {
  readonly projects: readonly Project[]
}

const pad = (value: number) => String(value).padStart(2, '0')

/** La teinte du projet colore le fond de la pochette de repli. */
type ArtStyle = CSSProperties & { readonly '--project-accent'?: string }

/** La pochette du projet, sinon son logo, sinon son nom, posés sur sa teinte. */
function ProjectArt({ project }: { readonly project: Project }) {
  const { cover, logo, name, accent } = project
  const style: ArtStyle = accent === undefined ? {} : { '--project-accent': accent }

  return (
    <span className="shelf-art" style={style} aria-hidden="true">
      {cover !== undefined ? (
        <img className="shelf-art__media" src={cover} alt="" loading="lazy" decoding="async" />
      ) : logo !== undefined ? (
        <img className="shelf-art__logo" src={logo} alt="" loading="lazy" decoding="async" />
      ) : (
        <span className="shelf-art__name">{name}</span>
      )}
    </span>
  )
}

/**
 * Les projets : un projet à la une, en carte de verre avec tout son détail et
 * son CD qui dépasse de la pochette, et les autres en pochettes à côté. Choisir
 * une pochette la met à la une.
 */
export function ProjectShelf({ projects }: ProjectShelfProps) {
  const [selectedId, setSelectedId] = useState(projects[0]?.id)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const selected = projects.find((project) => project.id === selectedId) ?? projects[0]
  if (selected === undefined) return null

  const select = (id: string) => {
    setSelectedId(id)
    // Le détail change au-dessus ou à côté : le focus le suit, et la carte
    // revient à l'écran si elle en était sortie.
    requestAnimationFrame(() => {
      const heading = headingRef.current
      if (heading === null) return
      heading.focus({ preventScroll: true })
      if (heading.getBoundingClientRect().top < 0) {
        heading.closest('.shelf__featured')?.scrollIntoView({ block: 'start' })
      }
    })
  }

  const { name, tagline, description, role, metrics, stack, links, year } = selected
  const number = projects.indexOf(selected) + 1

  return (
    <div className="shelf">
      <article className="shelf__featured" aria-labelledby={`projet-${selected.id}`}>
        <div className="shelf__art">
          <span className="shelf__disc">
            <Disc label={name} />
          </span>
          <ProjectArt project={selected} />
        </div>

        <div className="shelf__details">
          <p className="shelf__number">
            {pad(number)}  ·  {year}
          </p>
          <h3 id={`projet-${selected.id}`} ref={headingRef} className="shelf__name" tabIndex={-1}>
            {name}
          </h3>
          <p className="shelf__tagline">{tagline}</p>
          <p className="shelf__description">{description}</p>
          <p className="shelf__role">{role}</p>
          {metrics && metrics.length > 0 ? <p className="shelf__metrics">{metrics.join(' · ')}</p> : null}

          <ul className="shelf__stack" aria-label="Stack">
            {stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {links.length > 0 ? (
            <ul className="shelf__links">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noreferrer noopener">
                    {link.label} ↗<span className="visually-hidden"> — {name} (nouvel onglet)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </article>

      <ul className="shelf__grid">
        {projects.map((project, index) =>
          project.id === selected.id ? null : (
            <li key={project.id}>
              <button type="button" className="shelf__item" onClick={() => select(project.id)}>
                <ProjectArt project={project} />
                <span className="shelf__item-number">
                  {pad(index + 1)}  ·  {project.year}
                </span>
                <span className="shelf__item-name">{project.name}</span>
                <span className="shelf__item-tagline">{project.tagline}</span>
              </button>
            </li>
          ),
        )}
      </ul>
    </div>
  )
}
