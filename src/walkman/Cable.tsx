import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { CatmullRomCurve3, TubeGeometry, Vector3 } from 'three'

/** Rayon du tube, en unités de scène. */
const TUBE_RADIUS = 0.032
/** Segments le long de la courbe : assez pour que les ondulations soient lisses. */
const TUBE_SEGMENTS = 96
const TUBE_RADIAL_SEGMENTS = 10

interface CableProps {
  /** Point de départ : la prise, sous le walkman. */
  readonly start: readonly [number, number, number]
  /** Amplitude horizontale des ondulations, en unités. */
  readonly sway?: number
  /** Hauteur totale de la descente, en unités. */
  readonly drop?: number
  readonly color: string
}

/**
 * Le câble des écouteurs, en volume et immobile.
 *
 * La géométrie est construite une seule fois et jamais recalculée : il n'y a ni
 * simulation, ni boucle de rendu. Un câble figé mais bien dessiné donne plus de
 * vie qu'un câble animé mal contrôlé — et surtout, il est identique à chaque
 * chargement, ce que les versions simulées n'ont jamais été.
 *
 * Le mouvement est dans le tracé, pas dans le temps : les ondulations
 * s'élargissent en descendant, comme un fil qui pend librement.
 */
export function Cable({ start, sway = 0.75, drop = 9, color }: CableProps) {
  const invalidate = useThree((state) => state.invalidate)

  // La couleur suit la face du site. Sans boucle de rendu, le changement doit
  // être signalé explicitement pour être affiché.
  useEffect(() => invalidate(), [color, invalidate])

  const geometry = useMemo(() => {
    const [x, y, z] = start

    /*
     * Points de contrôle du zigzag. L'alternance des signes crée les
     * ondulations ; le facteur croissant les élargit vers le bas, ce qui donne
     * l'impression d'un câble libre plutôt que d'une sinusoïde régulière.
     */
    const waves = [
      { t: 0, offset: 0, depth: 0 },
      { t: 0.12, offset: 0.35, depth: 0.18 },
      { t: 0.28, offset: -0.7, depth: -0.12 },
      { t: 0.45, offset: 0.85, depth: 0.22 },
      { t: 0.62, offset: -0.6, depth: -0.15 },
      { t: 0.78, offset: 0.5, depth: 0.1 },
      { t: 1, offset: -0.25, depth: 0 },
    ]

    const points = waves.map((wave) => {
      // Les premières ondulations restent serrées près de la prise, les
      // suivantes s'ouvrent : un câble ne s'écarte pas brutalement de son point
      // d'attache.
      const spread = Math.min(1, wave.t * 2.2)

      return new Vector3(
        x + wave.offset * sway * spread,
        y - wave.t * drop,
        z + wave.depth * sway * spread,
      )
    })

    const curve = new CatmullRomCurve3(points)
    return new TubeGeometry(curve, TUBE_SEGMENTS, TUBE_RADIUS, TUBE_RADIAL_SEGMENTS, false)
  }, [start, sway, drop])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.62} metalness={0.05} />
    </mesh>
  )
}
