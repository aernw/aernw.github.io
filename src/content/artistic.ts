import type { Link } from './types'

/**
 * Contenu de la face B (artistique).
 *
 * ⚠️ Ce fichier contient des emplacements à remplir par Erwan. Rien n'y est inventé :
 * les champs vides sont vides, et les sections concernées ne s'affichent pas tant
 * qu'ils le sont. Voir les TODO ci-dessous.
 */

/** TODO Erwan : ajouter tes plateformes (SoundCloud, Bandcamp, Spotify…). */
export const musicLinks: readonly Link[] = []

export interface Release {
  readonly id: string
  readonly title: string
  readonly kind: string
  readonly year: string
  readonly note?: string
  readonly links: readonly Link[]
}

/** TODO Erwan : ajouter tes morceaux, EP ou projets musicaux. */
export const releases: readonly Release[] = []

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
    "Je fais de la musique et j'écris du code, et je n'ai jamais vraiment su séparer les deux.",
    "Les deux demandent la même chose : poser une structure, tenir une contrainte, " +
      "et savoir quand s'arrêter.",
  ],
} as const

/**
 * Section « now » : ce sur quoi tu travailles en ce moment.
 * Elle donne une raison de revenir sur le site — à condition de la tenir à jour.
 *
 * TODO Erwan : remplis-la, ou on retire la section.
 */
export const now = {
  updated: '',
  items: [] as readonly string[],
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
    value: 'Sony walkman tps-l2 par enKi (CC Attribution)',
    href: 'https://sketchfab.com/3d-models/sony-walkman-tps-l2-3d072a29fd6342cd8af9ebb6664100e2',
  },
]
