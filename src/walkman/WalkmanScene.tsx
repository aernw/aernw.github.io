import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Vector3 } from 'three'
import { WalkmanModel } from './WalkmanModel'
import { Cable } from './Cable'
import './WalkmanScene.css'

interface WalkmanSceneProps {
  readonly label: string
  readonly cableColor: string
}

/**
 * Point de branchement du câble, en fractions de la taille du walkman depuis
 * son centre. Le modèle ne comporte pas de prise femelle : on la place ici, en
 * bas à droite du boîtier.
 */
const SOCKET_OFFSET = { x: 0.3, y: -0.44, z: 0.12 }

/** Extrémité basse du câble : hors champ, sous le bord de l'écran. */
const CABLE_END: readonly [number, number, number] = [0.4, -5.5, 0]

/**
 * Scène 3D couvrant toute la page.
 *
 * Le canvas est plein écran pour que le câble descende derrière le contenu,
 * mais il n'intercepte aucun événement : `pointer-events: none`. La scène est
 * purement décorative — la navigation passe par le bouton de bascule, qui lui
 * est focusable au clavier.
 */
export function WalkmanScene({ label, cableColor }: WalkmanSceneProps) {
  // Position du point de branchement, partagée avec le câble. Une référence
  // plutôt qu'un state : elle est lue à chaque frame par la boucle de rendu.
  const socketAnchor = useMemo(() => ({ current: new Vector3(0, 0, 0) }), [])

  return (
    <div className="walkman-scene">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 38 }}
        // Fond transparent : les objets flottent sur la page, la scène n'a pas
        // de décor propre.
        gl={{ alpha: true, antialias: true }}
        // Plafonné à 2 : au-delà, le coût de rendu double sans gain visible.
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 6, 5]} intensity={2.2} />
        <directionalLight position={[-4, -1, -3]} intensity={0.6} />

        <Suspense fallback={null}>
          {/*
            Décalé vers la droite et vers le haut : le walkman occupe le vide du
            hero sans recouvrir le titre, qui part du bord gauche.
            Si le cadrage ne convient pas, c'est cette valeur qu'il faut ajuster
            (x vers la droite, y vers le haut).
          */}
          <group position={[3.4, 1.4, 0]}>
            <WalkmanModel socketAnchor={socketAnchor} socketOffset={SOCKET_OFFSET} />
          </group>

          <Cable anchorRef={socketAnchor} endPoint={CABLE_END} color={cableColor} />

          {/* L'environnement donne des reflets crédibles au plastique et au métal. */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      <span className="visually-hidden">{label}</span>
    </div>
  )
}
