import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { MediaItem } from '../content'
import './Bookshelf.css'

interface BookshelfProps {
  readonly items: readonly MediaItem[]
}

/** Teintes des tranches, prises dans la palette du côté : fond, puis encre. */
const SPINES = [
  ['var(--art-3)', 'var(--ink)'],
  ['var(--art-2)', 'var(--art-base)'],
  ['#e8e8ee', '#16161b'],
  ['var(--art-1)', 'var(--ink)'],
  ['var(--art-4)', 'var(--art-base)'],
  ['#2a2d38', 'var(--accent)'],
] as const

/** Hauteurs variées, pour que la rangée ressemble à une vraie étagère. */
const HEIGHTS = [88, 82, 96, 92, 84, 86, 80, 90, 94, 83, 87, 91, 85]

type SpineStyle = CSSProperties & {
  readonly '--spine-bg': string
  readonly '--spine-ink': string
  readonly '--spine-height': string
}

/**
 * Les livres, en tranches posées sur une étagère en verre. Survoler ou
 * sélectionner une tranche la fait sortir de la rangée, et affiche son titre
 * et son auteur dans la carte à côté.
 */
export function Bookshelf({ items }: BookshelfProps) {
  const [active, setActive] = useState(0)
  const current = items[active]

  return (
    <div className="bookshelf">
      <ul className="bookshelf__row">
        {items.map((item, index) => {
          const [bg, ink] = SPINES[index % SPINES.length] ?? SPINES[0]
          const style: SpineStyle = {
            '--spine-bg': bg,
            '--spine-ink': ink,
            '--spine-height': `${HEIGHTS[index % HEIGHTS.length] ?? 88}%`,
          }
          const surname = item.author.split(' ').at(-1) ?? item.author

          return (
            <li key={item.id} className="bookshelf__slot">
              <button
                type="button"
                className={`spine${index === active ? ' spine--out' : ''}`}
                style={style}
                aria-pressed={index === active}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
              >
                <span className="spine__title">{item.title}</span>
                <span className="spine__author" aria-hidden="true">
                  {surname}
                </span>
                <span className="visually-hidden"> — {item.author}</span>
              </button>
            </li>
          )
        })}
      </ul>

      {current === undefined ? null : (
        <div className="bookshelf__card glass" aria-live="polite">
          <p className="eyebrow">{current.kind}</p>
          <p className="bookshelf__title">{current.title}</p>
          <p className="bookshelf__author">
            {current.author}
            {current.year ? ` · ${current.year}` : ''}
          </p>
          {current.note ? <p className="bookshelf__note">{current.note}</p> : null}
        </div>
      )}
    </div>
  )
}
