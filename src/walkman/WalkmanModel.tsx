import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

const MODEL_URL = `${import.meta.env.BASE_URL}models/walkman.glb`

interface WalkmanModelProps {
  /** Rotation fixe de l'objet, en radians. */
  readonly rotation: readonly [number, number, number]
}

/**
 * Le walkman, chargé depuis un GLB préparé hors ligne.
 *
 * Ce composant ne fait que charger et orienter : ni recentrage, ni mise à
 * l'échelle, ni suppression de pièces. Tout cela est fait une fois pour toutes
 * dans le fichier livré (voir `scripts/audit-glb.py` pour les critères).
 *
 * C'est délibéré. Les versions précédentes normalisaient le modèle au
 * chargement, dans un effet qui devait rester idempotent et manipulait deux
 * repères différents — c'est de là que venaient les bugs de cadrage. Le code
 * qui n'existe pas ne peut pas se tromper.
 */
export function WalkmanModel({ rotation }: WalkmanModelProps) {
  const { scene } = useGLTF(MODEL_URL)

  // Le GLB est partagé par useGLTF : on le clone pour que d'éventuels autres
  // usages ne partagent pas nos transformations.
  const model = useMemo(() => scene.clone(true), [scene])

  return (
    <group rotation={rotation as unknown as [number, number, number]}>
      <primitive object={model} />
    </group>
  )
}

// Préchargé dès l'évaluation du module, c'est-à-dire au chargement différé de
// la scène — jamais avant.
useGLTF.preload(MODEL_URL)
