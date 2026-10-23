/**
 * Contenu du côté Perso (artistique).
 *
 * ⚠️ Ce fichier contient des emplacements à remplir par Erwan. Rien n'y est inventé :
 * les champs vides sont vides, et les sections concernées ne s'affichent pas tant
 * qu'ils le sont. Voir les TODO ci-dessous.
 */

/**
 * Le texte qui relie les deux côtés. C'est la section la plus personnelle du site
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

/** Colophon : ce qui a servi à faire ce site. */
export const colophon: readonly {
  readonly label: string
  readonly value: string
  readonly href?: string
}[] = [
  { label: 'Construit avec', value: 'React, TypeScript, Vite' },
  { label: 'Hébergé sur', value: 'GitHub Pages' },
  { label: 'Dessiné sur', value: 'Figma, dans le style Liquid Glass d’Apple' },
]
