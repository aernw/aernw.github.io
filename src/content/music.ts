/**
 * Contenu musical de la face B.
 *
 * Ce fichier est fait pour être édité souvent — c'est la partie vivante du site.
 * Voir le guide « Tenir le site à jour » dans le README pour la marche à suivre.
 *
 * Les pochettes sont stockées localement dans `public/covers/` et réparties par
 * type de contenu : découvertes, albums et vinyles. Le build Vite les copie
 * automatiquement, donc on évite les URLs externes et les images qui disparaissent.
 */

export interface Discovery {
  readonly id: string
  readonly artist: string
  readonly title: string
  readonly year: string
  /** Deux ou trois phrases : ce qui t'a marqué. C'est ce qui vaut d'être lu. */
  readonly note: string
  /** Mois de la découverte, au format « 2026-08 ». Sert à afficher la fraîcheur. */
  readonly discovered: string
  readonly cover?: string
  readonly href?: string
}

/**
 * Découvertes récentes, de la plus récente à la plus ancienne.
 *
 * TODO Erwan : remplis cette liste. Une entrée d'exemple est laissée en commentaire
 * ci-dessous pour montrer le format — décommente-la et remplace son contenu.
 */
export const discoveries: readonly Discovery[] = [
  {
    id: 'fennes-sleepless-sun',
    artist: 'Fennes',
    title: 'Sleepless Sun',
    year: '2026',
    note: 'Une matière lumineuse et un peu désolée, qui tient la route sans jamais tomber dans le grandiloquent.',
    discovered: '2026-08',
    cover: '/covers/discoveries/fennes.svg',
    href: 'https://open.spotify.com/',
  },
  {
    id: 'saaz-nocturne',
    artist: 'Saaz',
    title: 'Nocturne de pierre',
    year: '2025',
    note: 'Des rythmes qui avancent sans hâte, avec une vraie envie de laisser l’espace respirer.',
    discovered: '2026-06',
    cover: '/covers/discoveries/saaz.svg',
    href: 'https://open.spotify.com/',
  },
  {
    id: 'the-quiet-ones-warm-lights',
    artist: 'The Quiet Ones',
    title: 'Warm Lights',
    year: '2024',
    note: 'Cette chanson a cette qualité rare de faire sentir le lieu sans jamais l’expliquer.',
    discovered: '2026-04',
    cover: '/covers/discoveries/quiet-ones.svg',
    href: 'https://open.spotify.com/',
  },
]

export interface FavouriteAlbum {
  readonly id: string
  readonly artist: string
  readonly title: string
  readonly year: string
  /** Une ligne : pourquoi celui-là, et pas un autre. */
  readonly note?: string
  readonly cover?: string
  readonly href?: string
}

/**
 * Top albums de tous les temps.
 *
 * L'ordre du tableau EST le classement — la première entrée est le n° 1.
 * Pas de notes en étoiles : sur un top all-time, tout serait à cinq étoiles et
 * la note n'apprendrait rien. La position seule porte le jugement.
 *
 * TODO Erwan : remplis ce classement.
 */
export const topAlbums: readonly FavouriteAlbum[] = [
  {
    id: 'autechre-incunabula',
    artist: 'Autechre',
    title: 'Incunabula',
    year: '1993',
    note: 'Le disque qui a fait entrer la machine dans la mélodie sans jamais la trahir.',
    cover: '/covers/albums/autechre.svg',
  },
  {
    id: 'burial-untrue',
    artist: 'Burial',
    title: 'Untrue',
    year: '2007',
    note: 'Tout est là : la nuit, le brouillard, les ruptures de rythme et l’émotion sans explication.',
    cover: '/covers/albums/burial.svg',
  },
  {
    id: 'radiohead-ok-computer',
    artist: 'Radiohead',
    title: 'OK Computer',
    year: '1997',
    note: 'Un album de tension et de détails, qui semble toujours regarder ailleurs avant d’entrer dans la pièce.',
    cover: '/covers/albums/radiohead.svg',
  },
  {
    id: 'boards-of-canada-geogaddi',
    artist: 'Boards of Canada',
    title: 'Geogaddi',
    year: '2002',
    note: 'Le monde le plus intime et le plus étrange : une carte mentale tactile et lumineuse.',
    cover: '/covers/albums/geogaddi.svg',
  },
]

export interface FavouriteArtist {
  readonly id: string
  readonly name: string
  readonly note?: string
  readonly href?: string
}

/** TODO Erwan : ton top artistes, dans l'ordre. */
export const topArtists: readonly FavouriteArtist[] = [
  { id: 'autechre', name: 'Autechre', note: 'L’intelligence du rythme poussée jusqu’à la sensation.', href: 'https://www.autechre.com/' },
  { id: 'burial', name: 'Burial', note: 'Les claquements de nuit, les morceaux qui donnent le vertige sans le montrer.', href: 'https://burial.bandcamp.com/' },
  { id: 'boards-of-canada', name: 'Boards of Canada', note: 'Un univers de mémoire, de texture et de paysages lointains.', href: 'https://www.boardsofcanada.com/' },
  { id: 'aphex-twin', name: 'Aphex Twin', note: 'Un génie du détail toujours un peu trop loin pour être saisi.', href: 'https://aphextwin.com/' },
]

export interface Vinyl {
  readonly id: string
  readonly artist: string
  readonly title: string
  readonly year: string
  /** Édition ou pressage, si ça a un intérêt (réédition, couleur, coffret…). */
  readonly pressing?: string
  readonly cover?: string
}

/**
 * Collection de vinyles.
 *
 * TODO Erwan : ajoute tes disques. Inutile de tout lister — les plus marquants
 * racontent mieux qu'un inventaire complet.
 */
export const vinyls: readonly Vinyl[] = [
  {
    id: 'vinyl-geogaddi',
    artist: 'Boards of Canada',
    title: 'Geogaddi',
    year: '2002',
    pressing: 'Pressage 2021',
    cover: '/covers/vinyls/autechre.svg',
  },
  {
    id: 'vinyl-untrue',
    artist: 'Burial',
    title: 'Untrue',
    year: '2007',
    cover: '/covers/vinyls/burial.svg',
  },
  {
    id: 'vinyl-ambient-s',
    artist: 'Various Artists',
    title: 'Ambient Selection',
    year: '1999',
    pressing: 'Compilation',
    cover: '/covers/vinyls/ambient-selection.svg',
  },
]
