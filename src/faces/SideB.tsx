import { Section } from '../components/Section'
import { Bookshelf } from '../components/Bookshelf'
import { Concerts } from '../components/Concerts'
import { RecentFinds } from '../components/RecentFinds'
import { TopShelf } from '../components/TopShelf'
import { aboutDraft, concerts, lessons, media, recentFinds, topAlbums, topArtists } from '../content'
import './SideB.css'

const pad = (value: number) => String(value).padStart(2, '0')

/**
 * Côté Perso — musique et expériences personnelles.
 *
 * Les sections sont toujours affichées : la liste des titres du hero et le
 * lecteur s'appuient sur elles. Une liste encore vide affiche un court message
 * à la place (voir les TODO dans src/content/).
 */
export function SideB() {
  return (
    <>
      <Section id="a-propos" title="À propos" hideTitle width="wide">
        <div className="about">
          <span className="about__quote" aria-hidden="true">
            “
          </span>
          {aboutDraft.body.map((line, index) => (
            <p key={line} className={index === 0 ? 'about__lead' : 'about__line'}>
              {line}
            </p>
          ))}
        </div>
      </Section>

      <Section id="appris" title="Ce que j'ai appris en tant que développeur" width="full">
        <ol className="lessons">
          {lessons.map((lesson, index) => (
            <li key={lesson.id} className="lesson glass">
              <span className="lesson__number" aria-hidden="true">
                {pad(index + 1)}
              </span>
              <p className="lesson__statement">{lesson.statement}</p>
              {lesson.context ? <p className="lesson__context">{lesson.context}</p> : null}
            </li>
          ))}
        </ol>
      </Section>

      <Section id="lectures" title="Ce que je lis et regarde" width="full">
        <Bookshelf items={media} />
      </Section>

      <Section
        id="decouvertes"
        title="Mes découvertes récentes"
        lead="Ce que j'ai découvert ces derniers temps et que je recommande."
        width="full"
      >
        <RecentFinds items={recentFinds} />
      </Section>

      <Section
        id="top"
        title="Les albums et artistes qui m'ont marqués"
        lead="Cliquez sur un disque pour le sortir de l'étagère."
        width="full"
      >
        <TopShelf albums={topAlbums} artists={topArtists} />
      </Section>

      <Section id="concerts" title="Concerts" lead="Les concerts et festivals auxquels j'ai participé." width="full">
        <Concerts items={concerts} />
      </Section>
    </>
  )
}
