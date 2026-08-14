import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import type { Object3D } from 'three'

const MODEL_URL = `${import.meta.env.BASE_URL}models/walkman.glb`

/**
 * Pièces du modèle réutilisables isolément.
 *
 * Le GLB livré porte chaque pièce sur son propre nœud — c'est ce qui permet de
 * les détacher sans ajouter un seul octet. On ne recharge rien : `useGLTF` sert
 * le même fichier que le walkman, déjà en cache.
 *
 * Seules les cassettes sont retenues. Le casque a été essayé puis écarté : il
 * est modélisé en deux nœuds (coque grise et mousse orange) et, détaché de son
 * arceau, il ne se lit plus comme un casque — juste une forme noire. Un objet
 * de fond doit être reconnaissable d'un coup d'œil, ou ne pas y être.
 */
const PIECES = {
  cassette: 'Box013_cassette01_0',
  cassetteInterne: 'Box010_cassette_0',
} as const

type PieceName = keyof typeof PIECES

/**
 * Un objet du sketchbook : une pièce du modèle, posée ailleurs dans la page.
 *
 * Le `z` de `position` porte l'éloignement : plus il est négatif, plus l'objet
 * est petit et fondu dans le fond. C'est lui qui l'empêche de concurrencer le
 * walkman du hero.
 */
interface ScatterItem {
  readonly id: string
  readonly piece: PieceName
  readonly position: readonly [number, number, number]
  readonly rotation: readonly [number, number, number]
  readonly scale: number
}

/*
 * ── Disposition du sketchbook ──────────────────────────────────────
 *
 * Coordonnées établies par mesure, pas au jugé — c'est le piège que ETAT.md
 * documente. À z=6 avec un fov de 38°, la demi-hauteur visible du cadre vaut
 * 2,07 unités ; la demi-largeur dépend du ratio du canvas et descend à 1,62
 * sur une fenêtre étroite. Un objet posé au-delà de x=±1,6 disparaît donc sur
 * les écrans hauts, alors qu'il reste visible sur un écran large.
 *
 * D'où la règle appliquée ici : les objets se tiennent entre x=-1,9 et x=+1,9.
 * Ils débordent légèrement sur les fenêtres étroites — c'est voulu, ils sont
 * censés être coupés — sans jamais sortir totalement du champ.
 *
 * ⚠️ La bande utile est COURTE. Le canvas s'arrête au bas de la scène (170vh,
 * une hauteur qu'on ne peut pas augmenter sans casser le cadrage du hero — voir
 * WalkmanScene.css) : passé y≈-3,2, un objet est dessiné hors canvas et reste
 * invisible. C'est pour ça que les quatre objets sont étagés sur x et z plutôt
 * que sur y.
 *
 * ⚠️ Le cadre visible DÉPEND DE `z`. À la distance d de la caméra (d = 6 - z),
 * la demi-hauteur visible vaut tan(fov/2) × d. Un objet à z=-4 dispose donc
 * d'un cadre bien plus large qu'un objet à z=0 : raisonner avec les bornes du
 * plan z=0 (±2,07 et ±1,62) conclut à tort que tout est hors champ.
 *
 * Les objets sont assumés GRANDS, comme le walkman du hero : ils passent
 * derrière le texte plutôt que de l'éviter. C'est le halo typographique
 * (`--halo-text`) qui garantit la lisibilité, exactement comme dans le hero —
 * pas l'effacement des objets.
 */
const SCATTER: readonly ScatterItem[] = [
  // Cassette debout, mordue par le bord gauche. Volontairement haute : plus bas,
  // elle tomberait en plein sur le premier paragraphe, et une cassette presque
  // noire sous un texte noir ne se rattrape pas au halo.
  {
    id: 'cassette-gauche',
    piece: 'cassette',
    position: [-2.1, -2.3, -2.5],
    rotation: [0.2, 0.6, 0.35],
    scale: 1.9,
  },
  // Cassette de trois quarts à droite, plus haute et plus loin. Décalée en
  // hauteur à dessein : à la même ordonnée que celle de gauche, les deux
  // formaient une haie symétrique de part et d'autre du texte.
  {
    id: 'cassette-droite',
    piece: 'cassette',
    position: [2.3, -1.7, -3],
    rotation: [0.45, -0.7, -0.2],
    scale: 1.8,
  },
  // Cassette à plat, mordue par le bord gauche, sous la première.
  {
    id: 'cassette-basse',
    piece: 'cassetteInterne',
    position: [-1.6, -2.95, -2.8],
    rotation: [1.1, 0.3, 0.15],
    scale: 1.4,
  },
  // La plus lointaine du lot, en bas à droite, à la limite de la scène.
  {
    id: 'cassette-fond',
    piece: 'cassette',
    position: [2.5, -3.2, -4],
    rotation: [-0.25, -0.5, 0.5],
    scale: 2,
  },
]

/**
 * Les objets qui accompagnent le scroll, façon planche de carnet.
 *
 * Entièrement statiques : aucune animation, aucun abonnement au scroll. La
 * scène reste peinte une seule fois et `frameloop="demand"` garde tout son
 * sens. Le mouvement du site est porté par la seule cassette du walkman.
 */
export function ScatteredObjects() {
  const { scene } = useGLTF(MODEL_URL)

  // Chaque pièce est clonée une fois par emplacement : le clone partage la
  // géométrie et les matériaux d'origine, il ne duplique aucun buffer.
  const items = useMemo(
    () =>
      SCATTER.map((item) => {
        const source = scene.getObjectByName(PIECES[item.piece])

        if (source === undefined) {
          return null
        }

        const clone = source.clone(true)

        // Le nœud d'origine porte la position qu'il occupe DANS le walkman.
        // On la remet à zéro : ici, seule la position de l'emplacement compte.
        clone.position.set(0, 0, 0)
        clone.rotation.set(0, 0, 0)

        return { item, object: clone as Object3D }
      }).filter((entry): entry is { item: ScatterItem; object: Object3D } => entry !== null),
    [scene],
  )

  return (
    <group>
      {items.map(({ item, object }) => (
        <group
          key={item.id}
          position={item.position as unknown as [number, number, number]}
          rotation={item.rotation as unknown as [number, number, number]}
          scale={item.scale}
        >
          <primitive object={object} />
        </group>
      ))}
    </group>
  )
}
