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
  readonly statement: string
  readonly context?: string
}

export const lessons: readonly Lesson[] = [
  {
    id: 'lesson-1',
    statement: 'Il est important de passer tout le temps nécessaire sur l’architecture avant de coder : les futurs développeurs te remercieront.',
    context: 'Un projet construit sur des fondations fragiles et des coins d’ombres finira par demander beaucoup plus de temps pour être maintenu et de nouvelles features auront du mal à s’y intégrer si elles n’ont pas été anticipées dès le départ.',
  },
  {
    id: 'lesson-2',
    statement: '"Laisse le code plus propre que tu l’as trouvé."',
    context: '10 pour 1 : voici le ratio lecture/écriture de code des développeurs. Qu’il s’agisse d’un simple nom de variable, de simplifier une fonction ou d’un refactor : chaque amélioration sera très appréciée par les prochains développeurs qui passeront après toi.',
  },
  {
    id: 'lesson-3',
    statement: 'Un bon interface se construit en se mettant dans la peau d’un utilisateur flemmard.',
    context: 'Pour qu’un interface soit utile à celui qui l’utilise, il doit être pensé pour que les actions quotidiennes soient les plus simples et rapides possibles : limiter le nombre de clics, de pages, de champs à remplir à la main, ...',
  },
  {
    id: 'lesson-4',
    statement: 'N’aie pas peur de donner ton avis et tes recommendations, peu importe ta position dans l’entreprise.',
    context: 'Toutes les personnes ont une sensibilité différente et peuvent avoir des idées ou des remarques intéressantes et utiles. Même si tu es junior, ton avis peut être précieux et aider à améliorer le produit ou le projet.',
  }
]
