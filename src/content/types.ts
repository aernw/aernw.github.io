/**
 * Types du contenu du portfolio.
 *
 * Le site a deux côtés, comme un disque : « Pro » et « Perso ». Chaque contenu
 * déclare le ou les côtés où il apparaît.
 */


export type Side = 'a' | 'b'

export interface Link {
  readonly label: string
  readonly href: string
}

export interface Project {
  readonly id: string
  readonly name: string
  readonly tagline: string
  readonly description: string
  readonly role: string
  readonly metrics?: readonly string[]
  readonly stack: readonly string[]
  readonly links: readonly Link[]
  readonly year: string
  readonly sides: readonly Side[]
  readonly accent?: string
  readonly logo?: string
  readonly cover?: string
}

export interface Experience {
  readonly id: string
  readonly role: string
  readonly company: string
  /** Logo de l'entreprise, affiché dans une tuile blanche devant l'intitulé du poste. */
  readonly logo?: string
  /**
   * Fond de la tuile, pour un logo dessiné sur un aplat : sa couleur prolonge
   * l'aplat jusqu'aux bords, sans liseré blanc. Blanc par défaut.
   */
  readonly logoBackground?: string
  readonly location: string
  readonly period: string
  /** Une phrase : ce qui est affiché dans la section Parcours. */
  readonly brief: string
  /** Version longue, gardée pour référence (CV, futures pages). */
  readonly summary: string
  readonly highlights: readonly string[]
  /** Les premières technologies sont affichées en étiquettes : mets les plus parlantes en tête. */
  readonly stack?: readonly string[]
}

export interface Education {
  readonly id: string
  readonly school: string
  /** Logo de l'école, affiché dans une tuile blanche à gauche du nom. */
  readonly logo?: string
  readonly detail: string
  readonly period: string
}

export interface SkillGroup {
  readonly id: string
  readonly label: string
  readonly items: readonly string[]
}

/** Expérience du lab : petit, curieux, sans prétention de produit fini. */
export interface Profile {
  readonly name: string
  readonly title: string
  readonly location: string
  readonly email: string
  readonly availability: string
  readonly summary: string
  readonly links: readonly Link[]
}
