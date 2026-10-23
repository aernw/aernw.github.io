/** « 83 » → « 1:23 ». Les secondes sont tronquées, comme sur l'afficheur d'un lecteur. */
export function formatTime(seconds: number): string {
  const whole = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0
  const minutes = Math.floor(whole / 60)
  const rest = whole % 60
  return `${minutes}:${rest.toString().padStart(2, '0')}`
}

/** « 1:23 » → 83. Renvoie `null` si la durée saisie dans le contenu est mal formée. */
export function parseDuration(value: string): number | null {
  const match = /^(\d+):([0-5]\d)$/.exec(value.trim())
  if (match === null) return null
  return Number(match[1]) * 60 + Number(match[2])
}

/** Durée totale du disque, ou `null` si une seule piste a une durée illisible. */
export function totalDuration(durations: readonly string[]): number | null {
  let total = 0

  for (const duration of durations) {
    const seconds = parseDuration(duration)
    if (seconds === null) return null
    total += seconds
  }

  return total
}

/** Numéro de piste sur deux chiffres, comme au dos d'un boîtier : « 01 ». */
export function trackNumber(index: number): string {
  return (index + 1).toString().padStart(2, '0')
}
