import type { CSSProperties } from 'react'
import type { Concert } from '../content'
import './Concerts.css'

interface ConcertsProps {
  readonly items: readonly Concert[]
}

const MONTHS = ['JANV.', 'FÉVR.', 'MARS', 'AVR.', 'MAI', 'JUIN', 'JUIL.', 'AOÛT', 'SEPT.', 'OCT.', 'NOV.', 'DÉC.']

/** « 2026-06-05 » → { day: '05', month: 'JUIN', year: '2026' }. */
function parts(date: string) {
  const [year = '', month = '1', day = ''] = date.split('-')
  return { day, month: MONTHS[Number(month) - 1] ?? '', year }
}

/** La ligne du mois, avec la fin d'un festival sur plusieurs jours. */
function monthLine(concert: Concert): string {
  const start = parts(concert.date)
  if (concert.endDate === undefined) return start.month
  const end = parts(concert.endDate)
  return start.month === end.month ? `${start.month} – ${Number(end.day)}` : `${start.month} – ${Number(end.day)} ${end.month}`
}

/**
 * Les concerts, en billets groupés par année. Le fond du billet est l'affiche
 * ou une photo de l'artiste ; le talon, à droite, porte la date. Un concert à
 * venir passe en tête et s'allume aux couleurs de l'accent.
 */
export function Concerts({ items }: ConcertsProps) {
  const today = new Date().toISOString().slice(0, 10)
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date))
  const upcoming = sorted.filter((concert) => (concert.endDate ?? concert.date) >= today)
  const past = sorted.filter((concert) => (concert.endDate ?? concert.date) < today)

  const years = new Map<string, Concert[]>()
  for (const concert of past) {
    const year = parts(concert.date).year
    years.set(year, [...(years.get(year) ?? []), concert])
  }

  const groups: [string, readonly Concert[]][] = [
    ...(upcoming.length > 0 ? [['À venir', [...upcoming].reverse()] as [string, Concert[]]] : []),
    ...years.entries(),
  ]

  return (
    <div className="concerts">
      {groups.map(([label, list]) => (
        <section key={label} className="concerts__year" aria-label={label}>
          <h3 className="concerts__label">{label}</h3>
          <ul className="concerts__list">
            {list.map((concert) => {
              const date = parts(concert.date)
              const isUpcoming = upcoming.includes(concert)
              const style = concert.image === undefined ? undefined : ({ '--ticket-image': `url("${concert.image}")` } as CSSProperties)

              return (
                <li
                  key={concert.id}
                  className={`ticket${concert.image === undefined ? ' ticket--plain' : ''}${isUpcoming ? ' ticket--upcoming' : ''}`}
                  style={style}
                >
                  <div className="ticket__main">
                    <span className="ticket__tags">
                      {isUpcoming ? <span className="ticket__tag ticket__tag--upcoming">À venir</span> : null}
                      <span className="ticket__tag">{concert.kind}</span>
                    </span>
                    <span className="ticket__title">{concert.title}</span>
                    <span className="ticket__venue">{concert.venue}</span>
                  </div>
                  <time className="ticket__stub" dateTime={concert.date}>
                    <span className="ticket__day">{date.day}</span>
                    <span className="ticket__month">{monthLine(concert)}</span>
                    <span className="ticket__yr">{date.year}</span>
                  </time>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
