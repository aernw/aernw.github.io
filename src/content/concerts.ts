/**
 * Les concerts et festivals, du plus récent au plus ancien.
 *
 * Les images sont dans `public/covers/concerts/` : l'affiche officielle de la
 * date quand elle existe, sinon une photo de l'artiste ou du festival. Sans
 * image, le billet garde un dégradé.
 *
 * Un concert dont la date n'est pas encore passée s'affiche « À venir », en tête.
 */

export type ConcertKind = 'Concert' | 'Festival' | 'Soirée'

export interface Concert {
  readonly id: string
  /** Artiste, plateau ou nom du festival. */
  readonly title: string
  readonly venue: string
  readonly kind: ConcertKind
  /** Premier jour, au format « 2026-10-10 ». */
  readonly date: string
  /** Dernier jour, pour un festival sur plusieurs jours. */
  readonly endDate?: string
  readonly image?: string
}

export const concerts: readonly Concert[] = [
  {
    id: 'arch-club-2026',
    title: 'Arch Club',
    venue: 'Élysée Montmartre · Paris',
    kind: 'Soirée',
    date: '2026-10-10',
    image: '/covers/concerts/arch-club.webp',
  },
  {
    id: 'the-weeknd-2026',
    title: 'The Weeknd',
    venue: 'Stade de France',
    kind: 'Concert',
    date: '2026-07-10',
    image: '/covers/concerts/weeknd-2026.webp',
  },
  {
    id: 'we-love-green-2026',
    title: 'We Love Green',
    venue: 'Bois de Vincennes · Paris',
    kind: 'Festival',
    date: '2026-06-05',
    endDate: '2026-06-07',
  },
  {
    id: 'jeune-morty-2026',
    title: 'Jeune Morty',
    venue: 'La Cigale · Paris',
    kind: 'Concert',
    date: '2026-04-29',
    image: '/covers/concerts/jeune-morty.webp',
  },
  {
    id: 'sim01-2026',
    title: 'Sim01',
    venue: 'FGO-Barbara · Paris',
    kind: 'Concert',
    date: '2026-04-11',
    image: '/covers/concerts/sim01.webp',
  },
  {
    id: 'theodora-2026',
    title: 'Theodora',
    venue: 'Zénith de Lille',
    kind: 'Concert',
    date: '2026-03-24',
    image: '/covers/concerts/theodora.webp',
  },
  {
    id: 'tiakola-2025',
    title: 'Tiakola',
    venue: 'Accor Arena · Paris',
    kind: 'Concert',
    date: '2025-03-27',
    image: '/covers/concerts/tiakola.webp',
  },
  {
    id: 'houdi-2025',
    title: 'Houdi',
    venue: 'Zénith Paris – La Villette',
    kind: 'Concert',
    date: '2025-03-08',
    image: '/covers/concerts/houdi.webp',
  },
  {
    id: 'angsty-camboyz-revenge-2025',
    title: 'Angsty Camboyz Revenge',
    venue: 'La Maroquinerie · Paris',
    kind: 'Concert',
    date: '2025-02-23',
    image: '/covers/concerts/angsty-camboyz.webp',
  },
  {
    id: 'jaymee-2025',
    title: 'Jaymee',
    venue: 'La Boule Noire · Paris',
    kind: 'Concert',
    date: '2025-01-31',
    image: '/covers/concerts/jaymee.webp',
  },
  {
    id: 'bladee-2024',
    title: 'Bladee',
    venue: 'L’Olympia · Paris',
    kind: 'Concert',
    date: '2024-12-08',
    image: '/covers/concerts/bladee.webp',
  },
  {
    id: 'selug-senar-2024',
    title: 'Selug & $enar',
    venue: 'La Machine du Moulin Rouge · Paris',
    kind: 'Concert',
    date: '2024-12-06',
    image: '/covers/concerts/selug-senar.webp',
  },
  {
    id: 'grunt-festival-2024',
    title: 'Grünt Festival',
    venue: 'Parc de la Bergère · Bobigny',
    kind: 'Festival',
    date: '2024-09-21',
    image: '/covers/concerts/grunt.webp',
  },
  {
    id: 'amor-fati-2024',
    title: 'Amor Fati + LacopinedeFlipper + 6ilverr',
    venue: 'Point Éphémère · Paris',
    kind: 'Concert',
    date: '2024-09-20',
  },
  {
    id: 'reves-party-10-2024',
    title: 'Rêves Party 10',
    venue: 'Petit Bain · Paris',
    kind: 'Soirée',
    date: '2024-06-15',
    image: '/covers/concerts/reves-party.webp',
  },
  {
    id: 'we-love-green-2024',
    title: 'We Love Green',
    venue: 'Bois de Vincennes · Paris',
    kind: 'Festival',
    date: '2024-05-31',
    endDate: '2024-06-02',
    image: '/covers/concerts/we-love-green-2024.webp',
  },
  {
    id: 'luther-2024',
    title: 'Luther',
    venue: 'Le Trianon · Paris',
    kind: 'Concert',
    date: '2024-03-05',
    image: '/covers/concerts/luther.webp',
  },
  {
    id: 'the-weeknd-2023',
    title: 'The Weeknd',
    venue: 'Stade de France',
    kind: 'Concert',
    date: '2023-07-30',
    image: '/covers/concerts/weeknd-2023.webp',
  },
  {
    id: 'destroy-lonely-2023',
    title: 'Destroy Lonely',
    venue: 'La Bellevilloise · Paris',
    kind: 'Concert',
    date: '2023-03-15',
    image: '/covers/concerts/destroy-lonely.webp',
  },
]
