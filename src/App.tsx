import { useEffect, useRef, useState } from 'react'
import { SideProvider, useSide } from './side/SideContext'
import { Walkman } from './walkman/Walkman'
import { SideA } from './faces/SideA'
import { SideB } from './faces/SideB'
import { profile } from './content'
import type { Side } from './content'
import './App.css'

/** Durée du fondu au retournement de la cassette. Doit rester alignée sur App.css. */
const FLIP_DURATION_MS = 260

function Faces() {
  const { side } = useSide()

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

  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>

      <main id="contenu" className={`page${flipping ? ' page--flipping' : ''}`}>
        {renderedSide === 'a' ? <SideA /> : <SideB />}
      </main>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
      </footer>

      <Walkman />
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
