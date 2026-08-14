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
  {
    id: 'les-mots-et-la-machine',
    title: 'Les mots et la machine',
    author: 'M. L. M.',
    kind: 'livre',
    note: 'Un livre qui met les mots juste là où ils doivent être, sans jamais faire de bruit de fond.',
    year: '2024',
  },
  {
    id: 'la-vie-venue',
    title: 'La vie venue',
    author: 'S. Hart',
    kind: 'film',
    note: 'Un film de détails et de silences, qui cherche à rendre visible le temps qui passe.',
    year: '2023',
  },
  {
    id: 'the-quiet-hour',
    title: 'The Quiet Hour',
    author: 'A. N. B.',
    kind: 'série',
    note: 'Une série lente qui prend son temps pour créer le monde, et ça change tout.',
    year: '2025',
  },
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
  {
    id: 'lesson-1',
    statement: 'La bonne idée ne vient pas quand on la cherche : elle vient quand on a cessé d’en faire un problème.',
    context: 'Après des semaines à forcer un prototype qui n’avait pas de vraie forme, j’ai laissé tomber le plan carré et j’ai suivi la logique du projet.',
  },
  {
    id: 'lesson-2',
    statement: 'La clarté des interfaces vient souvent de la suppression, pas de l’ajout.',
    context: 'Sur un site d’archive, j’ai appris que l’interface la plus forte était celle qui retirait le bruit au lieu de l’expliquer.',
  },
  {
    id: 'lesson-3',
    statement: 'Une bonne composition ne sert pas à remplir l’espace : elle sert à lui donner une direction.',
    context: 'En musique comme en code, la vraie difficulté est souvent de décider quoi laisser de côté.',
  },
]
