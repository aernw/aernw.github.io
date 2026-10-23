import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { albums, profile } from '../content'
import type { Side } from '../content'
import { Disc } from './Disc'
import { ListIcon, NextIcon, NowPlayingIcon, PreviousIcon } from './icons'
import { goToTrack } from './useTrackScroll'
import type { TrackScroll } from './useTrackScroll'
import './Player.css'

const pad = (value: number) => String(value).padStart(2, '0')

interface PlayerProps extends TrackScroll {
  readonly side: Side
}

/**
 * Le lecteur fixe en bas de page. Il ne joue aucun son : c'est la navigation.
 *
 * Le titre est celui de la section à l'écran, la barre suit le défilement de
 * la page, précédent / suivant passent d'une section à l'autre, et le bouton
 * central ouvre le sommaire.
 */
export function Player({ side, active, progress }: PlayerProps) {
  const album = albums[side]
  const tracks = album.tracks
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const title = active >= 0 ? (tracks[active]?.title ?? '') : 'Intro'
  const hasPrevious = active >= 0
  const hasNext = active < tracks.length - 1

  // Le sommaire se ferme à Échap, ou d'un clic en dehors du lecteur.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  // Changer de côté referme le sommaire : sa liste ne serait plus la bonne.
  useEffect(() => setOpen(false), [side])

  const progressStyle = { '--progress': progress.toFixed(4) } as CSSProperties

  return (
    <div ref={rootRef} className="player">
      {open ? (
        <div className="player__toc" id={listId}>
          <p className="player__toc-title">Sommaire · {album.name}</p>
          <ol>
            {tracks.map((track, index) => (
              <li key={track.id}>
                <button
                  type="button"
                  className={`player__toc-item${index === active ? ' player__toc-item--current' : ''}`}
                  aria-current={index === active ? 'location' : undefined}
                  onClick={() => {
                    setOpen(false)
                    goToTrack(track)
                  }}
                >
                  <span className="player__toc-index" aria-hidden="true">
                    {index === active ? <NowPlayingIcon size={14} /> : pad(index + 1)}
                  </span>
                  {track.title}
                </button>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <section className="player__bar" aria-label="Lecteur de navigation">
        <span className="player__disc">
          <Disc printed={side === 'b'} />
        </span>

        <div className="player__info">
          <p className="player__title">{title}</p>
          <p className="player__subtitle">
            {profile.name} · {album.name}
          </p>
          <div className="player__progress" style={progressStyle}>
            <span className="player__track" aria-hidden="true">
              <span className="player__fill" />
            </span>
            <span className="player__index">
              {pad(active + 1)} / {pad(tracks.length)}
            </span>
          </div>
        </div>

        <div className="player__controls">
          <button
            type="button"
            className="player__button"
            onClick={() => goToTrack(active <= 0 ? undefined : tracks[active - 1])}
            disabled={!hasPrevious}
            aria-label="Section précédente"
          >
            <PreviousIcon size={22} />
          </button>
          <button
            type="button"
            className="player__button player__button--main"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-label="Sommaire"
          >
            <ListIcon size={20} />
          </button>
          <button
            type="button"
            className="player__button"
            onClick={() => goToTrack(tracks[active + 1])}
            disabled={!hasNext}
            aria-label="Section suivante"
          >
            <NextIcon size={22} />
          </button>
        </div>
      </section>
    </div>
  )
}
