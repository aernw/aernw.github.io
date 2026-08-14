import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

const MODEL_URLS = {
  walkman: `${import.meta.env.BASE_URL}models/walkman.glb`,
  computer: `${import.meta.env.BASE_URL}models/macbook_air_m2.glb`,
} as const

interface WalkmanModelProps {
  /** Rotation fixe de l'objet, en radians. */
  readonly rotation: readonly [number, number, number]
  readonly asset: keyof typeof MODEL_URLS
}

/**
 * Le modèle 3D principal du hero, qui peut être un walkman ou un ordinateur.
 *
 * Le composant ne fait que charger et orienter : ni recentrage, ni mise à
 * l'échelle, ni suppression de pièces. Tout cela est fait une fois pour toutes
 * dans le fichier livré (voir `scripts/audit-glb.py` pour les critères).
 */
export function WalkmanModel({ rotation, asset }: WalkmanModelProps) {
  const { scene } = useGLTF(MODEL_URLS[asset])

  // Le GLB est partagé par useGLTF : on le clone pour que d'éventuels autres
  // usages ne partagent pas nos transformations.
  const model = useMemo(() => scene.clone(true), [scene])

  return (
    <group rotation={rotation as unknown as [number, number, number]}>
      <primitive object={model} />
    </group>
  )
}

// Préchargés dès l'évaluation du module, c'est-à-dire au chargement différé de
// la scène — jamais avant.
useGLTF.preload(MODEL_URLS.walkman)
useGLTF.preload(MODEL_URLS.computer)
