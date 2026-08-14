import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import type { Object3D } from 'three'

const MODEL_URL = `${import.meta.env.BASE_URL}models/walkman.glb`

/**
 * Objets isolés du modèle, réutilisables seuls.
 *
 * Le GLB livré contient déjà deux cassettes et un casque, chacun sur son propre
 * nœud — c'est ce qui permet de les détacher sans ajouter un seul octet. On ne
 * recharge rien : `useGLTF` sert le même fichier que le walkman, déjà en cache.
 */
/*
 * Seules les cassettes sont réutilisées. Le casque a été essayé puis écarté :
 * il est modélisé en deux nœuds (coque grise et mousse orange) et, détaché de
 * l'arceau, il ne se lit plus comme un casque — juste une forme noire.
 * Un objet du fond doit être reconnaissable d'un coup d'œil ou ne pas y être.
 */
const PIECES = {
  cassette: 'Box013_cassette01_0',
  cassetteInterne: 'Box010_cassette_0',
} as const

type PieceName = keyof typeof PIECES

/**
 * Un objet du sketchbook : une pièce du modèle, posée ailleurs dans la page.
 *
 * `depth` est exprimé en unités de scène négatives — plus l'objet est loin,
 * plus il est petit et plus il se fond dans le fond. C'est ce qui l'empêche de
 * concurrencer le walkman du hero.
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
 * En hauteur, le walkman occupe le hero (y≈0) : les objets commencent sous lui
 * et descendent jusqu'à y=-5, la scène faisant 170vh.
 *
 * Règle tenue : un objet qu'on devine vaut mieux qu'un objet qu'on détaille.
 * Le `z` négatif les éloigne, donc les rapetisse et les fond dans le fond.
 */
const SCATTER: readonly ScatterItem[] = [
  // Cassette debout, mordue par le bord gauche.
  {
    id: 'cassette-gauche',
    piece: 'cassette',
    position: [-1.9, -2.8, -5],
    rotation: [0.2, 0.6, 0.35],
    scale: 0.75,
  },
  // Cassette de trois quarts à droite, plus loin.
  {
    id: 'cassette-droite',
    piece: 'cassette',
    position: [2, -4.2, -6.5],
    rotation: [0.45, -0.7, -0.2],
    scale: 0.7,
  },
  // Cassette à plat, presque hors champ à gauche.
  {
    id: 'cassette-basse',
    piece: 'cassetteInterne',
    position: [-1.7, -5.8, -6],
    rotation: [1.1, 0.3, 0.15],
    scale: 0.6,
  },
  // La plus lointaine et la plus discrète du lot.
  {
    id: 'cassette-fond',
    piece: 'cassette',
    position: [1.6, -7.2, -8],
    rotation: [-0.25, -0.5, 0.5],
    scale: 0.75,
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
