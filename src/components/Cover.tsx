import { useState } from 'react'
import './Cover.css'

interface CoverProps {
  readonly src?: string | undefined
  /** Sert à générer les initiales du repli et le texte alternatif. */
  readonly title: string
  readonly subtitle: string
  /**
   * Remplace le texte alternatif par défaut. Utile hors pochette d'album —
   * un portrait d'artiste n'est pas « la pochette de X par X ».
   */
  readonly alt?: string | undefined
}

/** Deux lettres tirées du nom, pour le repli quand il n'y a pas de pochette. */
function initials(value: string): string {
  const words = value.trim().split(/\s+/).filter(Boolean)
  const first = words[0]?.[0] ?? '?'
  const second = words[1]?.[0] ?? ''
  return (first + second).toUpperCase()
}

/**
 * Pochette d'album chargée depuis une URL externe.
 *
 * Les URLs externes cassent avec le temps — service qui change, image retirée.
 * Plutôt qu'un carré vide, on retombe sur les initiales de l'artiste : la grille
 * garde sa forme et le contenu reste lisible.
 */
export function Cover({ src, title, subtitle, alt }: CoverProps) {
  const [failed, setFailed] = useState(false)
  const showImage = typeof src === 'string' && src.length > 0 && !failed

  if (!showImage) {
    return (
      <div className="cover cover--fallback" aria-hidden="true">
        <span className="cover__initials">{initials(subtitle)}</span>
      </div>
    )
  }

  return (
    <img
      className="cover"
      src={src}
      alt={alt ?? `Pochette de ${title} par ${subtitle}`}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}
