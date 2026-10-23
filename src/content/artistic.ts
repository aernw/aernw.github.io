/**
 * Contenu de la face B (artistique).
 *
 * ⚠️ Ce fichier contient des emplacements à remplir par Erwan. Rien n'y est inventé :
 * les champs vides sont vides, et les sections concernées ne s'affichent pas tant
 * qu'ils le sont. Voir les TODO ci-dessous.
 */

/**
 * Le texte qui relie les deux faces. C'est la section la plus personnelle du site
 * et celle que les gens retiennent.
 *
 * TODO Erwan : réécris ce texte avec tes mots. Le brouillon ci-dessous n'est là que
 * pour tenir la mise en page — il dit une banalité, pas ce que tu penses vraiment.
 */
export const aboutDraft = {
  isDraft: true,
  body: [
    'Je fais de la musique et j’écris du code, et j’ai toujours eu du mal à séparer les deux.',
    'Les deux demandent la même chose : une forme claire, une contrainte acceptée, et le bon moment pour laisser le travail respirer.',
  ],
} as const

/**
 * Section « now » : ce sur quoi tu travailles en ce moment.
 * Elle donne une raison de revenir sur le site — à condition de la tenir à jour.
 *
 * TODO Erwan : remplis-la, ou on retire la section.
 */
export const now = {
  updated: 'août 2026',
  items: [
    'Nouveau morceau inspiré par les ambiances de nuit et les synthés analogiques.',
    'Travail sur un petit outil de génération visuelle pour mes sessions de création.',
    'Mise en place d’une archive de morceaux enregistrés en studio et en live.',
  ] as readonly string[],
}

export interface Track {
  readonly id: string
  readonly title: string
  /** Durée imprimée au dos du boîtier, au format « 3:12 ». Le lecteur lit la vraie durée du fichier. */
  readonly duration: string
  /** Fichier audio, rangé dans `public/audio/`. MP3 de préférence : c'est le seul format lu partout. */
  readonly src: string
  /** Une ligne sur le morceau, dans le même esprit que les notes d'albums. */
  readonly note?: string
}

export interface Disc {
  readonly title: string
  readonly year: string
  /** Visuel imprimé sur la face du disque. Sans visuel, le disque porte une sérigraphie sobre. */
  readonly cover?: string
  /** L'ordre du tableau est l'ordre de lecture. */
  readonly tracks: readonly Track[]
}

/**
 * Le disque du lecteur CD de la face B : tes propres morceaux.
 *
 * Les fichiers ne sont téléchargés qu'au moment où l'on appuie sur lecture —
 * le poids de la page ne change pas, quelle que soit la longueur du disque.
 * Une liste vide retire la section.
 *
 * TODO Erwan : les trois pistes ci-dessous sont des maquettes générées pour
 * tester le lecteur, pas de la vraie musique. Remplace les fichiers de
 * `public/audio/` par tes morceaux, puis les titres, durées et notes.
 */
export const disc: Disc = {
  title: 'Maquettes',
  year: '2026',
  tracks: [
    {
      id: 'demo-1',
      title: 'Démo 1',
      duration: '0:27',
      src: 'audio/demo-1.mp3',
      note: 'Morceau de remplacement, généré pour tester le lecteur.',
    },
    { id: 'demo-2', title: 'Démo 2', duration: '0:24', src: 'audio/demo-2.mp3' },
    { id: 'demo-3', title: 'Démo 3', duration: '0:17', src: 'audio/demo-3.mp3' },
  ],
}

/**
 * Colophon : ce qui a servi à faire ce site.
 *
 * Le crédit du modèle 3D n'est pas décoratif : le walkman est sous licence
 * CC Attribution, qui impose de nommer son auteur.
 */
export const colophon: readonly {
  readonly label: string
  readonly value: string
  readonly href?: string
}[] = [
  { label: 'Construit avec', value: 'React, TypeScript, Vite, Three.js' },
  { label: 'Hébergé sur', value: 'GitHub Pages' },
  {
    label: 'Modèle 3D',
    value: 'Low poly Sony Walkman WM-22 par ima_ethan (CC Attribution)',
    href: 'https://sketchfab.com/3d-models/low-poly-sony-walkman-wm-22-6462c2c1ed444922b6d45c4f13695ffd',
  },
  {
    label: 'Modèle 3D',
    value: 'Speakers low poly par Condo (CC BY 4.0)',
    href: 'https://sketchfab.com/3d-models/speakers-low-poly-b2e3d6ecef4e40d994066416c395bf0a',
  },
  {
    label: 'Modèle 3D',
    value: 'Focusrite Scarlett Solo 4th Gen par Ivan_WSK (CC BY 4.0)',
    href: 'https://sketchfab.com/3d-models/focusrite-scarlett-solo-4th-gen-9cdbec90442a4fd1a6aa7fd4b1be136a',
  },
  {
    label: 'Modèle 3D',
    value: 'AirPods Max par Mr.Philin (CC BY 4.0)',
    href: 'https://sketchfab.com/3d-models/airpods-max-05181e126a6341668ca95f2d98324d30',
  },
  {
    label: 'Modèle 3D',
    value: 'Écouteurs filaires par Ethereal Grace (CC BY 4.0)',
    href: 'https://sketchfab.com/EtherealGrace',
  },
]
