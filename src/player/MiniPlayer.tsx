import { useSide } from '../side/SideContext'
import { CdDisc } from './CdDisc'
import { usePlayer } from './PlayerContext'
import { PauseIcon, PlayIcon, StopIcon } from './icons'
import { formatTime, trackNumber } from './time'
import './MiniPlayer.css'

/**
 * Le lecteur en réduction, posé en bas de l'écran.
 *
 * Il n'apparaît que lorsqu'un disque est chargé et que le grand lecteur n'est
 * pas visible : plus bas sur la face B, ou sur la face A, où la musique
 * continue. Sur la face B, le titre ramène au lecteur.
 */
export function MiniPlayer() {
  const { disc, trackIndex, track, playing, position, toggle, stop, playerVisible } = usePlayer()
  const { side } = useSide()

  if (track === null || trackIndex === null || playerVisible) return null

  const info = (
    <>
      <span className="mini-player__title">{track.title}</span>
      <span className="mini-player__meta">
        {trackNumber(trackIndex)} · {formatTime(position)}
      </span>
    </>
  )

  return (
    <aside className="mini-player" aria-label="Lecteur CD">
      <span className="mini-player__disc">
        <CdDisc spinning={playing} cover={disc.cover} label={disc.title} compact />
      </span>

      {side === 'b' ? (
        <a
          className="mini-player__info"
          href="#musique"
          aria-label={`Revenir au lecteur : ${track.title}`}
        >
          {info}
        </a>
      ) : (
        <span className="mini-player__info">{info}</span>
      )}

      <button
        type="button"
        className="mini-player__key"
        onClick={toggle}
        aria-label={playing ? 'Pause' : 'Lecture'}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <button
        type="button"
        className="mini-player__key"
        onClick={stop}
        aria-label="Arrêter la lecture"
      >
        <StopIcon />
      </button>
    </aside>
  )
}
