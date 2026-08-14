import { Cover } from './Cover'
import type { Lesson, MediaItem, Vinyl } from '../content'
import './Personal.css'

interface MediaListProps {
  readonly items: readonly MediaItem[]
}

export function MediaList({ items }: MediaListProps) {
  /* Quand tout est du même type, l'étiquette ne distingue plus rien : la
     répéter à chaque ligne n'ajoute que du bruit. Elle réapparaît d'elle-même
     dès qu'un film ou une série entre dans la liste. */
  const showKind = new Set(items.map((item) => item.kind)).size > 1

  return (
    <ul className="media">
      {items.map((item) => (
        <li key={item.id} className="media__item">
          <div className="media__head">
            <h3 className="media__title">{item.title}</h3>
            {showKind ? <span className="media__kind">{item.kind}</span> : null}
          </div>
          <p className="media__author">
            {item.author}
            {item.year ? ` · ${item.year}` : ''}
          </p>
          {item.note ? <p className="media__note">{item.note}</p> : null}
        </li>
      ))}
    </ul>
  )
}

interface LessonListProps {
  readonly items: readonly Lesson[]
}

export function LessonList({ items }: LessonListProps) {
  return (
    <ul className="lessons">
      {items.map((item) => (
        <li key={item.id} className="lesson">
          <p className="lesson__statement">{item.statement}</p>
          {item.context ? <p className="lesson__context">{item.context}</p> : null}
        </li>
      ))}
    </ul>
  )
}

interface VinylGridProps {
  readonly items: readonly Vinyl[]
  /** En rail, la grille devient une rangée horizontale. */
  readonly layout?: 'grid' | 'row'
}

export function VinylGrid({ items, layout = 'grid' }: VinylGridProps) {
  return (
    <ul className={`vinyls vinyls--${layout}`}>
      {items.map((item) => (
        <li key={item.id} className="vinyl rail__item">
          <Cover src={item.cover} title={item.title} subtitle={item.artist} />
          <h3 className="vinyl__title">{item.title}</h3>
          <p className="vinyl__artist">{item.artist}</p>
          <p className="vinyl__meta">
            {item.year}
            {item.pressing ? ` · ${item.pressing}` : ''}
          </p>
        </li>
      ))}
    </ul>
  )
}
