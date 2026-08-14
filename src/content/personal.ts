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
 * Les titres sont gardés en anglais : ce sont les éditions lues.
 * `year` est l'année de l'édition possédée, pas celle de la parution originale.
 * `note` est volontairement vide — à remplir à la main, livre par livre.
 */
export const media: readonly MediaItem[] = [
  {
    id: 'blood-meridian',
    title: 'Blood Meridian',
    author: 'Cormac McCarthy',
    kind: 'livre',
    year: '2015',
  },
  {
    id: 'project-hail-mary',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    kind: 'livre',
    year: '2022',
  },
  {
    id: 'the-three-body-problem',
    title: 'The Three-Body Problem',
    author: 'Cixin Liu',
    kind: 'livre',
    year: '2014',
  },
  {
    id: 'i-have-no-mouth-and-i-must-scream',
    title: 'I Have No Mouth and I Must Scream',
    author: 'Harlan Ellison',
    kind: 'livre',
    year: '2014',
  },
  {
    id: 'sapiens',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    kind: 'livre',
    year: '2025',
  },
  {
    id: 'the-selfish-gene',
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    kind: 'livre',
    year: '2010',
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    kind: 'livre',
    year: '2018',
  },
  {
    id: 'deep-work',
    title: 'Deep Work',
    author: 'Cal Newport',
    kind: 'livre',
    year: '2016',
  },
  {
    id: 'so-good-they-cant-ignore-you',
    title: "So Good They Can't Ignore You",
    author: 'Cal Newport',
    kind: 'livre',
    year: '2012',
  },
  {
    id: 'indistractable',
    title: 'Indistractable',
    author: 'Nir Eyal',
    kind: 'livre',
    year: '2019',
  },
  {
    id: 'clean-code',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    kind: 'livre',
    year: '2008',
  },
  {
    id: 'i-will-teach-you-to-be-rich',
    title: 'I Will Teach You to Be Rich',
    author: 'Ramit Sethi',
    kind: 'livre',
    year: '2019',
  },
  {
    id: 'the-phoenix-project-collection',
    title: 'The Phoenix Project Collection',
    author: 'Candice M. Wright',
    kind: 'livre',
    year: '2021',
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
