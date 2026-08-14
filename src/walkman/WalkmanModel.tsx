import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Box3, Vector3 } from 'three'

const MODEL_URLS = {
  walkman: `${import.meta.env.BASE_URL}models/walkman.glb`,
  computer: `${import.meta.env.BASE_URL}models/macbook_air_m2.glb`,
} as const

interface WalkmanModelProps {
  /** Rotation fixe de l'objet, en radians. */
  readonly rotation: readonly [number, number, number]
  readonly asset: keyof typeof MODEL_URLS
  readonly targetSize?: number
}

/**
 * Le modèle 3D principal du hero, qui peut être un walkman ou un ordinateur.
 *
 * On le normalise à une taille cible calculée depuis sa boîte englobante afin
 * d'obtenir le même cadrage localement et sur GitHub Pages.
 */
export function WalkmanModel({ rotation, asset, targetSize = 2.4 }: WalkmanModelProps) {
  const { scene } = useGLTF(MODEL_URLS[asset])

  const model = useMemo(() => {
    const clone = scene.clone(true)
    const box = new Box3().setFromObject(clone)
    const size = new Vector3()
    box.getSize(size)

    const maxDimension = Math.max(size.x, size.y, size.z) || 1
    const scale = targetSize / maxDimension

    clone.scale.setScalar(scale)
    return clone
  }, [scene, targetSize])

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
