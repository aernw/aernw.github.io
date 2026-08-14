import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Box3, Vector3 } from 'three'
import type { Group, Object3D } from 'three'

const MODEL_URL = `${import.meta.env.BASE_URL}models/walkman.glb`

/**
 * Câble d'origine du modèle, masqué : il est remplacé par le câble simulé.
 * Le casque et sa fiche, eux, sont conservés et déplacés au bout du câble.
 */
const HIDDEN_PARTS = ['wire_1', 'wire_2']

/**
 * Groupes conservés de la scène d'origine.
 *
 * Le GLB est une mise en scène complète : dix cassettes éparpillées jusqu'à
 * sept unités du centre, ce qui rendait la boîte englobante — et donc l'échelle
 * — inexploitable. On ne garde que l'appareil et la cassette qu'il contient ;
 * le casque est extrait à part, pour être porté par le câble.
 */
const KEPT_GROUPS = new Set(['walkman', 'tape_1', 'head_phone'])

/**
 * Point de branchement du câble sur le boîtier, en fractions de la boîte
 * englobante du walkman (x, y, z depuis son centre).
 *
 * Le modèle ne comporte aucune prise femelle : `jack` désigne la fiche mâle au
 * bout du casque, pas une prise sur l'appareil. On définit donc nous-mêmes
 * l'endroit d'où sort le câble — en bas à droite du boîtier.
 */
const SOCKET_OFFSET = { x: 0.34, y: -0.42, z: 0.1 }

interface WalkmanModelProps {
  /**
   * Reçoit la position du point de branchement en coordonnées de scène, pour
   * que le câble en parte. On reste en 3D : projeter en pixels puis revenir en
   * unités de scène ferait perdre la profondeur.
   */
  readonly jackAnchor: { current: Vector3 }
  /**
   * Reçoit l'ensemble casque une fois extrait du modèle, pour que le câble le
   * porte à son extrémité.
   */
  readonly onHeadphoneReady?: (headphone: Object3D) => void
  readonly dragRotation: { current: { x: number; y: number } }
  readonly autoRotate: boolean
}

/**
 * Le walkman, chargé depuis un GLB compressé (Draco + textures WebP).
 *
 * Le modèle est recentré et mis à l'échelle au chargement : un GLB issu de
 * Sketchfab arrive rarement à l'origine et rarement à une taille exploitable.
 */
