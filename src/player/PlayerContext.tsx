import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { disc, profile } from '../content'
import type { Disc, Track } from '../content'
import { trackNumber } from './time'

/** Au-delà, « piste précédente » revient au début de la piste en cours — comme sur un vrai lecteur. */
const RESTART_THRESHOLD_S = 3

interface PlayerContextValue {
  readonly disc: Disc
  /** Piste chargée, ou `null` quand le lecteur est à l'arrêt. */
  readonly trackIndex: number | null
  readonly track: Track | null
  readonly playing: boolean
  /** Le fichier n'a pas pu être lu : absent, ou dans un format que le navigateur ignore. */
  readonly failed: boolean
  readonly position: number
  readonly duration: number
  readonly playTrack: (index: number) => void
  readonly toggle: () => void
  readonly next: () => void
  readonly previous: () => void
  readonly stop: () => void
  readonly seek: (seconds: number) => void
  /** Le grand lecteur est-il à l'écran ? Sinon, la version réduite prend le relais. */
  readonly playerVisible: boolean
  readonly setPlayerVisible: (visible: boolean) => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

interface PlayerProviderProps {
  readonly children: ReactNode
}

/**
 * Le lecteur CD : un seul élément `<audio>`, monté au-dessus des deux faces.
 *
 * Il vit ici plutôt que dans la section de la face B pour que la musique
 * continue quand on fait défiler la page ou qu'on retourne la cassette : la
 * section peut disparaître, le son reste.
 *
 * L'état affiché (`playing`) suit les événements de l'élément audio, pas
 * l'intention de l'utilisateur : si le navigateur refuse la lecture, le disque
 * s'arrête au lieu de tourner dans le vide.
 */
export function PlayerProvider({ children }: PlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [trackIndex, setTrackIndex] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playerVisible, setPlayerVisible] = useState(false)

  const tracks = disc.tracks
  const track = trackIndex === null ? null : (tracks[trackIndex] ?? null)

  const startPlayback = useCallback((audio: HTMLAudioElement) => {
    audio.play().catch((error: unknown) => {
      // Un nouveau chargement interrompt la lecture en cours : ce n'est pas un échec.
      if (error instanceof DOMException && error.name === 'AbortError') return
      setPlaying(!audio.paused)
    })
  }, [])

  const playTrack = useCallback(
    (index: number) => {
      const audio = audioRef.current
      const next = tracks[index]
      if (audio === null || next === undefined) return

      setTrackIndex(index)
      setFailed(false)
      setPosition(0)
      setDuration(0)
      audio.src = next.src
      startPlayback(audio)
    },
    [tracks, startPlayback],
  )

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (audio === null) return

    audio.pause()
    // Retirer la source libère le fichier : un disque arrêté ne garde rien en mémoire.
    audio.removeAttribute('src')
    audio.load()
    setTrackIndex(null)
    setFailed(false)
    setPosition(0)
    setDuration(0)
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (audio === null) return

    if (trackIndex === null || failed) {
      playTrack(trackIndex ?? 0)
    } else if (audio.paused) {
      startPlayback(audio)
    } else {
      audio.pause()
    }
  }, [trackIndex, failed, playTrack, startPlayback])

  const next = useCallback(() => {
    if (trackIndex === null) return
    playTrack((trackIndex + 1) % tracks.length)
  }, [trackIndex, tracks, playTrack])

  const previous = useCallback(() => {
    const audio = audioRef.current
    if (audio === null || trackIndex === null) return

    if (audio.currentTime > RESTART_THRESHOLD_S || trackIndex === 0) {
      audio.currentTime = 0
      setPosition(0)
    } else {
      playTrack(trackIndex - 1)
    }
  }, [trackIndex, playTrack])

  const seek = useCallback(
    (seconds: number) => {
      const audio = audioRef.current
      if (audio === null || trackIndex === null) return

      audio.currentTime = seconds
      setPosition(seconds)
    },
    [trackIndex],
  )

  useEffect(() => {
    const audio = audioRef.current
    if (audio === null) return

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onTimeUpdate = () => setPosition(audio.currentTime)
    const onDurationChange = () =>
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    // `stop()` vide la source, ce qui peut aussi lever une erreur : seule compte
    // celle d'un fichier réellement demandé.
    const onError = () => {
      if (!audio.hasAttribute('src')) return
      setFailed(true)
      setPlaying(false)
    }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('error', onError)
    }
  }, [])

  // En fin de piste, le disque enchaîne ; après la dernière, il s'arrête.
  useEffect(() => {
    const audio = audioRef.current
    if (audio === null || trackIndex === null) return

    const onEnded = () => {
      if (trackIndex + 1 < tracks.length) {
        playTrack(trackIndex + 1)
      } else {
        stop()
      }
    }

    audio.addEventListener('ended', onEnded)
    return () => audio.removeEventListener('ended', onEnded)
  }, [trackIndex, tracks, playTrack, stop])

  // Media Session : titre et commandes sur l'écran verrouillé et les touches
  // multimédia du clavier.
  useEffect(() => {
    if (!('mediaSession' in navigator)) return

    navigator.mediaSession.metadata =
      track === null
        ? null
        : new MediaMetadata({
            title: track.title,
            artist: profile.name,
            album: disc.title,
            artwork:
              disc.cover === undefined ? [] : [{ src: new URL(disc.cover, document.baseURI).href }],
          })
  }, [track])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    navigator.mediaSession.playbackState = track === null ? 'none' : playing ? 'playing' : 'paused'
  }, [track, playing])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return

    const handlers: readonly (readonly [MediaSessionAction, MediaSessionActionHandler])[] = [
      ['play', toggle],
      ['pause', () => audioRef.current?.pause()],
      ['previoustrack', previous],
      ['nexttrack', next],
      ['stop', stop],
      [
        'seekto',
        (details) => {
          if (details.seekTime !== undefined) seek(details.seekTime)
        },
      ],
    ]

    const setHandler = (action: MediaSessionAction, handler: MediaSessionActionHandler | null) => {
      try {
        navigator.mediaSession.setActionHandler(action, handler)
      } catch {
        // Action inconnue de ce navigateur : rien à brancher.
      }
    }

    for (const [action, handler] of handlers) setHandler(action, handler)
    return () => {
      for (const [action] of handlers) setHandler(action, null)
    }
  }, [toggle, previous, next, stop, seek])

  const value = useMemo<PlayerContextValue>(
    () => ({
      disc,
      trackIndex,
      track,
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
      playerVisible,
      setPlayerVisible,
    }),
    [
      trackIndex,
      track,
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
      playerVisible,
    ],
  )

  // Annoncé une fois par changement de piste, jamais à chaque seconde écoulée.
  const announcement =
    track === null || trackIndex === null
      ? ''
      : `${failed ? 'Lecture impossible, piste' : 'Piste'} ${trackNumber(trackIndex)} : ${track.title}`

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="none" />
      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>
    </PlayerContext.Provider>
  )
}

export function usePlayer(): PlayerContextValue {
  const context = useContext(PlayerContext)

  if (context === null) {
    throw new Error('usePlayer doit être utilisé à l\'intérieur d\'un PlayerProvider')
  }

  return context
}
