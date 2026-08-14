import { useEffect, useMemo, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import type { Object3D } from 'three'

const base = import.meta.env.BASE_URL

/**
 * Les modèles dont proviennent les objets de fond.
 *
 * Chacun est préparé hors ligne par la même chaîne que le walkman
 * (`dedup → flatten → join → center → resize → webp → draco`), qui les fait
 * tomber sous 120 Ko chacun — l'essentiel de leur poids d'origine étant des
 * textures, pas de la géométrie (7,4 Mo → 117 Ko pour les enceintes).
 */
const MODELS = {
  walkman: `${base}models/walkman.glb`,
  speakers: `${base}models/speakers.glb`,
  focusrite: `${base}models/focusrite.glb`,
  airpods: `${base}models/airpods.glb`,
  earphones: `${base}models/earphones.glb`,
} as const

/**
 * Les pièces réutilisées, chacune désignée par son modèle et son nœud.
 *
 * Les cassettes viennent du walkman, dont chaque pièce porte son propre nœud :
 * elles ne coûtent donc rien de plus, le fichier étant déjà chargé pour le hero.
 *
 * ⚠️ Le casque du walkman a été essayé puis écarté : modélisé en deux nœuds et
 * détaché de son arceau, il ne se lit plus comme un casque — juste une forme
 * noire. Un objet de fond doit être reconnaissable d'un coup d'œil, ou ne pas y
 * être. C'est aussi pour ça que les enceintes sont prises entières plutôt que
 * découpées.
 */
const PIECES = {
  cassette: { model: 'walkman', node: 'Box013_cassette01_0' },
  // `node: null` prend le modèle entier. Les enceintes sont découpées par
  // matériau, pas par objet : `polySurface11_lambert2_0` ne porte que les cônes
  // et `lambert3` que les caissons. Pris séparément, aucun des deux ne se lit
  // comme une enceinte — même piège que le casque du walkman.
  enceintes: { model: 'speakers', node: null },
  carteSon: { model: 'focusrite', node: 'Scarlett_Scarlett_MTL_0' },
  airpods: { model: 'airpods', node: null },
  ecouteurs: { model: 'earphones', node: null },
} as const satisfies Record<string, { model: keyof typeof MODELS; node: string | null }>

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
 * écran (0 = haut, 1 = bas). Le motif fait dix écrans avant de se répéter, avec
 * **un seul objet par modèle** et un écran vide entre chacun — sans ces
 * respirations, le fond devient un papier peint régulier au lieu d'une
 * dispersion.
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
  // Un seul objet par modèle, et un écran vide entre chacun : la place ainsi
  // libérée est rendue en taille. Chaque objet est plus grand et plus proche
  // qu'avant, donc réellement identifiable, sans que le fond se charge.
  //
  // L'envergure des modèles n'est pas la même — les enceintes mesurent ~3,9
  // unités, la carte son 14,3 — d'où des échelles très différentes pour une
  // taille comparable à l'écran.
  // ⚠️ Les enceintes commencent à l'écran 1, pas 0 : à l'écran 0 elles se
  // posent derrière le hero et concurrencent le walkman.
  //
  // Le +π sur Y les retourne face à la caméra. Le modèle est orienté vers -Z
  // (les cônes s'étendent de z=-2,2 à z=+0,84, donc leur masse est derrière) :
  // sans cette demi-rotation, on ne voit que le dos des caissons.
  {
    screen: 1,
    at: 0.85,
    piece: 'enceintes',
    x: -3.9,
    z: -4,
    rotation: [0.1, 0.90 + Math.PI, 0.1],
    scale: 0.95,
  },
  {
    screen: 3,
    at: 0.35,
    piece: 'carteSon',
    x: 3.4,
    z: -2.5,
    rotation: [0.5, -0.6, -0.25],
    scale: 0.5,
  },
  {
    screen: 4,
    at: 0.7,
    piece: 'cassette',
    x: -3.3,
    z: -2.8,
    rotation: [0.3, 0.3, 0.15],
    scale: 1.8,
  },
  {
    screen: 6,
    at: 0.45,
    piece: 'airpods',
    x: 3.4,
    z: -3.2,
    rotation: [0.3, -0.7, -0.2],
    scale: 3.6,
  },
  {
    screen: 8,
    at: 0.65,
    piece: 'ecouteurs',
    x: -3.4,
    z: -3,
    rotation: [0.2, 0.5, 0.4],
    scale: 2.3,
  },
]

/**
 * Longueur du motif, en écrans de défilement.
 *
 * Le dernier objet est à l'écran 8 et le premier à l'écran 1 : un cycle de 11
 * laisse donc deux écrans vides à la jointure, comme entre chaque objet.
 */
const PATTERN_SCREENS = 11
const LAST_PATTERN_SCREEN = Math.max(...PATTERN.map((spot) => spot.screen))

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
    return Math.max(2, LAST_PATTERN_SCREEN + 1)
  }

  return Math.max(2, Math.ceil(height / viewport), LAST_PATTERN_SCREEN + 1)
}

/**
 * Les objets qui accompagnent le scroll, façon planche de carnet.
 *
 * Les objets eux-mêmes ne bougent pas : c'est la caméra de `ScatterScene` qui
 * défile. Rien n'est animé ici, et la scène n'est repeinte que lorsque cette
 * position change.
 */
export function ScatteredObjects() {
  // Un appel par modèle : `useGLTF` est un hook, il ne peut pas être appelé
  // dans une boucle dont la longueur varierait.
  const walkman = useGLTF(MODELS.walkman)
  const speakers = useGLTF(MODELS.speakers)
  const focusrite = useGLTF(MODELS.focusrite)
  const airpods = useGLTF(MODELS.airpods)
  const earphones = useGLTF(MODELS.earphones)

  const scenes = useMemo(
    () => ({
      walkman: walkman.scene,
      speakers: speakers.scene,
      focusrite: focusrite.scene,
      airpods: airpods.scene,
      earphones: earphones.scene,
    }),
    [
      walkman.scene,
      speakers.scene,
      focusrite.scene,
      airpods.scene,
      earphones.scene,
    ],
  )

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
        const piece = PIECES[item.piece]
        const root = scenes[piece.model]
        const source = piece.node === null ? root : root.getObjectByName(piece.node)

        if (source === undefined) {
          return null
        }

        const clone = source.clone(true)

        // Une pièce détachée porte la position qu'elle occupait DANS son modèle
        // (la cassette est posée à côté du walkman, par exemple) : on la remet à
        // zéro, seule la position de l'emplacement comptant ici.
        //
        // Un modèle pris en entier, lui, est déjà centré à l'origine par la
        // préparation hors ligne — et remettre sa racine à zéro déplacerait
        // l'ensemble par rapport à ses propres enfants.
        if (piece.node !== null) {
          clone.position.set(0, 0, 0)
          clone.rotation.set(0, 0, 0)
        }

        return { item, object: clone as Object3D }
      }).filter((entry): entry is { item: ScatterItem; object: Object3D } => entry !== null),
    [scenes, scatter],
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

// Préchargés dès l'évaluation du module, c'est-à-dire au chargement différé de
// la scène — jamais avant. Le walkman n'est pas répété : il est déjà préchargé
// par `WalkmanModel`, et `useGLTF` sert le même cache.
useGLTF.preload(MODELS.speakers)
useGLTF.preload(MODELS.focusrite)
useGLTF.preload(MODELS.airpods)
useGLTF.preload(MODELS.earphones)
