import { useState } from 'react'
import { Disc } from '../album/Disc'
import type { FindKind, RecentFind } from '../content'
import './RecentFinds.css'

interface RecentFindsProps {
  readonly items: readonly RecentFind[]
}

/** Les filtres regroupent films et séries : on les regarde de la même façon. */
type Filter = 'tout' | 'musique' | 'écran' | 'outil'

const FILTERS: readonly { readonly id: Filter; readonly label: string }[] = [
  { id: 'tout', label: 'Tout' },
  { id: 'musique', label: 'Musique' },
  { id: 'écran', label: 'Films & séries' },
  { id: 'outil', label: 'Outils & apps' },
]

const LABELS: Readonly<Record<FindKind, string>> = {
  musique: 'Musique',
  film: 'Film',
  série: 'Série',
  outil: 'Outil',
}

const filterOf = (kind: FindKind): Filter =>
  kind === 'film' || kind === 'série' ? 'écran' : kind

/**
 * Mes découvertes récentes, en cartes de verre. Les filtres n'apparaissent
 * que si la liste mélange plusieurs types. Au survol d'une carte musique, le
 * disque sort de la pochette.
 */
export function RecentFinds({ items }: RecentFindsProps) {
  const [filter, setFilter] = useState<Filter>('tout')

  if (items.length === 0) {
    return <p className="finds__empty">Bientôt ici : la musique, les films et les outils que je recommande.</p>
  }

  const present = new Set(items.map((item) => filterOf(item.kind)))
  const shown = filter === 'tout' ? items : items.filter((item) => filterOf(item.kind) === filter)

  return (
    <>
      {present.size > 1 ? (
        <div className="finds__filters glass" role="group" aria-label="Filtrer par type">
          {FILTERS.filter((entry) => entry.id === 'tout' || present.has(entry.id)).map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="finds__filter"
              aria-pressed={filter === entry.id}
              onClick={() => setFilter(entry.id)}
            >
              {entry.label}
            </button>
          ))}
        </div>
      ) : null}

      <ul className="finds">
        {shown.map((item) => (
          <li key={item.id} className={`find find--${item.kind} glass`}>
            <div className="find__art">
              {item.kind === 'musique' ? (
                <span className="find__disc">
                  <Disc printed />
                </span>
              ) : null}
              {item.cover === undefined ? (
                <span className="find__cover find__cover--empty" aria-hidden="true" />
              ) : (
                <img className="find__cover" src={item.cover} alt="" loading="lazy" decoding="async" />
              )}
            </div>

            <span className="chip find__kind">{LABELS[item.kind]}</span>
            <h3 className="find__title">
              {item.href === undefined ? (
                item.title
              ) : (
                <a href={item.href} target="_blank" rel="noreferrer noopener">
                  {item.title}
                </a>
              )}
            </h3>
            <p className="find__by">
              {item.by}
              {item.year ? `  ·  ${item.year}` : ''}
            </p>
            {item.note ? <p className="find__note">« {item.note} »</p> : null}
          </li>
        ))}
      </ul>
    </>
  )
}
