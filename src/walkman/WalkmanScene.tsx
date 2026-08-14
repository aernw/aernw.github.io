import { Suspense, useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { WalkmanModel } from './WalkmanModel'
import { FramingProbe } from './FramingProbe'
import './WalkmanScene.css'

/**
 * Redemande un rendu quand l'onglet redevient visible ou que la fenêtre change
 * de taille.
 *
 * Avec `frameloop="demand"`, la scène n'est peinte que sur demande. Si l'unique
 * frame initiale tombe alors que l'onglet est en arrière-plan, le navigateur ne
 * la peint jamais et la page reste vide au retour de l'utilisateur.
 */
function RenderOnDemand() {
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    const request = () => invalidate()

    document.addEventListener('visibilitychange', request)
    window.addEventListener('resize', request)
    window.addEventListener('pageshow', request)

    return () => {
      document.removeEventListener('visibilitychange', request)
      window.removeEventListener('resize', request)
      window.removeEventListener('pageshow', request)
    }
  }, [invalidate])

  return null
}

interface WalkmanSceneProps {
  readonly label: string
  readonly side: 'a' | 'b'
  readonly onFlip: () => void
  readonly pulseTick: number
}

/* ── Réglages du cadrage ───────────────────────────────────────────
 * Toutes les valeurs qui décident de l'allure de la scène sont ici.
 * À z=6 avec un fov de 38°, la demi-largeur visible fait environ 5,2 unités.
 * Le modèle livré mesure 3,1 unités sur son plus grand axe et est centré.
 */

const HERO_CONFIG = {
  a: {
    name: 'computer-hero',
    position: [0.14, 0.18, -0.15] as const,
    rotation: [0.08, -1.35, 0.03] as const,
    scale: 1,
    targetSize: 3.2,
    asset: 'computer' as const,
  },
  b: {
    name: 'walkman-hero',
    position: [-0.80, 1.0, -0.8] as const,
    rotation: [0.18, -0.1, 0] as const,
    scale: 1,
    targetSize: 2.8,
    asset: 'walkman' as const,
  },
} as const

/**
 * Scène 3D couvrant toute la page.
 *
 * `frameloop="demand"` demande à Three.js de ne rendre que lorsqu'il y a une
 * raison de le faire, au lieu de tourner soixante fois par seconde. Le fond
 * reste statique, mais le modèle du hero répond au survol et au clic pour
 * rendre la bascule plus vivante.
 */
export function WalkmanScene({ label, side, onFlip, pulseTick }: WalkmanSceneProps) {
  const hero = HERO_CONFIG[side]
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <div className="walkman-scene">
      <Canvas
        camera={{ position: [0, 0, 7.8], fov: 45 }}
        frameloop="demand"
        // Fond transparent : les objets flottent sur la page.
        gl={{ alpha: true, antialias: true }}
        // Plafonné à 2 : au-delà, le coût de rendu double sans gain visible.
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.72} />
        <directionalLight position={[3, 5, 6]} intensity={1.25} />
        <directionalLight position={[-4, 1, -2]} intensity={0.42} />
        <directionalLight position={[0, -2, 5]} intensity={0.35} />

        <RenderOnDemand />
        {/* Sonde de cadrage, active seulement en développement : elle mesure
            l'emprise réelle du modèle à l'écran, là où une capture ne dit pas
            si un défaut vient du code ou du navigateur. */}
        {import.meta.env.DEV ? <FramingProbe /> : null}

        <Suspense fallback={null}>
          <group
            name={hero.name}
            position={hero.position as unknown as [number, number, number]}
            scale={hero.scale}
          >
            <WalkmanModel
              rotation={hero.rotation}
              asset={hero.asset}
              targetSize={hero.targetSize}
              hovered={hovered}
              pressed={pressed}
              pulseTick={pulseTick}
            />
          </group>

          {/* L'environnement donne des reflets crédibles au plastique et au métal. */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      <button
        type="button"
        className={`walkman-scene__hotspot walkman-scene__hotspot--${side}`}
        aria-label={`Basculer sur la face ${side === 'a' ? 'B' : 'A'}`}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => {
          setHovered(false)
          setPressed(false)
        }}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onClick={onFlip}
      />

      <span className="visually-hidden">{label}</span>
    </div>
  )
}
