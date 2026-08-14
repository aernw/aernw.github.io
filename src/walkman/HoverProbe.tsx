import { useEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { Raycaster, Vector2 } from 'three'

interface HoverProbeProps {
  /** Appelé quand le curseur entre ou sort des objets de la scène. */
  readonly onHoverChange: (hovering: boolean) => void
}

/**
 * Détecte si le curseur survole réellement un objet de la scène.
 *
 * Le canvas couvre tout le viewport mais reste transparent aux événements :
 * sans cela, il intercepterait tous les clics sur les liens du site. On écoute
 * donc les déplacements du curseur au niveau de la fenêtre, on lance un rayon
 * dans la scène, et on n'active le canvas que lorsqu'un objet est touché.
 *
 * Le rayon n'est lancé qu'à chaque déplacement du curseur, pas à chaque frame :
 * l'opération est trop coûteuse pour tourner en continu.
 */
export function HoverProbe({ onHoverChange }: HoverProbeProps) {
  const { camera, scene, size } = useThree()
  const raycaster = useMemo(() => new Raycaster(), [])
  const pointer = useMemo(() => new Vector2(), [])
  const hovering = useRef(false)

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointer.set((event.clientX / size.width) * 2 - 1, -(event.clientY / size.height) * 2 + 1)
      raycaster.setFromCamera(pointer, camera)

      const hits = raycaster.intersectObjects(scene.children, true)
      const next = hits.length > 0

      // On ne notifie qu'aux transitions, pour éviter un rendu React par
      // mouvement de souris.
      if (next !== hovering.current) {
        hovering.current = next
        onHoverChange(next)
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [camera, scene, size, raycaster, pointer, onHoverChange])

  return null
}
