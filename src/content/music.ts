/**
 * Contenu musical du côté Perso.
 *
 * Ce fichier est fait pour être édité souvent — c'est la partie vivante du site.
 * Voir le guide « Tenir le site à jour » dans le README pour la marche à suivre.
 *
 * Les pochettes sont stockées localement dans `public/covers/` et réparties par
 * type de contenu : découvertes, albums, artistes et concerts. Le build Vite les
 * copie automatiquement, donc on évite les URLs externes et les images qui
 * disparaissent.
 */

/** Ce que contient une découverte : sert à l'étiquette et aux filtres. */
export type FindKind = 'musique' | 'film' | 'série' | 'outil'

export interface RecentFind {
  readonly id: string
  readonly kind: FindKind
  readonly title: string
  /** Artiste, réalisateur·rice ou éditeur. */
  readonly by: string
  readonly year?: string
  /** Une ou deux phrases : pourquoi tu le recommandes. */
  readonly note?: string
  /** Image carrée, dans `public/covers/finds/`. Sans image, un dégradé la remplace. */
  readonly cover?: string
  readonly href?: string
}

export const recentFinds: readonly RecentFind[] = []

/** Une sortie : un album, ou un volume d'une série. */
export interface AlbumRelease {
  readonly title: string
  /** Date de la sortie originale : AAAA-MM-JJ, ou AAAA-MM / AAAA si le jour n'est pas connu. */
  readonly released: string
  /** Image carrée, dans `public/covers/albums/`. */
  readonly cover?: string
  readonly label?: string
  /** Producteurs, du plus présent sur l'album au moins présent. */
  readonly producers?: readonly string[]
  /** Artistes invités sur la tracklist. Une liste vide affiche « Aucun ». */
  readonly features?: readonly string[]
}

interface AlbumEntry {
  readonly id: string
  readonly artist: string
  readonly note?: string
  readonly href?: string
}

/** Un album seul : ses crédits sont posés à plat. */
export interface SingleAlbum extends AlbumEntry, AlbumRelease {}

/**
 * Plusieurs albums qui ne font qu'un (une trilogie…) : ils partagent un rang,
 * et chaque volume garde sa pochette et ses crédits.
 */
export interface AlbumSeries extends AlbumEntry {
  /** Nom de la série, affiché à côté de l'artiste. */
  readonly title: string
  readonly volumes: readonly [AlbumRelease, ...AlbumRelease[]]
}

export type FavouriteAlbum = SingleAlbum | AlbumSeries

/** Les sorties d'un rang : l'album lui-même, ou les volumes de la série. */
export const releasesOf = (album: FavouriteAlbum): readonly [AlbumRelease, ...AlbumRelease[]] =>
  'volumes' in album ? album.volumes : [album]

