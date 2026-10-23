import { useEffect, useState } from 'react'
import type { Track } from '../content'

/** Une section devient « en cours » quand son haut passe ce point de l'écran. */
const ACTIVE_LINE = 0.45

export interface TrackScroll {
  /** Index de la piste en cours ; -1 tant qu'on est dans le hero (« Intro »). */
  readonly active: number
  /** Progression du défilement dans toute la page, de 0 à 1. */
  readonly progress: number
}

/**
 * Suit la position de lecture : quelle section est à l'écran, et où l'on en
 * est dans la page. Une mesure par image au plus, au défilement et au
 * redimensionnement.
 */
export function useTrackScroll(tracks: readonly Track[]): TrackScroll {
  const [state, setState] = useState<TrackScroll>({ active: -1, progress: 0 })

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const line = window.innerHeight * ACTIVE_LINE
      let active = -1

      tracks.forEach((track, index) => {
        const section = document.getElementById(track.id)
        if (section !== null && section.getBoundingClientRect().top <= line) active = index
      })

      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0

      setState((current) =>
        current.active === active && Math.abs(current.progress - progress) < 0.002
          ? current
          : { active, progress },
      )
    }

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame !== 0) cancelAnimationFrame(frame)
    }
  }, [tracks])

  return state
}

/** Fait défiler la page jusqu'à une piste ; sans piste, revient en haut. */
export function goToTrack(track: Track | undefined): void {
  if (track === undefined) {
    window.scrollTo({ top: 0 })
    return
  }

  document.getElementById(track.id)?.scrollIntoView({ block: 'start' })
}
