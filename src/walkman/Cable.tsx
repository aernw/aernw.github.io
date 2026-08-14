import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CatmullRomCurve3, Mesh, TubeGeometry, Vector3 } from 'three'

/** Rayon du tube, en unités de scène. */
const TUBE_RADIUS = 0.03
/** Segments le long de la courbe. Au-delà, le gain visuel ne paie plus le coût. */
const TUBE_SEGMENTS = 48
const TUBE_RADIAL_SEGMENTS = 8

/** Points de contrôle de la courbe. Peu nombreux : le tracé doit rester lisible. */
const CONTROL_POINTS = 7

/** Amplitude du balancement, en unités de scène. */
const SWAY_X = 0.55
const SWAY_Z = 0.35
/** Vitesse du balancement. Lente : le câble pend, il ne s'agite pas. */
const SWAY_SPEED = 0.45

interface CableProps {
  /** Position du point de branchement sur le walkman. */
  readonly anchorRef: { current: Vector3 }
  /** Extrémité basse du câble, fixe — le câble descend hors de l'écran. */
  readonly endPoint: readonly [number, number, number]
  readonly color: string
}

/**
 * Le câble des écouteurs, en volume.
 *
 * Volontairement sans simulation physique : une chaîne de points libre partait
 * en vrille dès que son ancrage bougeait, et rendait la scène illisible. Ici la
 * courbe est déterministe — deux extrémités fixes et un balancement sinusoïdal
 * entre les deux — donc toujours stable et prévisible.
 *
 * Le balancement s'atténue vers les extrémités : un câble tendu ne bouge pas à
 * ses points d'attache.
 */
export function Cable({ anchorRef, endPoint, color }: CableProps) {
  const meshRef = useRef<Mesh>(null)

  // Points de contrôle réutilisés à chaque frame : la courbe est reconstruite
  // en continu, aucune allocation n'est acceptable dans la boucle.
  const points = useMemo(
    () => Array.from({ length: CONTROL_POINTS }, () => new Vector3()),
    [],
  )
  const curve = useMemo(() => new CatmullRomCurve3(points), [points])
  const end = useMemo(() => new Vector3(...endPoint), [endPoint])
  const elapsed = useRef(0)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (mesh === null) return

    if (!reducedMotion.current) {
      elapsed.current += delta * SWAY_SPEED
    }

    const start = anchorRef.current
    const time = elapsed.current

    for (let i = 0; i < CONTROL_POINTS; i += 1) {
      const t = i / (CONTROL_POINTS - 1)
      const point = points[i]
      if (point === undefined) continue

      // Interpolation entre les deux extrémités fixes.
      point.lerpVectors(start, end, t)

      // Le balancement est nul aux extrémités et maximal au milieu.
      const amplitude = Math.sin(t * Math.PI)

      point.x += Math.sin(time + t * 2.2) * SWAY_X * amplitude
      point.z += Math.cos(time * 0.8 + t * 1.7) * SWAY_Z * amplitude
      // Léger ventre vers le bas : le câble pend sous son propre poids.
      point.y -= amplitude * 0.35
    }

    curve.updateArcLengths()

    // La géométrie est reconstruite à chaque frame et l'ancienne libérée :
    // sans ce dispose, on fuit la mémoire GPU en quelques secondes.
    const geometry = new TubeGeometry(
      curve,
      TUBE_SEGMENTS,
      TUBE_RADIUS,
      TUBE_RADIAL_SEGMENTS,
      false,
    )

    mesh.geometry.dispose()
    mesh.geometry = geometry
  })

  return (
    <mesh ref={meshRef}>
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} />
    </mesh>
  )
}
