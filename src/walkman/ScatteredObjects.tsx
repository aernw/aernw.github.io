import { useEffect, useMemo, useState } from 'react'
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
 * documente.
 *
 * ⚠️ Ces objets vivent dans `ScatterScene`, dont le canvas est FIXÉ au viewport
 * et donc large et bas (ratio ≈ 1,34), là où celui du hero est étroit et haut.
 * Les bornes latérales n'ont rien à voir : mesurées ici à ±3,68 (z=-2,5) et
 * jusqu'à ±5,52 (z=-6), contre ±1,62 dans la scène du hero. Reprendre les
 * bornes du hero agglutine tous les objets au centre de l'écran.
 *
 * ⚠️ Le cadre visible DÉPEND DE `z`. À la distance d de la caméra (d = 6 - z),
 * la demi-hauteur visible vaut tan(fov/2) × d. Un objet à z=-6 dispose donc
 * d'un cadre bien plus large qu'un objet à z=0 : raisonner avec les bornes du
 * plan z=0 (±2,07 et ±1,62) conclut à tort que tout est hors champ.
 *
 * Les objets passent derrière le texte plutôt que de l'éviter, comme le walkman
 * du hero — c'est le halo typographique (`--halo-text-dense`) qui garantit la
 * lisibilité. Ils restent volontairement plus petits que lui : c'est le hero
 * qui porte l'objet principal, le reste n'est qu'un accompagnement.
 */

/** Unités de scène parcourues par écran de défilement — voir `ScatterScene`. */
const UNITS_PER_VIEWPORT = 4.13

/**
 * Motif de dispersion, répété sur toute la hauteur de la page.
 *
 * Chaque entrée vaut pour un écran de défilement : `at` situe l'objet dans cet
 * écran (0 = haut, 1 = bas). Le motif fait sept écrans avant de se répéter, et
 * deux écrans sur sept sont laissés vides — sans ces respirations, le fond
 * devient un papier peint régulier au lieu d'une dispersion.
 */
const PATTERN: readonly {
  readonly screen: number
  readonly at: number
  readonly piece: PieceName
  readonly x: number
  readonly z: number
  readonly rotation: readonly [number, number, number]
  readonly scale: number
}[] = [
  { screen: 0, at: 0.6, piece: 'cassette', x: -3.1, z: -2.5, rotation: [0.2, 0.6, 0.35], scale: 1.5 },
  {
    screen: 1,
    at: 0.35,
    piece: 'cassette',
    x: 3.6,
    z: -3.5,
    rotation: [0.45, -0.7, -0.2],
    scale: 1.7,
  },
  {
    screen: 2,
    at: 0.7,
    piece: 'cassetteInterne',
    x: -3.4,
    z: -3,
    rotation: [1.1, 0.3, 0.15],
    scale: 1.3,
  },
  {
    screen: 3,
    at: 0.25,
    piece: 'cassette',
    x: 3.2,
    z: -2.5,
    rotation: [-0.3, -0.55, 0.25],
    scale: 1.4,
  },
  { screen: 4, at: 0.5, piece: 'cassette', x: -3.8, z: -4, rotation: [0.6, 0.35, -0.4], scale: 1.8 },
  {
    screen: 5,
    at: 0.8,
    piece: 'cassetteInterne',
    x: 3.4,
    z: -3.2,
    rotation: [-0.5, -0.25, 0.2],
    scale: 1.35,
  },
]

/** Longueur du motif, en écrans de défilement. */
const PATTERN_SCREENS = 6

/**
 * Déroule le motif sur toute la hauteur de la page.
 *
 * Le nombre d'écrans est mesuré au montage plutôt que codé en dur : il dépend
 * de la face affichée, de la hauteur de la fenêtre et de la longueur réelle du
 * contenu, qui varie avec les données de `src/content`.
 */
function buildScatter(screens: number): readonly ScatterItem[] {
  const items: ScatterItem[] = []

  for (let cycle = 0; cycle * PATTERN_SCREENS < screens; cycle += 1) {
    for (const spot of PATTERN) {
      const screen = cycle * PATTERN_SCREENS + spot.screen

      if (screen >= screens) {
        continue
      }

      items.push({
        id: `${spot.piece}-${screen}`,
        piece: spot.piece,
        position: [spot.x, -(screen + spot.at) * UNITS_PER_VIEWPORT, spot.z],
        rotation: spot.rotation,
        scale: spot.scale,
      })
    }
  }

  return items
}

/** Combien d'écrans de défilement la page occupe, au minimum deux. */
function countScreens(): number {
  const height = document.documentElement.scrollHeight
  const viewport = window.innerHeight

  if (viewport === 0) {
    return 2
  }

  return Math.max(2, Math.ceil(height / viewport))
}

/**
 * Les objets qui accompagnent le scroll, façon planche de carnet.
 *
 * Les objets eux-mêmes ne bougent pas : c'est la caméra de `ScatterScene` qui
 * défile. Rien n'est animé ici, et la scène n'est repeinte que lorsque cette
 * position change.
 */
export function ScatteredObjects() {
  const { scene } = useGLTF(MODEL_URL)
  const [screens, setScreens] = useState(countScreens)

  // La hauteur de page n'est pas connue au premier rendu — les sections
  // apparaissent au scroll et les images se chargent après. On la remesure
  // donc après montage, puis à chaque redimensionnement.
  useEffect(() => {
    const measure = () => setScreens(countScreens())

    measure()

    const timer = window.setTimeout(measure, 600)
    window.addEventListener('resize', measure)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const scatter = useMemo(() => buildScatter(screens), [screens])

  // Chaque pièce est clonée une fois par emplacement : le clone partage la
  // géométrie et les matériaux d'origine, il ne duplique aucun buffer.
  const items = useMemo(
    () =>
      scatter.map((item) => {
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
    [scene, scatter],
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
