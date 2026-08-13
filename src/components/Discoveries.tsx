import { Cover } from './Cover'
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

export function Discoveries({ items }: DiscoveriesProps) {
  return (
    <ul className="discoveries">
      {items.map((item) => (
        <li key={item.id} className="discovery">
          <Cover src={item.cover} title={item.title} subtitle={item.artist} />

          <div className="discovery__body">
            <div className="discovery__head">
              <h3 className="discovery__title">
                {item.href === undefined ? (
                  item.title
                ) : (
                  <a href={item.href} target="_blank" rel="noreferrer noopener">
                    {item.title}
                  </a>
                )}
              </h3>
              <span className="discovery__year">{item.year}</span>
            </div>

            <p className="discovery__artist">{item.artist}</p>
            <p className="discovery__note">{item.note}</p>
            <p className="discovery__discovered">Découvert en {formatMonth(item.discovered)}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
