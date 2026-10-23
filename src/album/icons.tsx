import type { ReactNode } from 'react'

/*
 * Icônes du lecteur, dessinées sur une grille de 24. Décoratives : le bouton
 * qui les contient porte toujours un nom accessible.
 */

interface IconProps {
  readonly size?: number
}

function Svg({ size = 20, children }: IconProps & { readonly children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

export function PlayIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M7 4.8v14.4c0 .8.9 1.3 1.6.9l11.3-7.2a1 1 0 0 0 0-1.7L8.6 3.9C7.9 3.5 7 4 7 4.8Z"
        fill="currentColor"
      />
    </Svg>
  )
}

export function PreviousIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M11.5 6.2v11.6c0 .7-.8 1.1-1.3.7L3 12.7a.9.9 0 0 1 0-1.4l7.2-5.8c.5-.4 1.3 0 1.3.7Zm9.5 0v11.6c0 .7-.8 1.1-1.3.7l-7.2-5.8a.9.9 0 0 1 0-1.4l7.2-5.8c.5-.4 1.3 0 1.3.7Z"
        fill="currentColor"
      />
    </Svg>
  )
}

export function NextIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12.5 6.2v11.6c0 .7.8 1.1 1.3.7l7.2-5.8a.9.9 0 0 0 0-1.4l-7.2-5.8c-.5-.4-1.3 0-1.3.7ZM3 6.2v11.6c0 .7.8 1.1 1.3.7l7.2-5.8a.9.9 0 0 0 0-1.4L4.3 5.5C3.8 5.1 3 5.5 3 6.2Z"
        fill="currentColor"
      />
    </Svg>
  )
}

export function ListIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="4.5" cy="6" r="1.6" fill="currentColor" />
      <circle cx="4.5" cy="12" r="1.6" fill="currentColor" />
      <circle cx="4.5" cy="18" r="1.6" fill="currentColor" />
      <path d="M9 6h11M9 12h11M9 18h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  )
}

/** Égaliseur : marque la piste en cours dans les listes. */
export function NowPlayingIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="4" y="9" width="3" height="10" rx="1.5" fill="currentColor" />
      <rect x="10.5" y="4" width="3" height="15" rx="1.5" fill="currentColor" />
      <rect x="17" y="12" width="3" height="7" rx="1.5" fill="currentColor" />
    </Svg>
  )
}
