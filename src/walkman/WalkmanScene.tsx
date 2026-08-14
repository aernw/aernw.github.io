import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { WalkmanModel } from './WalkmanModel'
import { ScatteredObjects } from './ScatteredObjects'
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
}

/* ── Réglages du cadrage ───────────────────────────────────────────
 * Toutes les valeurs qui décident de l'allure de la scène sont ici.
 * À z=6 avec un fov de 38°, la demi-largeur visible fait environ 5,2 unités.
 * Le modèle livré mesure 3,1 unités sur son plus grand axe et est centré.
 */

/**
 * Position du walkman : au centre, devant le nom.
 *
 * Le chevauchement avec le titre est voulu — c'est lui qui donne la profondeur.
 * Légèrement au-dessus du centre pour mordre sur le nom sans le noyer.
 */
const WALKMAN_POSITION: readonly [number, number, number] = [0, 0.1, 0]

/** Orientation du walkman, légèrement de trois quarts. */
const WALKMAN_ROTATION: readonly [number, number, number] = [0.12, -0.4, 0]

/**
 * Échelle du walkman.
 *
 * Généreuse : l'objet passant derrière le texte, il peut occuper largement
 * l'écran sans jamais gêner la lecture.
 */
const WALKMAN_SCALE = 0.95

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
export function WalkmanScene({ label }: WalkmanSceneProps) {
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
        {/* Sonde de cadrage, active seulement en développement : elle mesure
            l'emprise réelle du modèle à l'écran, là où une capture ne dit pas
            si un défaut vient du code ou du navigateur. */}
        {import.meta.env.DEV ? <FramingProbe /> : null}

        <Suspense fallback={null}>
          <group
            position={WALKMAN_POSITION as unknown as [number, number, number]}
            scale={WALKMAN_SCALE}
          >
            <WalkmanModel rotation={WALKMAN_ROTATION} />
          </group>

          {/* Hors du groupe du walkman : ces objets ont leur propre repère et ne
              doivent hériter ni de son cadrage, ni de son échelle. */}
          <ScatteredObjects />

          {/* L'environnement donne des reflets crédibles au plastique et au métal. */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      <span className="visually-hidden">{label}</span>
    </div>
  )
}
