import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import './Rail.css'

interface RailProps {
  /** Décrit le contenu pour les lecteurs d'écran (ex. « Collection de vinyles »). */
  readonly label: string
  readonly children: ReactNode
}

/**
 * Rail à défilement horizontal.
 *
 * Un rail horizontal devient vite un piège d'accessibilité : sans trackpad, on ne
 * peut pas le faire défiler. D'où les trois garanties suivantes.
 *
 * - `tabIndex={0}` et `role="group"` : le rail est focusable, donc navigable aux
 *   flèches du clavier — c'est le comportement natif d'une zone défilante focusable.
 * - Des boutons de défilement explicites apparaissent quand il y a de quoi défiler.
 * - `scroll-snap` cale les éléments, sans jamais bloquer le défilement libre.
 *
 * Le scroll vertical de la page n'est jamais détourné : la molette continue de
 * faire défiler la page, ce qui évite de piéger le visiteur dans le rail.
 *
 * Les enfants doivent porter la classe `rail__item` (ou être une liste dont les
 * `li` la portent) pour que le calage fonctionne.
 */
export function Rail({ label, children }: RailProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateAffordances = useCallback(() => {
    const track = trackRef.current
    if (track === null) return

    const { scrollLeft, scrollWidth, clientWidth } = track
    // Marge d'un pixel : les navigateurs arrondissent les positions de scroll.
    setCanScrollLeft(scrollLeft > 1)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (track === null) return

    updateAffordances()

    // Le contenu comme la fenêtre peuvent changer de taille après le montage.
    const observer = new ResizeObserver(updateAffordances)
    observer.observe(track)
    for (const child of track.children) observer.observe(child)

    return () => observer.disconnect()
  }, [updateAffordances])

  const scrollByPage = useCallback((direction: 1 | -1) => {
    const track = trackRef.current
    if (track === null) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    track.scrollBy({
      left: direction * track.clientWidth * 0.8,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [])

  const showControls = canScrollLeft || canScrollRight

  return (
    <div className="rail">
      <div
        ref={trackRef}
        className="rail__track"
        onScroll={updateAffordances}
        // Focusable pour permettre le défilement aux flèches du clavier.
        tabIndex={0}
        role="group"
        aria-label={`${label} — liste défilante horizontalement`}
      >
        {children}
      </div>

      {showControls ? (
        <div className="rail__controls">
          <button
            type="button"
            className="rail__button"
            onClick={() => scrollByPage(-1)}
            disabled={!canScrollLeft}
          >
            <span aria-hidden="true">←</span>
            <span className="visually-hidden">Faire défiler {label} vers la gauche</span>
          </button>
          <button
            type="button"
            className="rail__button"
            onClick={() => scrollByPage(1)}
            disabled={!canScrollRight}
          >
            <span aria-hidden="true">→</span>
            <span className="visually-hidden">Faire défiler {label} vers la droite</span>
          </button>
        </div>
      ) : null}
    </div>
  )
}
