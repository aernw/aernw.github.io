import { Cover } from './Cover'
import { Disc } from '../album/Disc'
import type { Discovery } from '../content'
import './Discoveries.css'

const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
] as const

/** Transforme « 2026-08 » en « août 2026 ». Renvoie la valeur brute si le format diffère. */
export function formatMonth(value: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(value)
  if (match === null) return value

  const [, year, month] = match
  const label = MONTHS[Number(month) - 1]
  return label === undefined ? value : `${label} ${year}`
}

interface DiscoveriesProps {
  readonly items: readonly Discovery[]
}

/**
 * Les découvertes, en cartes de verre. Au survol, le disque sort par le haut
 * de sa pochette, comme d'un étui.
 */
export function Discoveries({ items }: DiscoveriesProps) {
  return (
    <ul className="discoveries">
      {items.map((item) => (
        <li key={item.id} className="discovery">
          <div className="discovery__art">
            <span className="discovery__disc">
              <Disc printed />
            </span>
            <Cover src={item.cover} title={item.title} subtitle={item.artist} />
          </div>

          <h3 className="discovery__artist">{item.artist}</h3>
          <p className="discovery__title">
            {item.href === undefined ? (
              item.title
            ) : (
              <a href={item.href} target="_blank" rel="noreferrer noopener">
                {item.title}
              </a>
            )}
            <span aria-hidden="true">  ·  </span>
            <span className="discovery__year">{item.year}</span>
          </p>
          <p className="discovery__note">« {item.note} »</p>
        </li>
      ))}
    </ul>
  )
}
