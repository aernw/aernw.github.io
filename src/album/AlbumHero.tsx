import { useCallback, useEffect, useRef, useState } from 'react'
import { albums, profile } from '../content'
import type { Side } from '../content'
import { AlbumCover } from './AlbumCover'
import { Disc } from './Disc'
import { NowPlayingIcon, PlayIcon } from './icons'
import { formatDuration, useReadingTimes } from './useReadingTimes'
import { goToTrack } from './useTrackScroll'
import './AlbumHero.css'

/** Durée du demi-tour du disque avant de passer à l'autre côté. Alignée sur AlbumHero.css. */
const TURN_MS = 560

/** Libellés des deux côtés dans la barre du haut. */
const SIDE_LABELS: Record<Side, string> = {
  a: 'Mon profil',
  b: 'En savoir plus sur moi',
}

interface AlbumHeroProps {
  readonly side: Side
  /** Piste en cours, -1 dans le hero. */
  readonly active: number
  readonly onFlip: () => void
}

/**
 * Le haut de page, présenté comme une page d'album d'Apple Music.
 *
 * Les couleurs de la pochette débordent sur tout le haut de page puis se
 * fondent dans le fond. Le CD dépasse de la pochette : un clic sur l'un ou
 * l'autre retourne le disque et passe à l'autre côté du site. Sous le hero,
 * les sections de la page sont listées comme les titres de l'album.
 */
export function AlbumHero({ side, active, onFlip }: AlbumHeroProps) {
  const album = albums[side]
  const other = albums[side === 'a' ? 'b' : 'a']
  const durations = useReadingTimes(album.tracks)
  const [turning, setTurning] = useState(false)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const turn = useCallback(() => {
    if (turning) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onFlip()
      return
    }

    // Le disque fait son demi-tour, puis la page change de côté.
    setTurning(true)
    timer.current = window.setTimeout(() => {
      setTurning(false)
      onFlip()
    }, TURN_MS)
  }, [turning, onFlip])

  return (
    <header className="album" aria-labelledby="album-title">
      <div className="album__bleed" aria-hidden="true" />

      <div className="album__bar">
        {/* Pour qui n'aurait pas vu qu'on retourne le disque : les deux côtés,
            nommés, en haut de page. */}
        <nav className="album__sides" aria-label="Côtés du site">
          {(['a', 'b'] as const).map((key) => (
            <button
              key={key}
              type="button"
              className={`album__side${key === side ? ' album__side--current' : ''}`}
              aria-current={key === side ? 'page' : undefined}
              onClick={key === side ? undefined : turn}
            >
              {SIDE_LABELS[key]}
            </button>
          ))}
        </nav>

        <nav className="album__links" aria-label="Liens">
          {profile.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="album__link"
              {...(link.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noreferrer noopener' })}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="album__head">
        <button
          type="button"
          className={`album__art${turning ? ' album__art--turning' : ''}`}
          onClick={turn}
          aria-label={`Retourner le disque : passer au côté ${other.name}`}
        >
          <span className="album__disc">
            <Disc label={`Erwan Seytor · ${album.name}`} printed={side === 'b'} />
          </span>
          <span className="album__cover">
            <AlbumCover album={album} />
          </span>
        </button>

        <div className="album__info">
          <h1 id="album-title" className="album__title">
            {profile.name}
          </h1>
          <p className="album__subtitle">{album.subtitle}</p>
          <p className="album__meta">{profile.location}</p>

          <div className="album__actions">
            <button type="button" className="album__play" onClick={() => goToTrack(album.tracks[0])}>
              <PlayIcon size={18} />
              Lecture
            </button>
          </div>
        </div>
      </div>

      <ol className="tracklist" aria-label={`Sections du côté ${album.name}`}>
        {album.tracks.map((track, index) => {
          const current = index === Math.max(active, 0)
          return (
            <li key={track.id}>
              <a
                href={`#${track.id}`}
                className={`tracklist__row${current ? ' tracklist__row--current' : ''}`}
                aria-current={index === active ? 'location' : undefined}
              >
                <span className="tracklist__index" aria-hidden="true">
                  {current ? <NowPlayingIcon size={16} /> : index + 1}
                </span>
                <span className="tracklist__title">{track.title}</span>
                <span className="tracklist__description">{track.description}</span>
                <span className="tracklist__duration">
                  {durations?.[index] === undefined ? '' : formatDuration(durations[index])}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </header>
  )
}
