import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Side } from '../content'

const SIDE_PARAM = 'side'
/** Valeur écrite dans l'URL pour le côté Perso : lisible quand on partage le lien. */
const PERSO_PARAM = 'perso'
const DEFAULT_SIDE: Side = 'a'

interface SideContextValue {
  readonly side: Side
  readonly other: Side
  readonly flip: () => void
}

const SideContext = createContext<SideContextValue | null>(null)

/** `b` reste accepté : c'était la valeur des liens partagés avant le renommage des côtés. */
function parseSide(value: string | null): Side {
  return value === PERSO_PARAM || value === 'b' ? 'b' : DEFAULT_SIDE
}

/** Lit le côté demandé dans l'URL. Toute valeur inattendue retombe sur le côté Pro. */
function readSideFromUrl(): Side {
  if (typeof window === 'undefined') return DEFAULT_SIDE
  return parseSide(new URLSearchParams(window.location.search).get(SIDE_PARAM))
}

/**
 * Écrit le côté dans l'URL sans créer d'entrée d'historique.
 *
 * Le choix n'est volontairement pas mémorisé (pas de localStorage) : la bascule
 * reste un geste libre. L'URL sert uniquement à pouvoir partager un lien ciblé.
 */
function writeSideToUrl(side: Side): void {
  const url = new URL(window.location.href)

  if (side === DEFAULT_SIDE) {
    url.searchParams.delete(SIDE_PARAM)
  } else {
    url.searchParams.set(SIDE_PARAM, PERSO_PARAM)
  }

  window.history.replaceState(null, '', url)
}

interface SideProviderProps {
  readonly children: ReactNode
}

export function SideProvider({ children }: SideProviderProps) {
  const [side, setSide] = useState<Side>(readSideFromUrl)

  const flip = useCallback(() => {
    setSide((current) => (current === 'a' ? 'b' : 'a'))
  }, [])

  useEffect(() => {
    writeSideToUrl(side)
    document.documentElement.dataset.side = side
  }, [side])

  // Les boutons précédent/suivant du navigateur doivent rester cohérents avec l'URL.
  useEffect(() => {
    const onPopState = () => setSide(readSideFromUrl())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const value = useMemo<SideContextValue>(
    () => ({ side, other: side === 'a' ? 'b' : 'a', flip }),
    [side, flip],
  )

  return <SideContext.Provider value={value}>{children}</SideContext.Provider>
}

export function useSide(): SideContextValue {
  const context = useContext(SideContext)

  if (context === null) {
    throw new Error('useSide doit être utilisé à l\'intérieur d\'un SideProvider')
  }

  return context
}
