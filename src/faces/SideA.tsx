import { Section } from '../components/Section'
import { ProjectCard } from '../components/ProjectCard'
import { education, experiences, profile, projects, skillGroups } from '../content'
import './SideA.css'

/**
 * Face A — professionnelle.
 *
 * C'est la face par défaut : un visiteur inconnu (souvent un recruteur) doit
 * voir les projets avant tout le reste.
 */
export function SideA() {
  const visible = projects.filter((project) => project.sides.includes('a'))

  return (
    <>
      {/*
        Hero réduit au nom et au métier, centré et plein écran : le walkman se
        pose par-dessus, et le texte long descend sous la ligne de flottaison.
      */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__inner">
          <p className="hero__eyebrow">{profile.location}</p>
          <h1 id="hero-title" className="hero__title">
            {profile.name}
          </h1>
          <p className="hero__subtitle">{profile.title}</p>
        </div>
      </section>

      <Section id="intro" title="À propos" hideTitle width="text">
        <p className="intro__summary">{profile.summary}</p>
        <p className="intro__availability">{profile.availability}</p>
      </Section>

      <Section
        id="projets"
        title="Projets"
        lead="Ce que j'ai construit, avec mon rôle réel sur chacun."
        width="full"
      >
        <div className="projects-flow">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Section>

      <Section id="parcours" title="Parcours" stickyTitle>
        <ol className="timeline">
          {experiences.map((experience) => (
            <li key={experience.id} className="timeline__item">
              <div className="timeline__head">
                <h3 className="timeline__role">
                  {experience.role} — {experience.company}
                </h3>
                <span className="timeline__period">{experience.period}</span>
              </div>
              <p className="timeline__summary">{experience.summary}</p>
              <ul className="timeline__highlights">
                {experience.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              {experience.stack ? (
                <p className="timeline__stack">{experience.stack.join(' · ')}</p>
              ) : null}
            </li>
          ))}
        </ol>

        <ol className="education">
          {education.map((entry) => (
            <li key={entry.id} className="education__item">
              <span className="education__school">{entry.school}</span>
              <span className="education__detail">{entry.detail}</span>
              <span className="education__period">{entry.period}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="competences" title="Compétences">
        <div className="skills">
          {skillGroups.map((group) => (
            <div key={group.id} className="skills__group">
              <h3 className="skills__label">{group.label}</h3>
              <p className="skills__items">{group.items.join(' · ')}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="contact" title="Contact" lead={profile.availability}>
        <ul className="contact__links">
          {profile.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                {...(link.href.startsWith('mailto:')
                  ? {}
                  : { target: '_blank', rel: 'noreferrer noopener' })}
                className="contact__link"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
