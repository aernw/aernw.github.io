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

/**
 * Le top 15, dans l'ordre. Les crédits suivent l'édition standard d'origine,
 * d'après les pages Wikipedia, les crédits fournis par les labels (Qobuz) et
 * Discogs. Les producteurs sont rangés du plus présent au moins présent.
 */
export const topAlbums: readonly FavouriteAlbum[] = [
  {
    id: 'bladee-333',
    artist: 'Bladee',
    title: '333',
    released: '2020-07-16',
    label: 'YEAR0001',
    producers: ['Whitearmor', 'Gud', 'Mechatok', 'Lusi', 'Joakim Benon'],
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
    producers: ['Gud', 'Whitearmor', 'Shanti', 'Mechatok'],
    features: [],
    cover: '/covers/albums/ecco2k-e.webp',
    note: 'Plus qu’un album, une véritable expérience musicale qu’il faut absolument vivre. Un style qui se démarque à la croisée des genres et une direction artistique léchée comme on en voit peu.'
  },
  {
    id: 'thaiboy-digital-tiger',
    artist: 'Thaiboy Digital',
    title: 'Tiger',
    // Sorti en téléchargement libre : les sources ne s'accordent pas sur le jour.
    released: '2014-11',
    label: 'YEAR0001',
    producers: ['Whitearmor', 'Gud', 'Yung Sherman'],
    features: ['Yung Lean', 'Bladee'],
    cover: '/covers/albums/thaiboy-digital-tiger.webp',
  },
  {
    id: 'bitsu-nml',
    artist: 'Bitsu',
    title: 'No More Lemon (NML)',
    // Sorti sur SoundCloud, puis sur les plateformes sous le titre « NML ».
    released: '2017-06-04',
    label: 'Autoproduit',
    producers: ['Risky Business', 'Croisade', 'Jeunecartier', 'Migu', 'Bitsu'],
    features: ['Croisade', 'Realo', 'Ril3y'],
    cover: '/covers/albums/bitsu-nml.webp',
  },
  {
    id: 'lancey-foux-friend-or-foux',
    artist: 'Lancey Foux',
    title: 'FRIEND OR FOUX',
    released: '2019-12-06',
    label: 'PSYKE., Human Re Sources',
    producers: [
      'Jay Trench', 'DIAKO', 'Lancey Foux', 'Warpstr', 'Chuks', 'DP Beats',
      'Hiko Momoji', 'Saaga', 'Cardo', 'VloneLou', 'Skepta', 'IamTash',
    ],
    features: ['Bakar', 'Monkey 67', 'KESH', 'Skepta', 'Chip', 'Suave Sinatra'],
    cover: '/covers/albums/lancey-foux-friend-or-foux.webp',
  },
  {
    id: 'kid-cudi-man-on-the-moon-2',
    artist: 'Kid Cudi',
    title: 'Man on the Moon II: The Legend of Mr. Rager',
    released: '2010-11-09',
    label: 'Dream On, GOOD Music, Universal Motown',
    producers: [
      'Emile', 'Plain Pat', 'Dot da Genius', 'Kid Cudi', 'Chuck Inglish', 'Jim Jonsin',
      'Anthony Kilhoffer', 'Blended Babies',
    ],
    features: ['Cee-Lo', 'Mary J. Blige', 'Kanye West', 'Cage', 'St. Vincent', 'GLC', 'Chip tha Ripper', 'Nicole Wray'],
    cover: '/covers/albums/kid-cudi-man-on-the-moon-2.webp',
  },
  {
    id: 'the-weeknd-after-hours',
    artist: 'The Weeknd',
    title: 'After Hours',
    released: '2020-03-20',
    label: 'XO, Republic',
    producers: [
      'The Weeknd', 'Illangelo', 'Max Martin', 'Oscar Holter', 'DaHeala', 'Metro Boomin', 'OPN',
      'Ricky Reed', 'Kevin Parker', 'Prince 85', 'Notinbed',
    ],
    features: [],
    cover: '/covers/albums/the-weeknd-after-hours.webp',
  },
  {
    id: 'pnl-deux-freres',
    artist: 'PNL',
    title: 'Deux frères',
    released: '2019-04-05',
    label: 'QLF Records',
    producers: ['BBP', 'Nk.F', 'Joa', 'MKSB', 'Adsa', 'Yann Dakta', 'Rednose', 'Sam H', 'Anaika', 'IBØ'],
    features: [],
    cover: '/covers/albums/pnl-deux-freres.webp',
  },
  {
    id: 'ptite-soeur-nouvelle-economie',
    artist: 'Ptite Soeur & neophron',
    title: 'NOUVELLE ÉCONOMIE',
    released: '2023-12-18',
    label: 'Autoproduit',
    // prxpvne est l'alias de producteur de Ptite Soeur.
    producers: ['neophron', 'prxpvne', 'esone', 'Rosaliedu38', 'reivilose'],
    features: [],
    cover: '/covers/albums/ptite-soeur-nouvelle-economie.webp',
  },
  {
    id: 'yung-lean-stranger',
    artist: 'Yung Lean',
    title: 'Stranger',
    released: '2017-11-10',
    label: 'YEAR0001',
    producers: ['Gud', 'Whitearmor', 'Yung Sherman'],
    features: [],
    cover: '/covers/albums/yung-lean-stranger.webp',
  },
  {
    id: 'chief-keef-finally-rich',
    artist: 'Chief Keef',
    title: 'Finally Rich',
    released: '2012-12-18',
    label: 'Glory Boyz Entertainment, Interscope',
    producers: ['Young Chop', 'Mike Will Made It', 'A+', 'K.E. on the Track', 'YGOnDaBeat', 'Leek-E-Leek', 'Casa Di'],
    features: ['Lil Reese', '50 Cent', 'Wiz Khalifa', 'French Montana', 'Young Jeezy', 'Rick Ross'],
    cover: '/covers/albums/chief-keef-finally-rich.webp',
  },
  {
    id: 'young-thug-beautiful-thugger-girls',
    artist: 'Young Thug',
    title: 'Beautiful Thugger Girls',
    released: '2017-06-16',
    label: '300, Atlantic',
    producers: [
      'Wheezy', 'Rex Kudo', 'Charlie Handsome', 'London on da Track', 'Billboard Hitmakers',
      'Ben Billions', 'Scott Storch', 'BLSSD', 'Young Chop', 'Post Malone', 'Judge',
    ],
    features: ['Millie Go Lightly', 'Gunna', 'Future', 'Quavo', 'Snoop Dogg', 'Lil Durk', 'Jacquees'],
    cover: '/covers/albums/young-thug-beautiful-thugger-girls.webp',
  },
  {
    id: 'destroy-lonely-broken-hearts',
    artist: 'Destroy Lonely',
    title: 'Broken Hearts',
    volumes: [
      {
        title: '</3',
        released: '2020-09-25',
        label: 'Cecil Park Records',
        producers: ['Clayco', 'Cade', 'YxngFlair'],
        features: [],
        cover: '/covers/albums/destroy-lonely-broken-hearts-1.webp',
      },
      {
        title: '</3²',
        released: '2020-10-31',
        label: 'Cecil Park Records',
        producers: ['Clayco', 'YxngFlair', 'Cade', 'Destroy Lonely'],
        features: [],
        cover: '/covers/albums/destroy-lonely-broken-hearts-2.webp',
      },
      {
        title: '</3³',
        released: '2025-09-19',
        label: 'Opium, Interscope',
        producers: [
          'Bugz Ronin', 'Branden Akinyele', 'Cxdy', 'Icedmn', 'Saintracks', 'Wakeupp', 'Playinwith5',
          'Clayco', 'BBS', 'Crystals', 'Toom', 'Kwes', 'Darkboy', 'Hexotag', 'Whysobored', 'Bobby Raps',
          'Mondelli', 'Leadbluntt', 'Flybwoy', 'KayV', 'Dim Crux', 'Gabe Lucas', '206derek', 'Bryan Yepes',
          'Matty Spats', 'Cade', 'Aaron Shadrow', 'Jasper Harris', 'Nova', 'Whyeighteen', 'Rafmade',
          'Lil 88', 'Texaco Cam', 'Brazy', 'Leiso', 'Bhristo', 'Wallis Lane',
        ],
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
    producers: [
      'Jeez Suave', 'John Makabi', 'Mei', 'Mattu', 'DaddyJo', 'Guyzzi', 'Boss Lady', 'Lasso',
      'Neon Valley', 'San Juliet', 'Medbanger', 'neophron', 'Rosaliedu38', 'esone',
    ],
    features: ['Jahlys', 'Zoomy'],
    cover: '/covers/albums/theodora-bad-boy-lovestory.webp',
  },
  {
    id: 'jeune-morty-eponyme',
    artist: 'Jeune Morty',
    title: 'Éponyme',
    released: '2025-06-20',
    label: 'JETSETFAROT',
    producers: [
      'Vkkng', 'Silver Knight', 'Kakou', 'Ayky', 'Boumidjal', 'HoloMobb', 'Knowcapp', 'Diaxal',
      'margiela', 'Hash K',
    ],
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
