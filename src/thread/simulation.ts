/**
 * Simulation du fil d'écouteurs.
 *
 * Chaîne de points reliés par des contraintes de distance, intégrée en Verlet.
 * Le Verlet est choisi ici parce qu'il déduit la vitesse de la position
 * précédente : pas de vecteur vitesse à maintenir, et une stabilité naturelle
 * sur des contraintes rigides comme un câble.
 *
 * Aucune dépendance à React, aucune allocation dans la boucle : les points sont
 * mutés en place, car la boucle tourne à chaque frame.
 */

export interface Point {
  x: number
  y: number
  /** Position à la frame précédente : c'est elle qui porte la vitesse. */
  px: number
  py: number
  /** Un point épinglé ne bouge pas — utilisé pour l'ancrage à la cassette. */
  pinned: boolean
}

export interface ThreadConfig {
  /** Nombre de points de la chaîne. Plus il est élevé, plus le fil est souple. */
  readonly segments: number
  /** Distance au repos entre deux points voisins. */
  readonly segmentLength: number
  readonly gravity: number
  /** Amortissement : 1 = aucun frottement, 0.9 = fil très mou. */
  readonly damping: number
  /** Passes de résolution des contraintes. Plus il y en a, plus le fil est rigide. */
  readonly iterations: number
}

export const DEFAULT_CONFIG: ThreadConfig = {
  segments: 44,
  segmentLength: 26,
  gravity: 0.42,
  damping: 0.985,
  iterations: 5,
}

export function createChain(
  startX: number,
  startY: number,
  config: ThreadConfig = DEFAULT_CONFIG,
): Point[] {
  const points: Point[] = []

  for (let i = 0; i < config.segments; i += 1) {
    const y = startY + i * config.segmentLength
    points.push({ x: startX, y, px: startX, py: y, pinned: i === 0 })
  }

  return points
}

/**
 * Avance la simulation d'une frame.
 *
 * `dt` est normalisé autour de 1 pour 60 fps : à 120 Hz il vaut 0.5, ce qui
 * évite qu'un écran rapide rende le fil deux fois plus nerveux.
 */
export function step(points: Point[], config: ThreadConfig, dt: number): void {
  integrate(points, config, dt)

  for (let i = 0; i < config.iterations; i += 1) {
    solveConstraints(points, config)
  }
}

function integrate(points: Point[], config: ThreadConfig, dt: number): void {
  for (const point of points) {
    if (point.pinned) continue

    // Verlet : la vitesse est implicite, déduite de l'écart entre les deux
    // dernières positions.
    const vx = (point.x - point.px) * config.damping
    const vy = (point.y - point.py) * config.damping

    point.px = point.x
    point.py = point.y

    point.x += vx * dt
    point.y += vy * dt + config.gravity * dt * dt
  }
}

function solveConstraints(points: Point[], config: ThreadConfig): void {
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i]
    const b = points[i + 1]
    if (a === undefined || b === undefined) continue

    const dx = b.x - a.x
    const dy = b.y - a.y
    const distance = Math.hypot(dx, dy)
    if (distance === 0) continue

    // Écart relatif à la longueur au repos, réparti entre les deux points.
    const difference = (distance - config.segmentLength) / distance
    const offsetX = dx * 0.5 * difference
    const offsetY = dy * 0.5 * difference

    if (!a.pinned) {
      a.x += offsetX
      a.y += offsetY
    }

    if (!b.pinned) {
      b.x -= offsetX
      b.y -= offsetY
    }
  }
}

/** Déplace l'ancrage du fil — appelé quand la cassette bouge. */
export function anchor(points: Point[], x: number, y: number): void {
  const head = points[0]
  if (head === undefined) return

  head.x = x
  head.y = y
  head.px = x
  head.py = y
}

/**
 * Applique une impulsion horizontale à toute la chaîne.
 * Utilisé au scroll : le fil balance latéralement comme un câble qu'on secoue.
 */
export function impulse(points: Point[], force: number): void {
  for (let i = 1; i < points.length; i += 1) {
    const point = points[i]
    if (point === undefined || point.pinned) continue

    // Les points bas réagissent davantage : l'effet de fouet part du haut.
    const ratio = i / points.length
    point.x += force * ratio
  }
}

/**
 * Construit un tracé SVG lissé passant par les points.
 *
 * Une polyligne donnerait un fil anguleux ; les courbes quadratiques par
 * milieux de segments produisent une continuité douce sans coûter cher.
 */
export function toPath(points: Point[]): string {
  const first = points[0]
  if (first === undefined) return ''
  if (points.length < 3) {
    const last = points[points.length - 1]
    return last === undefined ? '' : `M ${first.x} ${first.y} L ${last.x} ${last.y}`
  }

  let path = `M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`

  for (let i = 1; i < points.length - 1; i += 1) {
    const current = points[i]
    const next = points[i + 1]
    if (current === undefined || next === undefined) continue

    const midX = (current.x + next.x) * 0.5
    const midY = (current.y + next.y) * 0.5
    path += ` Q ${current.x.toFixed(2)} ${current.y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`
  }

  const last = points[points.length - 1]
  if (last !== undefined) {
    path += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`
  }

  return path
}
