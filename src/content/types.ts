/**
 * Types du contenu du portfolio.
 *
 * Le site a deux faces (comme une cassette) : la face A est professionnelle,
 * la face B est artistique. Chaque contenu déclare la ou les faces où il apparaît.
 */

export type Side = 'a' | 'b'

/** Niveau de mise en avant d'un projet dans la grille. */
export type ProjectEmphasis = 'feature' | 'standard' | 'compact'

export interface Link {
  readonly label: string
  readonly href: string
}

/**
 * Visuel d'un projet.
 * - `sprites` : images détourées qui flottent, pour les projets ayant leurs
 *   propres assets (R-Type et ses vaisseaux).
 * - `image`   : une capture d'écran classique.
 * - `none`    : la couleur d'accent porte seule l'identité du projet.
 */
export type ProjectVisual =
  | { readonly kind: 'sprites'; readonly sources: readonly string[] }
  | { readonly kind: 'image'; readonly src: string; readonly alt: string }
  | { readonly kind: 'none' }

export interface Project {
  readonly id: string
  readonly name: string
  /** Une ligne : le problème résolu, pas la stack. */
  readonly tagline: string
  /** 2-4 phrases : le contexte, le problème, ce qui a été construit. */
  readonly description: string
  /** Rôle exact et honnête, y compris la taille de l'équipe. */
  readonly role: string
  /** Chiffres vérifiables (commits, PR, échelle). Affichés tels quels. */
  readonly metrics?: readonly string[]
  readonly stack: readonly string[]
  readonly links: readonly Link[]
  readonly year: string
  readonly emphasis: ProjectEmphasis
  readonly sides: readonly Side[]
  /**
   * Teinte propre au projet, reprise de son identité réelle quand elle existe.
   * Utilisée par petites touches (halo, filet, survol) — jamais en fond plein,
   * pour ne pas casser la continuité de surface du site.
   */
  readonly accent?: string
  readonly visual?: ProjectVisual
}

export interface Experience {
  readonly id: string
  readonly role: string
  readonly company: string
  readonly location: string
  readonly period: string
  readonly summary: string
  readonly highlights: readonly string[]
  readonly stack?: readonly string[]
}

export interface Education {
  readonly id: string
  readonly school: string
  readonly detail: string
  readonly period: string
}

export interface SkillGroup {
  readonly id: string
  readonly label: string
  readonly items: readonly string[]
}

/** Expérience du lab : petit, curieux, sans prétention de produit fini. */
export interface LabItem {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly stack: readonly string[]
  readonly links: readonly Link[]
}

export interface Profile {
  readonly name: string
  readonly title: string
  readonly location: string
  readonly email: string
  readonly availability: string
  readonly summary: string
  readonly links: readonly Link[]
}
