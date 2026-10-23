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

/**
 * Mes découvertes récentes : musique, films et séries, outils et apps.
 * De la plus récente à la plus ancienne.
 *
 * TODO Erwan : remplis cette liste. Tant qu'elle est vide, la section affiche
 * un court message à la place des cartes. Exemple à copier :
 *
 *   {
 *     id: 'titre-artiste',
 *     kind: 'musique',
 *     title: 'Titre de l’album',
 *     by: 'Artiste',
 *     year: '2026',
 *     note: 'Pourquoi je le recommande, en une ou deux phrases.',
 *     cover: '/covers/finds/titre-artiste.webp',
 *     href: 'https://open.spotify.com/…',
 *   },
 */
export const recentFinds: readonly RecentFind[] = []

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
