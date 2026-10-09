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

  if (visual.kind === 'video') {
    // Boucle courte et contenue : contrairement à la dérive des sprites ou aux
    // transitions de Reveal, on la joue même sous prefers-reduced-motion.
    return (
      <div className="project-visual project-visual--video" aria-hidden="true">
        <video poster={visual.poster} autoPlay loop muted playsInline preload="metadata">
          <source src={visual.sources.webm} type="video/webm" />
          <source src={visual.sources.mp4} type="video/mp4" />
        </video>
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
          style={visual.pixelated ? { imageRendering: 'pixelated' } : undefined}
        />
      ))}
    </div>
  )
}
