import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { Section } from '../components/Section'
import { Bookshelf } from '../components/Bookshelf'
import { Concerts } from '../components/Concerts'
import { RecentFinds } from '../components/RecentFinds'
import { TopShelf } from '../components/TopShelf'
import { aboutDraft, albums, concerts, lessons, media, recentFinds, topAlbums, topArtists } from '../content'
import './SideB.css'

const pad = (value: number) => String(value).padStart(2, '0')

/**
 * Côté Perso — musique et expériences personnelles.
 *
 * L'ordre des sections et celles qui sont affichées viennent de la liste des
 * titres (src/content/album.ts) : une section sans contenu n'y figure pas, et
 * n'apparaît donc ni sur la page, ni dans le hero, ni dans le lecteur.
 */
export function SideB() {
  const sections: Record<string, ReactNode> = {
    'a-propos': (
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
    ),

    appris: (
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
    ),

    top: (
      <Section
        id="top"
        title="Les albums et artistes qui m'ont marqués"
        lead="Cliquez sur un disque pour le sortir de l'étagère."
        width="full"
      >
        <TopShelf albums={topAlbums} artists={topArtists} />
      </Section>
    ),

    concerts: (
      <Section id="concerts" title="Concerts" lead="Les concerts et festivals auxquels j'ai participé." width="full">
        <Concerts items={concerts} />
      </Section>
    ),

    decouvertes: (
      <Section
        id="decouvertes"
        title="Mes découvertes récentes"
        lead="Ce que j'ai découvert ces derniers temps et que je recommande."
        width="full"
      >
        <RecentFinds items={recentFinds} />
      </Section>
    ),

    lectures: (
      <Section id="lectures" title="Ce que je lis et regarde" width="full">
        <Bookshelf items={media} />
      </Section>
    ),
  }

  return (
    <>
      {albums.b.tracks.map((track) => (
        <Fragment key={track.id}>{sections[track.id]}</Fragment>
      ))}
    </>
  )
}
