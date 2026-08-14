import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Box3, Vector3 } from 'three'

const MODEL_URL = `${import.meta.env.BASE_URL}models/walkman.glb`

/**
 * Groupes conservés de la scène d'origine.
 *
 * Le GLB est une mise en scène complète : dix cassettes éparpillées jusqu'à
 * sept unités du centre, ce qui rendait la boîte englobante — et donc le calcul
 * d'échelle — inexploitable. On ne garde que l'appareil et la cassette qu'il
 * contient.
 *
 * Le casque est écarté : dans ce modèle il est posé à côté du walkman, relié à
 * sa propre fiche par son propre câble, sans être branché sur l'appareil.
 */
const KEPT_GROUPS = new Set(['walkman', 'tape_1'])

interface WalkmanModelProps {
  /** Rotation fixe de l'objet, en radians. */
  readonly rotation: readonly [number, number, number]
  /** Taille cible du plus grand axe, en unités de scène. */
  readonly targetSize?: number
}

/**
 * Le walkman, chargé depuis un GLB compressé (Draco + textures WebP).
 *
 * Immobile : aucune boucle de rendu, aucune animation. Le modèle est normalisé
 * une fois au chargement, puis ne bouge plus. C'est ce qui rend la scène
 * prévisible — les tentatives précédentes couplaient rotation et ancrage du
 * câble, et chaque frame décalait un peu plus l'ensemble.
 */
export function WalkmanModel({ rotation, targetSize = 2.1 }: WalkmanModelProps) {
  const { scene } = useGLTF(MODEL_URL)
  const invalidate = useThree((state) => state.invalidate)

  // Le GLB est partagé par useGLTF : on le clone pour pouvoir le modifier
  // sans affecter d'autres usages éventuels.
  const model = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    const rootNode = model.getObjectByName('RootNode')
    if (rootNode !== undefined) {
      for (const child of [...rootNode.children]) {
        if (!KEPT_GROUPS.has(child.name)) rootNode.remove(child)
      }
    }

    // Repartir d'une transformation neutre : l'effet peut se rejouer, et
    // cumuler deux normalisations éloignerait le modèle un peu plus à chaque fois.
    model.position.set(0, 0, 0)
    model.scale.setScalar(1)
    model.rotation.set(0, 0, 0)
    model.updateWorldMatrix(true, true)

    const size = new Box3().setFromObject(model).getSize(new Vector3())
    const maxAxis = Math.max(size.x, size.y, size.z)

    /*
     * Mise à l'échelle puis recentrage, en deux temps mesurés.
     *
     * `Box3.setFromObject` renvoie un centre en coordonnées MONDE. On ne peut
     * pas le soustraire à une position locale : les nœuds internes de ce GLB
     * portent leurs propres transformations, dont une échelle de 0,01. On
     * applique donc l'échelle d'abord, puis on remesure — le nouveau centre est
     * alors dans le même repère que la position du modèle.
     */
    if (maxAxis > 0) {
      model.scale.setScalar(targetSize / maxAxis)
      model.updateWorldMatrix(true, true)
    }

    const scaledCenter = new Box3().setFromObject(model).getCenter(new Vector3())
    model.position.sub(scaledCenter)

    // La scène ne tourne pas en boucle : sans cette demande explicite, la
    // normalisation ci-dessus ne serait jamais rendue à l'écran.
    invalidate()
  }, [model, targetSize, invalidate])

  return (
    <group rotation={rotation as unknown as [number, number, number]}>
      <primitive object={model} />
    </group>
  )
}

// Le modèle est préchargé dès que ce module est évalué, c'est-à-dire au moment
// où la scène est chargée en différé — pas avant.
useGLTF.preload(MODEL_URL)