export function WalkmanModel({
  jackAnchor,
  onHeadphoneReady,
  dragRotation,
  autoRotate,
}: WalkmanModelProps) {
  const { scene } = useGLTF(MODEL_URL)
  const groupRef = useRef<Group>(null)
  const socketOffset = useRef(new Vector3())

  // Le GLB est partagé par useGLTF : on le clone pour pouvoir le modifier
  // sans affecter d'autres usages éventuels.
  const model = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    // Retirer les cassettes décoratives de la mise en scène d'origine.
    const rootNode = model.getObjectByName('RootNode')
    if (rootNode !== undefined) {
      for (const child of [...rootNode.children]) {
        if (!KEPT_GROUPS.has(child.name)) rootNode.remove(child)
      }
    }

    /*
     * Le casque est extrait du modèle.
     *
     * Dans ce GLB, `jack`, `wire_1`, `wire_2` et les écouteurs sont tous
     * enfants de `head_phone` : c'est un ensemble casque-câble-fiche complet,
     * posé à côté du walkman et non branché dessus. Le laisser en place collait
     * le casque à l'appareil et faisait flotter la fiche.
     *
     * On le sort donc du groupe pour que le câble simulé le porte à son
     * extrémité, et on masque son câble d'origine, remplacé par la simulation.
     */
    const headphone = model.getObjectByName('head_phone')
    if (headphone !== undefined) {
      headphone.traverse((child) => {
        if (HIDDEN_PARTS.some((part) => child.name.toLowerCase().startsWith(part))) {
          child.visible = false
        }
      })

      // Retiré avant la mesure : sa position d'origine, à sept unités du
      // walkman, fausserait la boîte englobante et donc l'échelle.
      headphone.removeFromParent()
    }

    // Repartir d'une transformation neutre : l'effet peut se rejouer, et
    // cumuler deux normalisations éloignerait le modèle un peu plus à chaque fois.
    model.position.set(0, 0, 0)
    model.scale.setScalar(1)
    model.rotation.set(0, 0, 0)
    model.updateWorldMatrix(true, true)

    const box = new Box3().setFromObject(model)
    const center = box.getCenter(new Vector3())
    const sizeVec = box.getSize(new Vector3())
    const maxAxis = Math.max(sizeVec.x, sizeVec.y, sizeVec.z)

    /*
     * Mise à l'échelle puis recentrage, en deux temps mesurés.
     *
     * `Box3.setFromObject` renvoie un centre en coordonnées MONDE. On ne peut
     * donc pas le soustraire à une position locale : les nœuds internes de ce
     * GLB portent leurs propres transformations (dont une échelle de 0,01), et
     * le décalage serait appliqué dans le mauvais repère — le walkman se
     * retrouvait à (-31, -10, -24), hors du champ de la caméra.
     *
     * On applique donc l'échelle d'abord, puis on remesure : le nouveau centre
     * monde est alors directement soustractible à la position du modèle, qui
     * est ici l'enfant direct du groupe de scène.
     */
    if (maxAxis > 0) {
      model.scale.setScalar(3.2 / maxAxis)
      model.updateWorldMatrix(true, true)

      const scaledCenter = new Box3().setFromObject(model).getCenter(new Vector3())
      model.position.sub(scaledCenter)
    } else {
      model.position.sub(center)
    }

    model.updateWorldMatrix(true, true)

    // Point de branchement, exprimé dans le repère du groupe qui tourne : il
    // suit donc la rotation du walkman, comme le ferait une vraie prise.
    const finalBox = new Box3().setFromObject(model)
    const finalSize = finalBox.getSize(new Vector3())
    socketOffset.current.set(
      finalSize.x * SOCKET_OFFSET.x,
      finalSize.y * SOCKET_OFFSET.y,
      finalSize.z * SOCKET_OFFSET.z,
    )

    // Le casque est mis à la même échelle que le walkman, puis confié au câble.
    if (headphone !== undefined && onHeadphoneReady !== undefined) {
      headphone.scale.copy(model.scale)
      onHeadphoneReady(headphone)
    }

    // Publication immédiate : requestAnimationFrame — et donc useFrame — est
    // suspendu tant que l'onglet est en arrière-plan, et le câble resterait
    // détaché jusqu'au retour de l'utilisateur.
    publishJackPosition()

    // Diagnostic temporaire — à retirer une fois le branchement validé.
    const fmt = (v: Vector3) => v.toArray().map((n) => +n.toFixed(2)).join(', ')
    console.warn(
      `[walkman] taille=(${fmt(finalSize)}) ` +
        `prise=(${fmt(jackAnchor.current)}) ` +
        `casque=${headphone === undefined ? 'INTROUVABLE' : 'extrait'}`,
    )
  }, [model, onHeadphoneReady])

  useFrame((_, delta) => {
    const group = groupRef.current
    if (group === null) return

    // Rotation libre pilotée par le glisser, avec une dérive lente au repos.
    if (autoRotate) {
      dragRotation.current.y += delta * 0.18
    }

    group.rotation.x = dragRotation.current.x
    group.rotation.y = dragRotation.current.y

    publishJackPosition()
  })

  /**
   * Publie la position du point de branchement en coordonnées de scène.
   *
   * L'offset est exprimé dans le repère du groupe qui tourne, puis converti en
   * coordonnées monde : le point suit donc la rotation du walkman, comme le
   * ferait une vraie prise sur le boîtier.
   */
  function publishJackPosition(): void {
    const group = groupRef.current
    if (group === null) return

    jackAnchor.current.copy(socketOffset.current)
    group.localToWorld(jackAnchor.current)
  }

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  )
}

// Le modèle est préchargé dès que ce module est évalué, c'est-à-dire au moment
// où la scène est chargée en différé — pas avant.
useGLTF.preload(MODEL_URL)
