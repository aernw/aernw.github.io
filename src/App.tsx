import { useEffect, useRef, useState } from 'react'
import { SideProvider, useSide } from './side/SideContext'
import { AlbumHero } from './album/AlbumHero'
import { Player } from './album/Player'
import { useScrollTurn } from './album/useScrollTurn'
import { useTrackScroll } from './album/useTrackScroll'
import { SideA } from './faces/SideA'
import { SideB } from './faces/SideB'
import { albums, profile } from './content'
import type { Side } from './content'
import './App.css'

/** Durée du fondu au retournement du disque. Doit rester alignée sur App.css. */
const FLIP_DURATION_MS = 260

function Faces() {
  const { side, flip } = useSide()

  // Face réellement affichée : elle change après le fondu sortant, pas pendant.
  const [renderedSide, setRenderedSide] = useState<Side>(side)
  const [flipping, setFlipping] = useState(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Au premier rendu il n'y a rien à faire disparaître.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (side === renderedSide) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setRenderedSide(side)
      window.scrollTo({ top: 0 })
      return
    }

    setFlipping(true)

    const timer = window.setTimeout(() => {
      setRenderedSide(side)
      // Les deux faces n'ont ni les mêmes sections ni la même hauteur : rester
      // à la position de scroll précédente laisserait au milieu de nulle part.
      window.scrollTo({ top: 0 })
      setFlipping(false)
    }, FLIP_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [side, renderedSide])

  // Haut de page : le rebond au-dessus de la pochette prend sa teinte (base.css).
  useEffect(() => {
    const root = document.documentElement
    const update = () => root.toggleAttribute('data-at-top', window.scrollY < window.innerHeight / 2)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      root.removeAttribute('data-at-top')
    }
  }, [])

  useScrollTurn()
  const scroll = useTrackScroll(albums[renderedSide].tracks)

  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>

      {/* Les couleurs de la pochette, très atténuées, derrière toute la page :
          sans couleur dessous, les surfaces en verre ne se verraient pas. */}
      <div className="ambient" aria-hidden="true" />

      <main id="contenu" className={`page${flipping ? ' page--flipping' : ''}`}>
        <AlbumHero side={renderedSide} active={scroll.active} onFlip={flip} />
        <div className="page__content">
          {renderedSide === 'a' ? <SideA /> : <SideB />}
        </div>
      </main>

      {/* Hors de `main` : pendant le retournement, `.page` est transformée, et
          un élément fixe à l'intérieur se calerait sur elle plutôt que sur l'écran. */}
      <Player side={renderedSide} {...scroll} />

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
      </footer>
    </>
  )
}

export function App() {
  return (
    <SideProvider>
      <Faces />
    </SideProvider>
  )
}
