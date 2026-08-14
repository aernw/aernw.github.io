import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { WalkmanModel } from './WalkmanModel'
import './WalkmanScene.css'

interface WalkmanSceneProps {
  readonly onJackPosition?: (point: { x: number; y: number }) => void
  /** Appelé au clic sans glisser : le walkman sert aussi de bouton de bascule. */
  readonly onActivate?: () => void
  readonly label: string
}

/** Au-delà de ce déplacement, le geste est un glisser et non un clic. */
const DRAG_THRESHOLD_PX = 6
const ROTATION_SPEED = 0.008

/**
 * Scène 3D du walkman.
 *
 * La manipulation est volontairement limitée à l'objet : on n'attache les
 * écouteurs de déplacement qu'après un appui sur le canvas, et on n'appelle
 * jamais preventDefault sur le toucher. Le scroll de la page passe donc partout,
 * y compris sur la scène — un objet 3D plein écran qui capte le geste est le
 * défaut le plus courant de ce type d'intégration.
 */
export function WalkmanScene({ onJackPosition, onActivate, label }: WalkmanSceneProps) {
  // Orientation de départ : légèrement de trois quarts, face à la caméra.
  const dragRotation = useRef({ x: 0.15, y: -0.6 })
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const dragged = useRef(false)
  const [interacting, setInteracting] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

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

  return (
    <div
      className={`walkman-scene${interacting ? ' walkman-scene--interacting' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 38 }}
        // Fond transparent : le walkman flotte sur la page, il n'a pas de scène
        // propre. C'est ce qu'une iframe Sketchfab ne permettait pas.
        gl={{ alpha: true, antialias: true }}
        // Plafonné à 2 : au-delà, le coût de rendu double sans gain visible.
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 5]} intensity={2.2} />
        <directionalLight position={[-4, -1, -3]} intensity={0.6} />

        <Suspense fallback={null}>
          <WalkmanModel
            {...(onJackPosition === undefined ? {} : { onJackPosition })}
            dragRotation={dragRotation}
            autoRotate={!interacting && !reducedMotion}
          />
          {/* L'environnement donne des reflets crédibles au plastique et au métal. */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      <span className="visually-hidden">{label}</span>
    </div>
  )
}
