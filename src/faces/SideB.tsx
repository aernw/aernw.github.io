import { Section } from '../components/Section'
import { Discoveries, formatMonth } from '../components/Discoveries'
import { Rail } from '../components/Rail'
import { TopAlbums, TopArtists } from '../components/TopList'
import { LessonList, MediaList, VinylGrid } from '../components/Personal'
import {
  aboutDraft,
  colophon,
  discoveries,
  labItems,
  lessons,
  media,
  musicLinks,
  now,
  profile,
  releases,
  topAlbums,
  topArtists,
  vinyls,
} from '../content'
import './SideB.css'

interface PlaceholderProps {
  readonly children: string
}

function Placeholder({ children }: PlaceholderProps) {
  return <p className="section__placeholder">{children}</p>
}

/**
 * Face B — artistique et personnelle.
 *
 * Chaque section ne s'affiche que si son contenu existe : une face plus courte
 * vaut mieux qu'une section vide. Les emplacements à remplir sont marqués par
 * des TODO dans src/content/music.ts, personal.ts et artistic.ts.
 */
export function SideB() {
  /** Fraîcheur de la section découvertes, calculée depuis l'entrée la plus récente. */
  const latestDiscovery = discoveries.reduce<string | null>(
    (latest, item) => (latest === null || item.discovered > latest ? item.discovered : latest),
    null,
  )

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

      <Section id="musique" title="Ma musique">
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
        ) : (
          <Placeholder>Ajoute ici tes plateformes, morceaux ou projets musicaux.</Placeholder>
        )}

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

      <Section
        id="decouvertes"
        title="Découvertes"
        lead="Ce que j'écoute en ce moment et que je veux faire écouter."
        width="bleed"
      >
        {discoveries.length > 0 ? (
          <Rail label="Découvertes musicales">
            <Discoveries items={discoveries} layout="row" />
          </Rail>
        ) : (
          <Placeholder>Ajoute ici tes découvertes récentes pour remplir la section.</Placeholder>
        )}

        {latestDiscovery !== null ? (
            <p className="section__footnote section__footnote--inset">
              Dernier ajout en {formatMonth(latestDiscovery)}
            </p>
          ) : null}
      </Section>

      <Section
        id="top"
        title="Mon top de tous les temps"
        lead="Dans l'ordre. Pas de notes — la place suffit."
        stickyTitle
      >
        {topAlbums.length > 0 ? (
          <>
            <h3 className="subsection__title">Albums</h3>
            <TopAlbums items={topAlbums} />
          </>
        ) : (
          <Placeholder>Ajoute quelques albums pour faire apparaître ce classement.</Placeholder>
        )}

        {topArtists.length > 0 ? (
          <>
            <h3 className="subsection__title subsection__title--spaced">Artistes</h3>
            <TopArtists items={topArtists} />
          </>
        ) : null}
      </Section>

      <Section
        id="vinyles"
        title="Vinyles"
        lead="Pas un inventaire — les disques qui comptent."
        width="bleed"
      >
        {vinyls.length > 0 ? (
          <Rail label="Collection de vinyles">
            <VinylGrid items={vinyls} layout="row" />
          </Rail>
        ) : (
          <Placeholder>Ajoute quelques pochettes de vinyles pour afficher cette rangée.</Placeholder>
        )}
      </Section>

      <Section id="lectures" title="Ce que je lis et regarde">
        {media.length > 0 ? (
          <MediaList items={media} />
        ) : (
          <Placeholder>Ajoute ici les livres, films ou séries qui comptent en ce moment.</Placeholder>
        )}
      </Section>

      <Section id="appris" title="Ce que j'ai appris" width="full">
        {lessons.length > 0 ? (
          <LessonList items={lessons} />
        ) : (
          <Placeholder>Ajoute ici quelques leçons ou constats que tu veux garder.</Placeholder>
        )}
      </Section>

      <Section
        id="lab"
        title="Lab"
        lead="Des outils et des expériences faits par curiosité, pas pour être finis."
        stickyTitle
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

      <Section id="now" title="En ce moment">
        {now.items.length > 0 ? (
          <>
            <ul className="now">
              {now.items.map((item) => (
                <li key={item} className="now__item">
                  {item}
                </li>
              ))}
            </ul>
            {now.updated ? <p className="now__updated">Mis à jour {now.updated}</p> : null}
          </>
        ) : (
          <Placeholder>Ajoute ici ce sur quoi tu travailles en ce moment.</Placeholder>
        )}
      </Section>

      <Section id="colophon" title="Colophon">
        <dl className="colophon">
          {colophon.map((entry) => (
            // La valeur, pas le libellé : plusieurs entrées partagent le même
            // libellé (trois modèles 3D, tous à créditer séparément).
            <div key={entry.value} className="colophon__row">
              <dt className="colophon__label">{entry.label}</dt>
              <dd className="colophon__value">
                {entry.href === undefined ? (
                  entry.value
                ) : (
                  <a href={entry.href} target="_blank" rel="noreferrer noopener">
                    {entry.value}
                  </a>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  )
}
