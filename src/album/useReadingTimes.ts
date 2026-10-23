import { useEffect, useState } from 'react'
import type { Track } from '../content'

/** Vitesse de lecture moyenne, en mots par minute. */
const WORDS_PER_MINUTE = 200
/** Une section qui n'est faite que d'images se regarde quand même un moment. */
const MIN_SECONDS = 10

/** 95 s → « 1:35 ». */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const rest = Math.round(seconds % 60)
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

/**
 * La « durée » de chaque piste : le temps de lecture estimé de sa section,
 * compté sur le texte réellement affiché. Mesuré après le rendu, donc vide au
 * premier passage.
 */
export function useReadingTimes(tracks: readonly Track[]): readonly number[] | null {
  const [seconds, setSeconds] = useState<readonly number[] | null>(null)

  useEffect(() => {
    setSeconds(
      tracks.map((track) => {
        const text = document.getElementById(track.id)?.textContent ?? ''
        const words = text.split(/\s+/).filter(Boolean).length
        return Math.max(MIN_SECONDS, Math.round((words / WORDS_PER_MINUTE) * 60))
      }),
    )
  }, [tracks])

  return seconds
}