export const topAlbums: readonly FavouriteAlbum[] = [
  {
    id: 'bladee-333',
    artist: 'Bladee',
    title: '333',
    released: '2020-07-16',
    label: 'YEAR0001',
    features: [],
    cover: '/covers/albums/bladee-333.webp',
    note: 'Un album magnifique. Les productions mélancoliques et organiques parfois oniriques sont accompagnées de textes profonds et positifs sur la vie.'
  },
  {
    id: 'ecco2k-e',
    artist: 'Ecco2k',
    title: 'E',
    released: '2019-11-27',
    label: 'YEAR0001',
    features: [],
    cover: '/covers/albums/ecco2k-e.webp',
    note: 'Plus qu’un album, une véritable expérience musicale qu’il faut absolument vivre. Un style qui se démarque à la croisée des genres et une direction artistique léchée comme on en voit peu.'
  },
  {
    id: 'thaiboy-digital-tiger',
    artist: 'Thaiboy Digital',
    title: 'Tiger',
    released: '2014-11-17',
    label: 'YEAR0001',
    features: ['Yung Lean', 'Bladee'],
    cover: '/covers/albums/thaiboy-digital-tiger.webp',
  },
  {
    id: 'bitsu-nml',
    artist: 'Bitsu',
    title: 'NML',
    released: '2017-06-04',
    features: ['Ril3y', 'Croisade', 'Realo'],
    cover: '/covers/albums/bitsu-nml.webp',
  },
  {
    id: 'lancey-foux-friend-or-foux',
    artist: 'Lancey Foux',
    title: 'FRIEND OR FOUX',
    released: '2019-12-06',
    label: 'PSYKE. / Human Re Sources',
    features: ['Bakar', 'Monkey 67', 'Kesh', 'Skepta', 'Chip', 'Suave Sinatra'],
    cover: '/covers/albums/lancey-foux-friend-or-foux.webp',
  },
  {
    id: 'kid-cudi-man-on-the-moon-2',
    artist: 'Kid Cudi',
    title: 'Man on the Moon II: The Legend of Mr. Rager',
    released: '2010-11-09',
    label: 'Universal Motown',
    features: ['Cee-Lo', 'Mary J. Blige', 'Kanye West', 'Cage', 'St. Vincent', 'GLC', 'Chip Tha Ripper', 'Nicole Wray'],
    cover: '/covers/albums/kid-cudi-man-on-the-moon-2.webp',
  },
  {
    id: 'the-weeknd-after-hours',
    artist: 'The Weeknd',
    title: 'After Hours',
    released: '2020-03-20',
    label: 'XO, Republic',
    features: [],
    cover: '/covers/albums/the-weeknd-after-hours.webp',
  },
  {
    id: 'pnl-deux-freres',
    artist: 'PNL',
    title: 'Deux frères',
    released: '2019-04-05',
    label: 'QLF Records',
    features: [],
    cover: '/covers/albums/pnl-deux-freres.webp',
  },
  {
    id: 'ptite-soeur-nouvelle-economie',
    artist: 'Ptite Soeur',
    title: 'Nouvelle économie',
    released: '2023-12-18',
    features: ['Rosaliedu38', 'Esone', 'reivilose'],
    cover: '/covers/albums/ptite-soeur-nouvelle-economie.webp',
  },
  {
    id: 'yung-lean-stranger',
    artist: 'Yung Lean',
    title: 'Stranger',
    released: '2017-11-10',
    label: 'YEAR0001',
    features: [],
    cover: '/covers/albums/yung-lean-stranger.webp',
  },
  {
    id: 'chief-keef-finally-rich',
    artist: 'Chief Keef',
    title: 'Finally Rich',
    released: '2012-12-18',
    label: 'Interscope',
    features: ['Lil Reese', '50 Cent', 'Wiz Khalifa', 'French Montana', 'Young Jeezy', 'Rick Ross'],
    cover: '/covers/albums/chief-keef-finally-rich.webp',
  },
  {
    id: 'young-thug-beautiful-thugger-girls',
    artist: 'Young Thug',
    title: 'Beautiful Thugger Girls',
    released: '2017-06-16',
    label: 'Atlantic',
    features: ['Millie Go Lightly', 'Gunna', 'Future', 'Quavo', 'Lil Durk', 'Snoop Dogg', 'Jacquees'],
    cover: '/covers/albums/young-thug-beautiful-thugger-girls.webp',
  },
  {
    id: 'destroy-lonely-broken-hearts',
    artist: 'Destroy Lonely',
    title: 'Broken Hearts',
    volumes: [
      {
        title: '</3',
        released: '2026-05-17',
        label: 'Cecil Park Records',
        features: [],
        cover: '/covers/albums/destroy-lonely-broken-hearts-1.webp',
      },
      {
        title: '</3²',
        released: '2020-10-31',
        label: 'Cecil Park Records',
        features: [],
        cover: '/covers/albums/destroy-lonely-broken-hearts-2.webp',
      },
      {
        title: '</3³',
        released: '2025-09-19',
        label: 'Opium, Interscope',
        features: ['Ken Carson'],
        cover: '/covers/albums/destroy-lonely-broken-hearts-3.webp',
      },
    ],
  },
  {
    id: 'theodora-bad-boy-lovestory',
    artist: 'Theodora',
    title: 'BAD BOY LOVESTORY',
    released: '2024-11-01',
    label: 'Maison Neptune, NBFD',
    features: ['Jeez Suave', 'Jahlys'],
    cover: '/covers/albums/theodora-bad-boy-lovestory.webp',
  },
  {
    id: 'jeune-morty-eponyme',
    artist: 'Jeune Morty',
    title: 'Éponyme',
    released: '2025-06-20',
    label: 'Jetset Farot',
    features: [],
    cover: '/covers/albums/jeune-morty-eponyme.webp',
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
