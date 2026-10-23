import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { profile } from '../content'
import { CdDisc } from './CdDisc'
import { usePlayer } from './PlayerContext'
import { NextIcon, PauseIcon, PlayIcon, PreviousIcon, StopIcon } from './icons'
import { formatTime, totalDuration, trackNumber } from './time'
import './CdPlayer.css'

type SeekStyle = CSSProperties & { readonly '--progress'?: string }

/**
 * Le lecteur CD de la face B, avec la liste des pistes à côté, comme au dos
 * d'un boîtier.
 *
 * Le lecteur signale quand il sort de l'écran : la version réduite prend alors
 * le relais en bas de page (voir `MiniPlayer`).
 */
export function CdPlayer() {
  const {
    disc,
    trackIndex,
    playing,
    failed,
    position,
    duration,
    playTrack,
    toggle,
    next,
    previous,
    stop,
    seek,
    setPlayerVisible,
  } = usePlayer()
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = bodyRef.current
    if (node === null) return

    // Sans IntersectionObserver, on considère le lecteur visible : la version
    // réduite n'apparaîtra que sur la face A, où la section n'existe pas.
    if (typeof IntersectionObserver === 'undefined') {
      setPlayerVisible(true)
      return () => setPlayerVisible(false)
    }

    const observer = new IntersectionObserver(
      ([entry]) => setPlayerVisible(entry?.isIntersecting ?? false),
      { threshold: 0.25 },
    )
    observer.observe(node)

    return () => {
      observer.disconnect()
      setPlayerVisible(false)
    }
  }, [setPlayerVisible])

  const stopped = trackIndex === null
  const total = totalDuration(disc.tracks.map((item) => item.duration))
  const progress = duration > 0 ? Math.min(position / duration, 1) * 100 : 0
  const seekStyle: SeekStyle = { '--progress': `${progress}%` }

  return (
    <div className="cd-stage">
      <div ref={bodyRef} className="cd-player">
        <div className="cd-player__well">
          <CdDisc
            spinning={playing}
            cover={disc.cover}
            label={`${disc.title} · ${profile.name} · ${disc.year}`.toUpperCase()}
          />
          <span className="cd-player__spindle" aria-hidden="true" />
        </div>

        {/* L'afficheur double ce que disent déjà les boutons et la barre de
            position : il est caché aux lecteurs d'écran, qui l'entendraient
            changer chaque seconde. */}
        <div className="cd-lcd" aria-hidden="true">
          <span className="cd-lcd__cell">
            <span className="cd-lcd__label">{stopped ? 'Titres' : 'Piste'}</span>
            <span className="cd-lcd__value">
              {stopped ? trackNumber(disc.tracks.length - 1) : trackNumber(trackIndex)}
            </span>
          </span>
          <span className="cd-lcd__cell cd-lcd__cell--end">
            <span className="cd-lcd__label">
              {failed ? 'Erreur' : stopped ? 'Total' : playing ? 'Lecture' : 'Pause'}
            </span>
            <span
              className={`cd-lcd__value${!stopped && !playing && !failed ? ' cd-lcd__value--blink' : ''}`}
            >
              {failed ? '--:--' : stopped ? (total === null ? '--:--' : formatTime(total)) : formatTime(position)}
            </span>
          </span>
        </div>

        <input
          className="cd-player__seek"
          type="range"
          min={0}
          max={duration}
          step="any"
          value={Math.min(position, duration)}
          disabled={stopped || duration === 0}
          onChange={(event) => seek(Number(event.currentTarget.value))}
          aria-label="Position dans la piste"
          aria-valuetext={`${formatTime(position)} sur ${formatTime(duration)}`}
          style={seekStyle}
        />

        <div className="cd-player__controls">
          <button
            type="button"
            className="cd-key"
            onClick={previous}
            disabled={stopped}
            aria-label="Piste précédente"
          >
            <PreviousIcon />
          </button>
          <button
            type="button"
            className="cd-key cd-key--play"
            onClick={toggle}
            aria-label={playing ? 'Pause' : 'Lecture'}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            type="button"
            className="cd-key"
            onClick={next}
            disabled={stopped}
            aria-label="Piste suivante"
          >
            <NextIcon />
          </button>
          <button type="button" className="cd-key" onClick={stop} disabled={stopped} aria-label="Arrêt">
            <StopIcon />
          </button>
        </div>
      </div>

      <div className="cd-notes">
        <h3 className="cd-notes__title">{disc.title}</h3>
        <p className="cd-notes__meta">
          {profile.name} · {disc.year} · {disc.tracks.length}{' '}
          {disc.tracks.length > 1 ? 'titres' : 'titre'}
          {total === null ? '' : ` · ${formatTime(total)}`}
        </p>

        <ol className="tracklist">
          {disc.tracks.map((item, index) => {
            const current = index === trackIndex
            const sounding = current && playing

            return (
              <li
                key={item.id}
                className={`tracklist__item${current ? ' tracklist__item--current' : ''}`}
              >
                <button
                  type="button"
                  className="tracklist__button"
                  onClick={() => (current ? toggle() : playTrack(index))}
                  aria-current={current}
                  aria-label={`${sounding ? 'Pause' : 'Écouter'} : ${item.title}, ${item.duration}`}
                >
                  <span className="tracklist__number" aria-hidden="true">
                    {sounding ? (
                      <span className="tracklist__bars">
                        <span />
                        <span />
                        <span />
                      </span>
                    ) : (
                      trackNumber(index)
                    )}
                  </span>
                  <span className="tracklist__title">{item.title}</span>
                  <span className="tracklist__duration">{item.duration}</span>
                </button>
                {item.note ? <p className="tracklist__note">{item.note}</p> : null}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
