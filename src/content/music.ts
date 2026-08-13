/**
 * Contenu musical de la face B.
 *
 * Ce fichier est fait pour être édité souvent — c'est la partie vivante du site.
 * Voir le guide « Tenir le site à jour » dans le README pour la marche à suivre.
 *
 * Les pochettes sont des URLs externes (Spotify, Discogs, Bandcamp…). Elles doivent
 * être en HTTPS, sans quoi le navigateur les bloquera. Une image qui casse est
 * remplacée automatiquement par les initiales de l'artiste : la mise en page ne
 * s'effondre jamais.
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
  // {
  //   id: 'un-identifiant-unique',
  //   artist: "Nom de l'artiste",
  //   title: "Titre de l'album",
  //   year: '2025',
  //   note: "Ce qui t'a marqué : une production, une texture, un morceau précis.",
  //   // note : les chaînes contenant une apostrophe doivent être entre guillemets doubles.
  //   discovered: '2026-08',
  //   cover: 'https://…',
  //   href: 'https://…',
  // },
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
export const topAlbums: readonly FavouriteAlbum[] = []

export interface FavouriteArtist {
  readonly id: string
  readonly name: string
  readonly note?: string
  readonly href?: string
}

/** TODO Erwan : ton top artistes, dans l'ordre. */
export const topArtists: readonly FavouriteArtist[] = []

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
export const vinyls: readonly Vinyl[] = []
