import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Vector3 } from 'three'
import { WalkmanModel } from './WalkmanModel'
import { Cable } from './Cable'
import { HoverProbe } from './HoverProbe'
import './WalkmanScene.css'

interface WalkmanSceneProps {
  /** Appelé au clic sans glisser : le walkman sert aussi de bouton de bascule. */
  readonly onActivate?: () => void
  readonly label: string
  readonly cableColor: string
}

/** Au-delà de ce déplacement, le geste est un glisser et non un clic. */
const DRAG_THRESHOLD_PX = 6
const ROTATION_SPEED = 0.008

/**
 * Scène 3D couvrant toute la page.
 *
 * Le canvas est plein écran pour que le câble puisse descendre derrière le
 * contenu, mais il est transparent aux événements : `pointer-events: none` sur
 * le conteneur, réactivé uniquement sur les objets. Sans cela, un canvas de
 * cette taille intercepterait tous les clics sur les liens et le scroll de la
 * page — c'est le défaut le plus courant des scènes 3D plein écran.
 */
export function WalkmanScene({ onActivate, label, cableColor }: WalkmanSceneProps) {
  const dragRotation = useRef({ x: 0.15, y: -0.6 })
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const dragged = useRef(false)
  const [interacting, setInteracting] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Position de la prise jack en coordonnées de scène, partagée avec le câble.
  const jackAnchor = useMemo(() => ({ current: new Vector3(0, 0, 0) }), [])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(query.matches)

    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    pointerStart.current = { x: event.clientX, y: event.clientY }
    dragged.current = false
    setInteracting(true)
  }, [])

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    const start = pointerStart.current
    if (start === null) return

    const dx = event.clientX - start.x
    const dy = event.clientY - start.y

    if (!dragged.current && Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
      dragged.current = true
    }

    if (dragged.current) {
      dragRotation.current.y += event.movementX * ROTATION_SPEED
      // L'inclinaison verticale est bornée : sans cela, l'objet se retrouve
      // sur la tête et devient illisible.
      dragRotation.current.x = Math.max(
        -0.6,
        Math.min(0.6, dragRotation.current.x + event.movementY * ROTATION_SPEED),
      )
    }
  }, [])

  const handlePointerUp = useCallback(() => {
    // Un appui sans déplacement est un clic : il retourne la cassette.
    if (!dragged.current && onActivate !== undefined) {
      onActivate()
    }
    pointerStart.current = null
    setInteracting(false)
  }, [onActivate])

  const classes = [
    'walkman-scene',
    hovering ? 'walkman-scene--hot' : '',
    interacting ? 'walkman-scene--interacting' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 38 }}
        // Fond transparent : les objets flottent sur la page, la scène n'a pas
        // de décor propre.
        gl={{ alpha: true, antialias: true }}
        // Plafonné à 2 : au-delà, le coût de rendu double sans gain visible.
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 5]} intensity={2.2} />
        <directionalLight position={[-4, -1, -3]} intensity={0.6} />

        <Suspense fallback={null}>
          {/* Décalé à droite et vers le haut : le walkman occupe le vide du
              hero sans recouvrir le titre, qui part du bord gauche. */}
          <group
            position={[2.1, 1.1, 0]}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <WalkmanModel
              jackAnchor={jackAnchor}
              dragRotation={dragRotation}
              autoRotate={!interacting && !reducedMotion}
            />
          </group>

          <Cable anchorRef={jackAnchor} color={cableColor} />

          <HoverProbe onHoverChange={setHovering} />

          {/* L'environnement donne des reflets crédibles au plastique et au métal. */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      <span className="visually-hidden">{label}</span>
    </div>
  )
}
