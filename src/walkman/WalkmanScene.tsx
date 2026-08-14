import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { WalkmanModel } from './WalkmanModel'
import { Cable } from './Cable'
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
  readonly cableColor: string
}

/* ── Réglages du cadrage ───────────────────────────────────────────
 * Toutes les valeurs qui décident de l'allure de la scène sont ici.
 * À z=6 avec un fov de 38°, la demi-largeur visible fait environ 5,2 unités.
 */

/** Position du walkman : à droite, pour laisser le titre respirer. */
const WALKMAN_POSITION: readonly [number, number, number] = [3.4, 1.3, 0]

/**
 * Orientation du walkman : face avant tournée vers la caméra.
 *
 * La rotation d'un demi-tour sur Y est nécessaire — le modèle présente sa face
 * arrière par défaut. C'est de face qu'on lit la fenêtre cassette, les boutons
 * et le logo Sony.
 */
const WALKMAN_ROTATION: readonly [number, number, number] = [0.08, Math.PI - 0.15, 0]

/** Départ du câble, au bas du walkman. */
const CABLE_START: readonly [number, number, number] = [
  WALKMAN_POSITION[0] - 0.35,
  WALKMAN_POSITION[1] - 0.95,
  0.25,
]

/**
 * Scène 3D couvrant toute la page.
 *
 * Entièrement statique : `frameloop="demand"` demande à Three.js de ne rendre
 * que lorsqu'il y a une raison de le faire, au lieu de tourner soixante fois
 * par seconde. Rien ne bougeant ici, la scène est rendue une fois puis laissée
 * en l'état — coût processeur nul, et résultat identique partout.
 *
 * Le canvas n'intercepte aucun événement : il couvre tout le viewport, et le
 * moindre `pointer-events: auto` bloquerait les liens et le scroll du site.
 */
export function WalkmanScene({ label, cableColor }: WalkmanSceneProps) {
  return (
    <div className="walkman-scene">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 38 }}
        frameloop="demand"
        // Fond transparent : les objets flottent sur la page.
        gl={{ alpha: true, antialias: true }}
        // Plafonné à 2 : au-delà, le coût de rendu double sans gain visible.
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 6]} intensity={2.3} />
        <directionalLight position={[-4, 0, -2]} intensity={0.5} />

        <RenderOnDemand />

        <Suspense fallback={null}>
          <group position={WALKMAN_POSITION as unknown as [number, number, number]}>
            <WalkmanModel rotation={WALKMAN_ROTATION} />
          </group>

          {/* Ondulations resserrées : plus larges, le câble croiserait le
              texte du hero au lieu de rester dans la marge droite. */}
          <Cable start={CABLE_START} sway={0.5} drop={9} color={cableColor} />

          {/* L'environnement donne des reflets crédibles au plastique et au métal. */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      <span className="visually-hidden">{label}</span>
    </div>
  )
}
