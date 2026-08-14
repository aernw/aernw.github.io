import { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { Box3, Vector3 } from 'three'
import type { Group } from 'three'

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
 * sa propre fiche par son propre câble, sans être branché sur l'appareil. Le
 * garder donnait un casque flottant sans lien avec la scène.
 */
const KEPT_GROUPS = new Set(['walkman', 'tape_1'])

/** Taille cible du walkman dans la scène, en unités. */
const TARGET_SIZE = 2.3

interface WalkmanModelProps {
  /**
   * Reçoit la position du point de branchement en coordonnées de scène, pour
   * que le câble en parte.
   */
  readonly socketAnchor: { current: Vector3 }
  /**
   * Point de branchement, en fractions de la taille du walkman depuis son
   * centre. Le modèle ne comporte pas de prise femelle : on la place nous-mêmes.
   */
  readonly socketOffset: { readonly x: number; readonly y: number; readonly z: number }
}

/**
 * Le walkman, chargé depuis un GLB compressé (Draco + textures WebP).
 *
 * Le modèle est immobile : sa rotation est fixée une fois pour toutes au
 * chargement. Seul le câble bouge — c'est lui qui donne la vie à la scène.
 */
export function WalkmanModel({ socketAnchor, socketOffset }: WalkmanModelProps) {
  const { scene } = useGLTF(MODEL_URL)
  const groupRef = useRef<Group>(null)

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
      model.scale.setScalar(TARGET_SIZE / maxAxis)
      model.updateWorldMatrix(true, true)
    }

    const scaledBox = new Box3().setFromObject(model)
    model.position.sub(scaledBox.getCenter(new Vector3()))
    model.updateWorldMatrix(true, true)

    // Le point de branchement est calculé une seule fois : le walkman ne
    // tournant plus, il ne bouge plus non plus.
    const finalSize = new Box3().setFromObject(model).getSize(new Vector3())
    const group = groupRef.current

    socketAnchor.current.set(
      finalSize.x * socketOffset.x,
      finalSize.y * socketOffset.y,
      finalSize.z * socketOffset.z,
    )

    if (group !== null) {
      group.updateWorldMatrix(true, false)
      group.localToWorld(socketAnchor.current)
    }
  }, [model, socketAnchor, socketOffset])

  // Orientation fixe, de trois quarts : le walkman est posé dans la scène, il
  // ne tourne pas. La rotation libre entrait en conflit avec l'ancrage du câble
  // et rendait la scène illisible.
  return (
    <group ref={groupRef} rotation={[0.12, -0.55, 0]}>
      <primitive object={model} />
    </group>
  )
}

// Le modèle est préchargé dès que ce module est évalué, c'est-à-dire au moment
// où la scène est chargée en différé — pas avant.
useGLTF.preload(MODEL_URL)
