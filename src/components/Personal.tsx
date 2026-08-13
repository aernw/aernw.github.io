import { Cover } from './Cover'
import type { Lesson, MediaItem, Vinyl } from '../content'
import './Personal.css'

interface MediaListProps {
  readonly items: readonly MediaItem[]
}

export function MediaList({ items }: MediaListProps) {
  return (
    <ul className="media">
      {items.map((item) => (
        <li key={item.id} className="media__item">
          <div className="media__head">
            <h3 className="media__title">{item.title}</h3>
            <span className="media__kind">{item.kind}</span>
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
}

export function VinylGrid({ items }: VinylGridProps) {
  return (
    <ul className="vinyls">
      {items.map((item) => (
        <li key={item.id} className="vinyl">
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
