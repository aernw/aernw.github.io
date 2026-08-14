import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import './Reveal.css'

/**
 * Balises acceptées.
 *
 * Volontairement restreint aux éléments HTML utilisés ici : depuis l'ajout de
 * Three.js, `ElementType` englobe aussi les éléments de scène 3D, dont les
 * props sont incompatibles avec celles d'un conteneur DOM.
 */
type RevealTag = 'div' | 'header' | 'section' | 'li' | 'article'

interface RevealProps {
  readonly children: ReactNode
  /** Décale l'apparition, pour que des éléments voisins se révèlent en cascade. */
  readonly delay?: number
  /** Balise rendue. `div` par défaut ; utiliser `li` dans une liste. */
  readonly as?: RevealTag
  readonly className?: string
}

type RevealStyle = CSSProperties & { readonly '--reveal-delay'?: string }

/** Une fois révélé, on ne cache jamais à nouveau : le contenu ne clignote pas au scroll. */
const OBSERVER_OPTIONS: IntersectionObserverInit = {
  // Déclenche un peu avant l'entrée réelle dans le viewport.
  rootMargin: '0px 0px -12% 0px',
  threshold: 0.08,
}

/**
 * Révèle son contenu à l'approche du scroll.
 *
 * Deux garanties, parce qu'une animation d'apparition qui échoue laisse une page
 * blanche :
 * - le contenu est marqué visible dès le montage si l'utilisateur a demandé moins
 *   d'animation, ou si `IntersectionObserver` est indisponible ;
 * - l'état masqué n'est appliqué que par une classe CSS, jamais en style inline,
 *   de sorte qu'un échec du JavaScript laisse le contenu affiché.
 */
export function Reveal({ children, delay = 0, as: Tag = 'div', className }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (node === null) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      }
    }, OBSERVER_OPTIONS)

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const style: RevealStyle = delay > 0 ? { '--reveal-delay': `${delay}ms` } : {}
  const classes = ['reveal', revealed ? 'reveal--visible' : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  // La balise étant une union, TypeScript exige une ref satisfaisant *toutes*
  // les balises possibles à la fois. Le cast est sûr : toutes sont des éléments
  // HTML, et la ref ne sert qu'à observer l'intersection.
  const tagRef = ref as React.Ref<never>

  return (
    <Tag ref={tagRef} className={classes} style={style}>
      {children}
    </Tag>
  )
}
