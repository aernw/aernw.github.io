/**
 * Contenu musical de la face B.
 *
 * Ce fichier est fait pour être édité souvent — c'est la partie vivante du site.
 * Voir le guide « Tenir le site à jour » dans le README pour la marche à suivre.
 *
 * Les pochettes sont stockées localement dans `public/covers/` et réparties par
 * type de contenu : découvertes, albums, artistes et vinyles. Le build Vite les
 * copie automatiquement, donc on évite les URLs externes et les images qui
 * disparaissent.
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
 * Classement établi d'après les écoutes cumulées (stats.fm, toute la période).
 * Le champ `note` est volontairement vide : à remplir à la main, une ligne par
 * disque, quand l'envie vient.
 */
export const topAlbums: readonly FavouriteAlbum[] = [
  {
    id: 'bladee-333',
    artist: 'Bladee',
    title: '333',
    year: '2020',
    cover: '/covers/albums/bladee-333.webp',
    note: 'Un album magnifique. Les productions mélancoliques et organiques parfois oniriques sont accompagnées de textes profonds et positifs sur la vie.'
  },
  {
    id: 'retro-x-heroes',
    artist: 'Retro X',
    title: 'Heroes',
    year: '2018',
    cover: '/covers/albums/retro-x-heroes.webp',
    note: 'Album très personnel et sombre aux productions variées mais cohérentes. Cet album se démarque par un nouveau style de cloud rap peu présent en France à cette époque.'
  },
  {
    id: 'retro-x-24',
    artist: 'Retro X',
    title: '24',
    year: '2019',
    cover: '/covers/albums/retro-x-24.webp',
    note: 'Heroes en plus travaillé : album sans aucun défaut presque trop parfait qui marque le pic de la carrière de Retro X.'
  },
  {
    id: 'ecco2k-e',
    artist: 'Ecco2k',
    title: 'E',
    year: '2019',
    cover: '/covers/albums/ecco2k-e.webp',
    note: 'Plus qu’un album, une véritable expérience musicale qu’il faut absolument vivre. Un style qui se démarque à la croisée des genres et une direction artistique léchée comme on en voit peu.'
  },
  {
    id: 'bladee-the-fool',
    artist: 'Bladee',
    title: 'The Fool',
    year: '2021',
    cover: '/covers/albums/bladee-the-fool.webp',
    note: 'Pour moi l’un des meilleurs projets de Bladee qui prouve sa capacité à évoluer à et se renouveler avec un rythme soutenu d’un album par an depuis 2018 : tous très différents, tous très bons.'
  },
  {
    id: 'bladee-icedancer',
    artist: 'Bladee',
    title: 'Icedancer',
    year: '2018',
    cover: '/covers/albums/bladee-icedancer.webp',
    note: 'L’album le plus emblématique de la carrière de Bladee, ce qui se rapproche le plus d’un "pic" de carrière bien qu’il nous montre tous les ans qu’il ne l’a jamais atteint. Les productions de ripsquadd sont possiblement aussi emblématiques que les textes de bladee.'
  },
  {
    id: 'bladee-red-light',
    artist: 'Bladee',
    title: 'Red Light',
    year: '2018',
    cover: '/covers/albums/bladee-red-light.webp',
    note: 'J’adore retourner sur celui-ci, cet album ne prend pas une ride : productions entraînantes et magnifiques, punchlines emblématiques, un niveau de rap et de chant jamais vu chez Bladee. Cet album n’a juste aucun défaut et c’est celà qui le rend moins emblématique car ce style "trop" parfait ne sied pas à Bladee.'
  },
  {
    id: 'yuri-online-mh-yurimh',
    artist: 'Yuri Online, MH',
    title: 'YuriMh',
    year: '2021',
    cover: '/covers/albums/yuri-online-mh-yurimh.webp',
    note: 'Un EP '
  },
  {
    id: 'lancey-foux-friend-or-foux',
    artist: 'Lancey Foux',
    title: 'FRIEND OR FOUX',
    year: '2019',
    cover: '/covers/albums/lancey-foux-friend-or-foux.webp',
  },
  {
    id: 'bladee-thaiboy-digital-ecco2k-trash-island',
    artist: 'Bladee, Thaiboy Digital, Ecco2k',
    title: 'Trash Island',
    year: '2019',
    cover: '/covers/albums/bladee-thaiboy-digital-ecco2k-trash-island.webp',
  },
]

