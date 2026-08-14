import { Vector3 } from 'three'

/**
 * Simulation du câble en trois dimensions.
 *
 * Même principe que la version 2D : une chaîne de points reliés par des
 * contraintes de distance, intégrée en Verlet. Le Verlet déduit la vitesse de
 * la position précédente, ce qui évite de maintenir un vecteur vitesse et reste
 * stable sur des contraintes rigides comme un câble.
 *
 * Les points sont mutés en place et les vecteurs de travail réutilisés : la
 * boucle tourne à chaque frame, aucune allocation n'y est acceptable.
 */

export interface Point3 {
  readonly position: Vector3
  /** Position à la frame précédente : c'est elle qui porte la vitesse. */
  readonly previous: Vector3
  /** Un point épinglé ne bouge pas — la prise jack, ou le point tenu à la souris. */
  pinned: boolean
}

export interface Cable3DConfig {
  readonly segments: number
  readonly segmentLength: number
  readonly gravity: number
  /** 1 = aucun frottement, 0.9 = câble très mou. */
  readonly damping: number
  /** Passes de résolution. Plus il y en a, moins le câble s'étire. */
  readonly iterations: number
}

export const CABLE_CONFIG: Cable3DConfig = {
  segments: 34,
  segmentLength: 0.17,
  gravity: 0.011,
  damping: 0.97,
  iterations: 7,
}

export function createCable(origin: Vector3, config: Cable3DConfig = CABLE_CONFIG): Point3[] {
  const points: Point3[] = []

  for (let i = 0; i < config.segments; i += 1) {
    // Le câble part vers le bas, légèrement en avant : il pend naturellement
    // au lieu de démarrer parfaitement vertical.
    const position = new Vector3(
      origin.x + i * config.segmentLength * 0.12,
      origin.y - i * config.segmentLength,
      origin.z + i * config.segmentLength * 0.06,
    )

    points.push({
      position,
      previous: position.clone(),
      pinned: i === 0,
    })
  }

  return points
}

// Vecteurs de travail, réutilisés à chaque frame.
const velocity = new Vector3()
const delta = new Vector3()

export function stepCable(points: Point3[], config: Cable3DConfig, dt: number): void {
  for (const point of points) {
    if (point.pinned) continue

    velocity.subVectors(point.position, point.previous).multiplyScalar(config.damping)
    point.previous.copy(point.position)

    point.position.addScaledVector(velocity, dt)
    point.position.y -= config.gravity * dt * dt
  }

  for (let i = 0; i < config.iterations; i += 1) {
    solve(points, config)
  }
}

function solve(points: Point3[], config: Cable3DConfig): void {
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i]
    const b = points[i + 1]
    if (a === undefined || b === undefined) continue

    delta.subVectors(b.position, a.position)
    const distance = delta.length()
    if (distance === 0) continue

    // Écart relatif à la longueur au repos, réparti entre les deux points.
    const difference = (distance - config.segmentLength) / distance
    delta.multiplyScalar(difference * 0.5)

    if (!a.pinned) a.position.add(delta)
    if (!b.pinned) b.position.sub(delta)
  }
}

/** Déplace l'extrémité attachée à la prise jack. */
export function anchorCable(points: Point3[], target: Vector3): void {
  const head = points[0]
  if (head === undefined) return

  head.position.copy(target)
  head.previous.copy(target)
}

/**
 * Trouve le point le plus proche d'une position — utilisé pour attraper le
 * câble à l'endroit exact où l'on clique.
 *
 * Le premier point est exclu : il appartient à la prise et ne doit jamais être
 * saisi, sinon le câble se détacherait du walkman.
 */
export function findClosestPoint(points: Point3[], target: Vector3, maxDistance: number): number {
  let bestIndex = -1
  let bestDistance = maxDistance

  for (let i = 1; i < points.length; i += 1) {
    const point = points[i]
    if (point === undefined) continue

    const distance = point.position.distanceTo(target)
    if (distance < bestDistance) {
      bestDistance = distance
      bestIndex = i
    }
  }

  return bestIndex
}

/** Positions brutes, pour construire la courbe du tube. */
export function toVectors(points: Point3[]): Vector3[] {
  return points.map((point) => point.position)
}
