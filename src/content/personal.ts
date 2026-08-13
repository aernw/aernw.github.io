/**
 * Contenu personnel non-musical de la face B.
 *
 * Ces sections font déborder la face B de son thème : sans elles, l'artistique
 * se réduit à de la musique. Voir le guide dans le README pour les éditer.
 */

export type MediaKind = 'livre' | 'film' | 'série' | 'autre'

export interface MediaItem {
  readonly id: string
  readonly title: string
  readonly author: string
  readonly kind: MediaKind
  /** Une ou deux phrases. Ce qui vaut d'être lu, c'est l'avis, pas le titre. */
  readonly note?: string
  readonly year?: string
}

/**
 * Ce que tu lis et regardes.
 *
 * TODO Erwan : remplis cette liste. Format en commentaire ci-dessous.
 */
export const media: readonly MediaItem[] = [
  // {
  //   id: 'un-identifiant-unique',
  //   title: 'Titre',
  //   author: "Auteur ou réalisateur",
  //   kind: 'livre',
  //   note: "Ce que tu en as pensé, en une ou deux phrases.",
  //   year: '2024',
  // },
]

export interface Lesson {
  readonly id: string
  /** Court et net. Une phrase qui tient debout seule. */
  readonly statement: string
  /** D'où ça vient : un projet, une erreur, un moment précis. */
  readonly context?: string
}

/**
 * Ce que tu as appris.
 *
 * Le piège de cette section est la platitude : « il faut tester son code » ne
 * dit rien de toi. Ce qui marche, c'est ce qui t'a coûté quelque chose et qui
 * s'appuie sur un moment précis.
 *
 * TODO Erwan : écris les tiennes.
 */
export const lessons: readonly Lesson[] = [
  // {
  //   id: 'un-identifiant-unique',
  //   statement: "Une phrase courte et assumée.",
  //   context: "D'où elle vient : quel projet, quelle erreur.",
  // },
]