export interface FavouriteArtist {
  readonly id: string
  readonly name: string
  readonly note?: string
  readonly href?: string
  readonly cover?: string
}


export const topArtists: readonly FavouriteArtist[] = [
  { id: 'bladee', name: 'Bladee', cover: '/covers/artists/bladee.webp' },
  { id: 'retro-x', name: 'Retro X', cover: '/covers/artists/retro-x.webp' },
  { id: 'ecco2k', name: 'Ecco2k', cover: '/covers/artists/ecco2k.webp' },
  { id: 'yung-lean', name: 'Yung Lean', cover: '/covers/artists/yung-lean.webp' },
  { id: 'wasting-shit', name: 'wasting shit', cover: '/covers/artists/wasting-shit.webp' },
  { id: 'yuri-online', name: 'Yuri Online', cover: '/covers/artists/yuri-online.webp' },
  { id: 'thaiboy-digital', name: 'Thaiboy Digital', cover: '/covers/artists/thaiboy-digital.webp' },
  { id: 'ptite-soeur', name: 'Ptite Soeur', cover: '/covers/artists/ptite-soeur.webp' },
  { id: 'lancey-foux', name: 'Lancey Foux', cover: '/covers/artists/lancey-foux.webp' },
  { id: 'kid-cudi', name: 'Kid Cudi', cover: '/covers/artists/kid-cudi.webp' },
]

export interface Vinyl {
  readonly id: string
  readonly artist: string
  readonly title: string
  readonly year: string
  readonly pressing?: string
  readonly cover?: string
}

/**
 * Collection de vinyles.
 *
 * `year` est l'année de sortie de l'album ; `pressing` ne sert qu'à signaler
 * une édition qui a un intérêt (réédition, vinyle coloré, coffret). Sur les
 * disques pressés à leur sortie, il est simplement omis.
 */
export const vinyls: readonly Vinyl[] = [
  {
    id: 'vinyl-radiohead-ok-computer',
    artist: 'Radiohead',
    title: 'OK Computer',
    year: '1997',
    pressing: 'Réédition 2016',
    cover: '/covers/vinyls/radiohead-ok-computer.webp',
  },
  {
    id: 'vinyl-nirvana-nevermind',
    artist: 'Nirvana',
    title: 'Nevermind',
    year: '1991',
    pressing: 'Réédition 2011',
    cover: '/covers/vinyls/nirvana-nevermind.webp',
  },
  {
    id: 'vinyl-rhcp-californication',
    artist: 'Red Hot Chili Peppers',
    title: 'Californication',
    year: '1999',
    pressing: 'Réédition 2012',
    cover: '/covers/vinyls/red-hot-chili-peppers-californication.webp',
  },
  {
    id: 'vinyl-the-weeknd-starboy',
    artist: 'The Weeknd',
    title: 'Starboy',
    year: '2016',
    cover: '/covers/vinyls/the-weeknd-starboy.webp',
  },
  {
    id: 'vinyl-the-weeknd-after-hours',
    artist: 'The Weeknd',
    title: 'After Hours',
    year: '2020',
    cover: '/covers/vinyls/the-weeknd-after-hours.webp',
  },
  {
    id: 'vinyl-the-weeknd-dawn-fm',
    artist: 'The Weeknd',
    title: 'Dawn FM',
    year: '2022',
    cover: '/covers/vinyls/the-weeknd-dawn-fm.webp',
  },
]
