import { Cover } from './Cover'
import type { FavouriteAlbum, FavouriteArtist } from '../content'
import './TopList.css'

interface TopAlbumsProps {
  readonly items: readonly FavouriteAlbum[]
}

/**
 * Classement d'albums.
 *
 * L'ordre du tableau est le classement, et le rang est affiché en grand :
 * c'est lui qui porte le jugement, d'où l'absence de notes en étoiles.
 * Sur un top de tous les temps, tout serait à cinq étoiles.
 */
export function TopAlbums({ items }: TopAlbumsProps) {
  return (
    <ol className="top">
      {items.map((item, index) => (
        <li key={item.id} className="top__item">
          <span className="top__rank" aria-hidden="true">
            {index + 1}
          </span>

          <Cover src={item.cover} title={item.title} subtitle={item.artist} />

          <div className="top__body">
            <h3 className="top__title">
              <span className="visually-hidden">N° {index + 1} — </span>
              {item.href === undefined ? (
                item.title
              ) : (
                <a href={item.href} target="_blank" rel="noreferrer noopener">
                  {item.title}
                </a>
              )}
            </h3>
            <p className="top__meta">
              {item.artist} · {item.year}
            </p>
            {item.note ? <p className="top__note">{item.note}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}

interface TopArtistsProps {
  readonly items: readonly FavouriteArtist[]
}

export function TopArtists({ items }: TopArtistsProps) {
  return (
    <ol className="top-artists">
      {items.map((item, index) => (
        <li key={item.id} className="top-artist">
          <span className="top-artist__rank" aria-hidden="true">
            {index + 1}
          </span>

          <Cover
            src={item.cover}
            title={item.name}
            subtitle={item.name}
            alt={`Portrait de ${item.name}`}
          />

          <div>
            <h3 className="top-artist__name">
              <span className="visually-hidden">N° {index + 1} — </span>
              {item.href === undefined ? (
                item.name
              ) : (
                <a href={item.href} target="_blank" rel="noreferrer noopener">
                  {item.name}
                </a>
              )}
            </h3>
            {item.note ? <p className="top-artist__note">{item.note}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
