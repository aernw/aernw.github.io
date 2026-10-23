/*
 * Pictogrammes des touches du lecteur. Décoratifs : chaque bouton porte son
 * propre libellé accessible.
 */

export function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
    </svg>
  )
}

export function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 5.5h3.5v13H7zM13.5 5.5H17v13h-3.5z" fill="currentColor" />
    </svg>
  )
}

export function PreviousIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6h2v12H6zM19 6v12l-9-6z" fill="currentColor" />
    </svg>
  )
}

export function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 6h2v12h-2zM5 6v12l9-6z" fill="currentColor" />
    </svg>
  )
}

export function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7h10v10H7z" fill="currentColor" />
    </svg>
  )
}
