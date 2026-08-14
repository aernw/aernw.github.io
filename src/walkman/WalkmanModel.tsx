import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Box3, Vector3 } from 'three'
import type { Group, Object3D } from 'three'

const MODEL_URL = `${import.meta.env.BASE_URL}models/walkman.glb`

/**
 * Pièces du câble d'origine, masquées au chargement.
 * Le fil du site est simulé et doit partir de la prise jack : garder le câble
 * modélisé donnerait deux fils partant du même endroit.
 */
const HIDDEN_PARTS = ['wire_1', 'wire_2']

/**
 * Groupes conservés de la scène d'origine.
 *
 * Le GLB est une mise en scène complète : dix cassettes éparpillées jusqu'à
 * sept unités du centre, ce qui rendait la boîte englobante — et donc l'échelle
 * — inexploitable. On ne garde que l'appareil, la cassette qu'il contient et
 * le casque.
 */
const KEPT_GROUPS = new Set(['walkman', 'tape_1', 'head_phone'])

/** Nom du nœud de la prise jack dans le modèle. */
const JACK_NODE = 'jack'

interface WalkmanModelProps {
  /**
   * Reçoit la position de la prise jack en coordonnées de scène, pour que le
   * câble s'y accroche. On reste en 3D : projeter en pixels puis revenir en
   * unités de scène ferait perdre la profondeur.
   */
  readonly jackAnchor: { current: Vector3 }
  readonly dragRotation: { current: { x: number; y: number } }
  readonly autoRotate: boolean
}

/**
 * Le walkman, chargé depuis un GLB compressé (Draco + textures WebP).
 *
 * Le modèle est recentré et mis à l'échelle au chargement : un GLB issu de
 * Sketchfab arrive rarement à l'origine et rarement à une taille exploitable.
 */
export function WalkmanModel({ jackAnchor, dragRotation, autoRotate }: WalkmanModelProps) {
  const { scene } = useGLTF(MODEL_URL)
  const groupRef = useRef<Group>(null)
  const jackRef = useRef<Object3D | null>(null)

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

    // Masquer le câble d'origine et retrouver la prise jack.
    model.traverse((child) => {
      const name = child.name.toLowerCase()

      if (HIDDEN_PARTS.some((part) => name.startsWith(part))) {
        child.visible = false
      }

      if (jackRef.current === null && name === JACK_NODE) {
        jackRef.current = child
      }
    })

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

    // Publication immédiate : requestAnimationFrame — et donc useFrame — est
    // suspendu tant que l'onglet est en arrière-plan, et le fil resterait
    // détaché jusqu'au retour de l'utilisateur.
    model.updateWorldMatrix(true, true)
    publishJackPosition()

    // Diagnostic temporaire — à retirer une fois le cadrage validé.
    const check = new Box3().setFromObject(model)
    const fmt = (v: Vector3) => v.toArray().map((n) => +n.toFixed(2)).join(', ')
    console.warn(
      `[walkman] centre=(${fmt(check.getCenter(new Vector3()))}) ` +
        `taille=(${fmt(check.getSize(new Vector3()))}) ` +
        `jack=(${fmt(jackAnchor.current)})`,
    )

  }, [model])

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
   * Publie la position de la prise jack en coordonnées de scène.
   *
   * Le walkman tourne : la prise décrit un arc, et le câble doit rester
   * accroché dessus. On reste en 3D — le câble vit dans la même scène, aucune
   * conversion en pixels n'est nécessaire.
   */
  function publishJackPosition(): void {
    const jack = jackRef.current
    if (jack === null) return

    jack.getWorldPosition(jackAnchor.current)
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
