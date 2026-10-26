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
    note: '333 est un voyage dont on ne revient pas indemne. Bladee nous transporte dans un univers féerique et mélancolique sur un ton très personnel et spirituel. Benjamin nous fais ouvrir les yeux sur l\'amour, la tristesse, l\'existence. Noblest Strive est un des morceaux les plus marquants de ma vie : une véritable leçon de vie qui fait prendre du recul sur le malheur et les choses négatives qui nous arrivent. Cet album fait passer un message de résilience et de positivité qui m\'a beaucoup aidé dans ma vie.'
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
    note: 'Plus qu’un album, une véritable expérience musicale qu’il faut absolument vivre. Un style qui se démarque à la croisée des genres et une direction artistique léchée comme on en voit peu. E est pour moi une avancée dans la monde de la musique tant les ambiances, les sonorités, les textures et les émotions transmises sont uniques.'
  },
  {
    id: 'energie-ril3y',
    artist: 'Ril3y',
    title: 'Énergie',
    released: '2020-05-22',
    label: 'Autoproduit',
    producers: ['Ril3y', 'Croisade', 'Jeunecartier', 'Migu', 'Bitsu'],
    features: ['Croisade', 'Realo', 'Bitsu'],
    cover: '/covers/albums/energie.jpg',
    note: 'Énergie est sans doute le projet pour lequel j\'ai le plus de nostalgie et d\'attachement. Déjà il est sorti durant 2020, une année très particulière pour moi qui est sans doute celle où j\'ai le plus évolué et grandi dans ma tête. Énergie représente cette énergie innocente et naîve que j\'ai ressenti à ce moment-là. Ensuite Ril3y est un artiste qui m\'a beaucoup marqué par la simplicité et le ton insouciant de ses textes dans lesquels je me suis recconu. Enfin, Énergie est un projet qui m\'a beaucoup plu par sa sobriété et sa cohérence : un rock alternatif mélodique rare sur soundcloud et qui m\'a fait découvrir un style musical que j\'écoutais peu à l\'époque.' 
  },
  {
    id: 'thaiboy-digital-tiger',
    artist: 'Thaiboy Digital',
    title: 'Tiger',
    released: '2014-11',
    label: 'YEAR0001',
    producers: ['Whitearmor', 'Gud', 'Yung Sherman'],
    features: ['Yung Lean', 'Bladee'],
    cover: '/covers/albums/thaiboy-digital-tiger.webp',
    note: 'La genèse du cloud rap, cet album a été une vraie claque pour moi. Un mélange de rap et d\'EDM qui a influencé toute une génération d\'artistes encore aujourd\'hui.'
  },
  {
    id: 'bitsu-nml',
    artist: 'Bitsu',
    title: 'No More Lemon (NML)',
    released: '2017-06-04',
    label: 'Autoproduit',
    producers: ['Risky Business', 'Croisade', 'Jeunecartier', 'Migu', 'Bitsu'],
    features: ['Croisade', 'Realo', 'Ril3y'],
    cover: '/covers/albums/bitsu-nml.webp',
    note: 'À l\'époque de la sortie de NML, Bitsu était la figure de proue du rap français underground. Du rap mélodique, des productions planantes et des textes introspectifs qui m’ont marqué et fait ressentir beaucoup d\'émotions.'
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
    note: 'Album unique en son genre, Lancey est un artiste qui se démarque énormément dans le paysage du rap. Il apporte un vent de renouveau dans la trap et utilise sa voix comme un instrument à part entière. Mon album UK préféré.'
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
    note: 'Un album qu\'on ne peut oublier. Kid Cudi m\'a marqué dans sa manière de raconter ses épisodes dépressifs et ses addictions avec beaucoup d\'images et de symboles amenant une légèreté à des sujets difficiles à aborder sans être trop lourd.'
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
    note: 'Possiblement l\'album le plus abouti et le mieux produit de The Weeknd. Des productions d\'une qualité exceptionnelle, une identité visuelle marquante et un tout cohérent qui marque un renouveau dans sa carrière. Je me vois encore en train de jouer à Star Citizen en écoutant les productions sombres et planantes de cet album: un moment inoubliable. Mention spéciale à Heartless qui est possiblement la meilleure performance d\'un duo producteur / chanteur que j\'ai jamais entendu.'
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
    note: 'Deux frères est un vent d\'air frais dans le rap français. À cette époque dominée par la trap et le rap gangsta, PNL est sorti du lot avec une identité forte et un style unique déjà établi par leurs précédents projets. Des façons de poser et d\'écrire propres à eux. Une aura se dégage de leur musique et Deux frères représente à la fois la fin et l\'apogée de la carrière de Nabil et Tarik.'
  },
  {
    id: 'ptite-soeur-nouvelle-economie',
    artist: 'Ptite Soeur & neophron',
    title: 'NOUVELLE ÉCONOMIE',
    released: '2023-12-18',
    label: 'Autoproduit',
    producers: ['neophron', 'prxpvne', 'esone', 'Rosaliedu38', 'reivilose'],
    features: [],
    cover: '/covers/albums/ptite-soeur-nouvelle-economie.webp',
    note:'En tant que figure montante de l\'underground français, Ptite Soeur se positionne à l\'antithèse des clichés du rap. Petite soeur parle dans cet album de l\'identité de genre, de la santé mentale, de l\'injustice sociale et de scandales politiques. Des choses qui font échos à la jeunesse d\'aujourd\'hui et qui sont rarement abordées dans le rap français. Un album qui m\'a marqué par son ton cru et son audace.'
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
    note: 'Album tellement important et influent dans le rap. Finally Rich est l\'emblème de la drill de Chicago et a influencé le rap à une échelle qu\'on ne peut pas quantifier. Les productions de Young Chop amenant des nouvelles sonorités de synthé et des flows nouveaux ont fait naître une toute nouvelle génération d\'artistes qui ont toujours décrit Chief Keef comme une influence majeure dans leur carrière.'
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
    note: 'Beautiful Thugger Girls montre la versatilité de Young Thug, des productions proches de la Country, du R&B et des productions légères presque niaises qui prouvent que la voix de Young Thug suffit elle-même à façonner un univers unique.' 
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
    note: 'Destroy Lonely souvent réduit injustement à une copie de Playboi Carti nous montre avec cette trilogie qu\'il a un style de trap unique. Des productions propres à son style : des 808 et des basses très présentes, beaucoup de samples, une voix et des flows jamais vu chez aucun autre artiste. Broken Hearts est un véritable manifeste de l\'évolution de la trap et une preuve de plus que Destroy Lonely maîtrise son art à la perfection.'
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
    note: 'Véritable bombe culturelle en France, Bad boy lovestory est un album qui amène sur le devant de la scène des styles musicaux peu représentés dans le paysage musical français : Bouyon, Dancehall, Pop, variété française, R&B, Amapiano, ... Théodora a une voix unique et montre son incroyable capacité à interpréter différents styles musicaux en y apportant une couleur unique et nouvelle. Cet album marque les jeunes générations qui se sentent représentées par une artiste en dehors des normes de beautés, de genres et de couleurs. Car Thédora est une artiste engagée et parle ouvertement de sa bisexualité, est fière de sa couleur de peau et de son physique aux antipodes de la norme.' 
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
    note: 'Jeune Morty : un artiste qui amène ses racines africaines dans sa musique et qui mélange les inspirations de la trap, de la drill, de l\'afrobeat et du cloud rap. Éponyme est un album qui était très attendu par les fans de Jeune Morty qui passe d\'un artiste qui manque de sérieux à un artiste capable de produire des projets cohérents et aboutis. J\'ai été marqué par la qualité de production et la variété des flows de Jeune Morty qui était déjà connu pour sa voix et sa façon de poser unique.'
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
