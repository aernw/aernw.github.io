import type { ProjectVisual as Visual } from '../content'
import './ProjectVisual.css'

interface ProjectVisualProps {
  readonly visual: Visual | undefined
}

/**
 * Visuel décoratif d'une carte projet.
 *
 * Les sprites sont purement ornementaux — l'information est dans le texte —
 * donc ils sont masqués aux lecteurs d'écran. Une capture d'écran, elle, porte
 * du sens et garde son texte alternatif.
 */
export function ProjectVisual({ visual }: ProjectVisualProps) {
  if (visual === undefined || visual.kind === 'none') return null

  if (visual.kind === 'image') {
    return (
      <div className="project-visual project-visual--image">
        <img src={visual.src} alt={visual.alt} loading="lazy" decoding="async" />
      </div>
    )
  }

  return (
    <div className="project-visual project-visual--sprites" aria-hidden="true">
      {visual.sources.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className={`project-sprite project-sprite--${index + 1}`}
          // Les sprites du jeu sont en pixel-art : ils doivent le rester.
          style={{ imageRendering: 'pixelated' }}
        />
      ))}
    </div>
  )
}
