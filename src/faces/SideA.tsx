import { Section } from '../components/Section'
import { ProjectShelf } from '../components/ProjectShelf'
import { education, experiences, profile, projects, skillGroups } from '../content'
import './SideA.css'

/** Nombre de technologies affichées sous chaque expérience. */
const STACK_PREVIEW = 5

/** Les liens externes s'ouvrent dans un nouvel onglet ; le mail, non. */
const externalProps = (href: string) =>
  href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noreferrer noopener' }

/**
 * Côté Pro.
 *
 * C'est le côté par défaut : un visiteur inconnu (souvent un recruteur) doit
 * voir les projets avant tout le reste. Le hero (page d'album) est commun aux
 * deux côtés, dans src/album/.
 */
export function SideA() {
  const visible = projects.filter((project) => project.sides.includes('a'))
  const email = profile.links.find((link) => link.href.startsWith('mailto:'))

  return (
    <>
      <Section id="intro" title="À propos" hideTitle width="wide">
        <p className="intro__summary">{profile.summary}</p>
      </Section>

      <Section id="projets" title="Projets" width="full">
        <ProjectShelf projects={visible} />
      </Section>

      <Section id="parcours" title="Parcours" width="full">
        <ol className="jobs">
          {experiences.map((job) => (
            <li key={job.id} className="job glass">
              {/* Décoratif : l'entreprise est nommée dans le titre. */}
              {job.logo === undefined ? null : (
                <span
                  className="job__logo"
                  style={job.logoBackground === undefined ? undefined : { background: job.logoBackground }}
                >
                  <img src={job.logo} alt="" decoding="async" />
                </span>
              )}
              <div className="job__body">
                <div className="job__head">
                  <h3 className="job__role">
                    {job.role} — {job.company}
                  </h3>
                  <span className="job__period">{job.period}</span>
                </div>
                <p className="job__brief">{job.brief}</p>
                <p className="job__summary">{job.summary}</p>
                {job.highlights.length > 0 ? (
                  <ul className="job__highlights">
                    {job.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                ) : null}
                {job.stack && job.stack.length > 0 ? (
                  <ul className="job__stack" aria-label="Technologies">
                    {job.stack.slice(0, STACK_PREVIEW).map((item) => (
                      <li key={item} className="chip">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ol>

        <h3 className="eyebrow schools__title">Formation</h3>
        <ol className="schools">
          {education.map((entry) => (
            <li key={entry.id} className="school glass">
              {entry.logo === undefined ? null : (
                <span className="school__logo">
                  <img src={entry.logo} alt="" decoding="async" />
                </span>
              )}
              <span className="school__name">{entry.school}</span>
              <span className="school__detail">{entry.detail}</span>
              <span className="school__period">{entry.period}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="competences" title="Compétences" width="full">
        <div className="skills glass">
          {skillGroups.map((group) => (
            <div key={group.id} className="skills__group">
              <h3 className="eyebrow">{group.label}</h3>
              <ul className="skills__items">
                {group.items.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="contact" title="Contact" width="full">
        <div className="contact glass">
          <p className="contact__lead">{profile.availability}</p>
          {email === undefined ? null : (
            <a className="contact__email" href={email.href}>
              {profile.email}
            </a>
          )}
          <ul className="contact__links">
            {/* Le mail d'abord : c'est le geste principal. */}
            {[...profile.links].sort((a, b) => Number(b === email) - Number(a === email)).map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`contact__link${link === email ? ' contact__link--primary' : ''}`}
                  {...externalProps(link.href)}
                >
                  {link === email ? 'Écrire un email' : link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  )
}
