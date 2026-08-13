import { Section } from '../components/Section'
import { ProjectCard } from '../components/ProjectCard'
import {
  aboutDraft,
  colophon,
  labItems,
  musicLinks,
  now,
  profile,
  projects,
  releases,
} from '../content'
import './SideB.css'

/**
 * Face B — artistique.
 *
 * Les sections dont le contenu n'est pas encore renseigné (musique, now) ne
 * s'affichent pas : mieux vaut une face plus courte qu'une section vide.
 * Voir les TODO dans src/content/artistic.ts.
 */
export function SideB() {
  const featured = projects.filter((project) => project.sides.includes('b'))
  const hasMusic = musicLinks.length > 0 || releases.length > 0
  const hasNow = now.items.length > 0

  return (
    <>
      <section className="hero hero--b" aria-labelledby="hero-b-title">
        <div className="hero__inner">
          <p className="hero__eyebrow">Face B</p>
          <h1 id="hero-b-title" className="hero__title">
            {profile.name}
          </h1>
          <p className="hero__subtitle">Musique, images, expériences</p>
          <div className="hero__about">
            {aboutDraft.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </section>

      {hasMusic ? (
        <Section id="musique" title="Musique">
          {releases.length > 0 ? (
            <ul className="releases">
              {releases.map((release) => (
                <li key={release.id} className="release">
                  <div className="release__head">
                    <h3 className="release__title">{release.title}</h3>
                    <span className="release__year">{release.year}</span>
                  </div>
                  <p className="release__kind">{release.kind}</p>
                  {release.note ? <p className="release__note">{release.note}</p> : null}
                  <ul className="release__links">
                    {release.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href} target="_blank" rel="noreferrer noopener">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : null}

          {musicLinks.length > 0 ? (
            <ul className="music-links">
              {musicLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noreferrer noopener">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </Section>
      ) : null}

      {featured.length > 0 ? (
        <Section
          id="pont"
          title="Là où les deux se rejoignent"
          lead="Un projet où le code et la musique sont le même travail."
        >
          <div className="projects-grid">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Section>
      ) : null}

      <Section
        id="lab"
        title="Lab"
        lead="Des outils et des expériences faits par curiosité, pas pour être finis."
      >
        <ul className="lab">
          {labItems.map((item) => (
            <li key={item.id} className="lab__item">
              <h3 className="lab__name">{item.name}</h3>
              <p className="lab__description">{item.description}</p>
              <p className="lab__stack">{item.stack.join(' · ')}</p>
              <ul className="lab__links">
                {item.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noreferrer noopener">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      {hasNow ? (
        <Section id="now" title="En ce moment">
          <ul className="now">
            {now.items.map((item) => (
              <li key={item} className="now__item">
                {item}
              </li>
            ))}
          </ul>
          {now.updated ? <p className="now__updated">Mis à jour {now.updated}</p> : null}
        </Section>
      ) : null}

      <Section id="colophon" title="Colophon">
        <dl className="colophon">
          {colophon.map((entry) => (
            <div key={entry.label} className="colophon__row">
              <dt className="colophon__label">{entry.label}</dt>
              <dd className="colophon__value">{entry.value}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  )
}
