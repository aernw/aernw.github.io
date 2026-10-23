import type { CSSProperties } from 'react'
import type { Album } from '../content'
import './AlbumCover.css'

interface AlbumCoverProps {
  readonly album: Album
  /** Petite indication posée en bas à droite de la pochette. */
  readonly hint?: string
}

/**
 * La pochette d'un côté : un dégradé tiré des couleurs du côté (--art-*), son
 * nom en grand, une petite ligne en bas. Dessinée en CSS, sans image : elle
 * suit la palette quand on retourne le disque.
 */
export function AlbumCover({ album, hint }: AlbumCoverProps) {
  // Un nom court s'écrit plus grand : « Pro » et « Perso » occupent à peu près
  // la même largeur sur la pochette.
  const nameStyle: CSSProperties = { fontSize: album.name.length <= 3 ? '38cqi' : '30cqi' }

  return (
    <span className="album-cover" aria-hidden="true">
      <span className="album-cover__name" style={nameStyle}>
        {album.name}
      </span>
      <span className="album-cover__foot">
        <span className="album-cover__line">{album.coverLine}</span>
        {hint === undefined ? null : <span className="album-cover__hint">↻ {hint}</span>}
      </span>
    </span>
  )
}
