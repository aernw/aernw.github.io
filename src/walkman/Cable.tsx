import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { CatmullRomCurve3, Mesh, Plane, Raycaster, TubeGeometry, Vector2, Vector3 } from 'three'
import {
  CABLE_CONFIG,
  anchorCable,
  createCable,
  findClosestPoint,
  stepCable,
  toVectors,
} from '../thread/simulation3d'
import type { Point3 } from '../thread/simulation3d'

/** Rayon du tube, en unités de scène. */
const TUBE_RADIUS = 0.028
/** Segments le long de la courbe. Au-delà, le gain visuel ne paie plus le coût. */
const TUBE_SEGMENTS = 64
const TUBE_RADIAL_SEGMENTS = 8
/** Distance maximale pour attraper le câble. */
const GRAB_RADIUS = 0.45

interface CableProps {
  /** Position de la prise jack, en coordonnées de scène. */
  readonly anchorRef: { current: Vector3 }
  readonly color: string
}

/**
 * Le câble des écouteurs, en volume.
 *
 * Rendu en tube reconstruit à chaque frame depuis la simulation Verlet. Un tube
 * 3D permet ce qu'un tracé SVG ne pourra jamais faire : passer devant et
 * derrière le walkman selon sa position, et recevoir les ombres de la scène.
 *
 * On peut l'attraper à la souris : le point le plus proche du curseur est
 * épinglé et suit le déplacement, la physique s'occupe du reste. Le premier
 * point est exclu de la saisie — il appartient à la prise.
 */
export function Cable({ anchorRef, color }: CableProps) {
  const meshRef = useRef<Mesh>(null)
  const { camera, size } = useThree()

  const points = useMemo<Point3[]>(() => createCable(anchorRef.current), [anchorRef])

  /**
   * Le câble n'est simulé qu'une fois la prise localisée.
   *
   * Au montage, l'ancrage vaut encore (0,0,0) : démarrer là ferait partir le
   * câble de l'origine, très loin du walkman, et il s'étirerait sur des dizaines
   * d'unités avant de rattraper sa position réelle.
   */
  const initialised = useRef(false)

  // Index du point tenu à la souris, -1 quand le câble est libre.
  const grabbedIndex = useRef(-1)

  // Objets de travail, réutilisés à chaque frame.
  const raycaster = useMemo(() => new Raycaster(), [])
  const pointer = useMemo(() => new Vector2(), [])
  const dragPlane = useMemo(() => new Plane(), [])
  const dragTarget = useMemo(() => new Vector3(), [])
  const planeNormal = useMemo(() => new Vector3(), [])

  /** Projette la position écran du curseur sur le plan de travail du câble. */
  const projectPointer = (clientX: number, clientY: number, out: Vector3): boolean => {
    const rect = document.body.getBoundingClientRect()
    pointer.set(
      ((clientX - rect.left) / size.width) * 2 - 1,
      -((clientY - rect.top) / size.height) * 2 + 1,
    )
    raycaster.setFromCamera(pointer, camera)

    // Plan face à la caméra, passant par la prise : le câble se manipule dans
    // le plan où il vit, sans partir vers l'infini en profondeur.
    camera.getWorldDirection(planeNormal)
    dragPlane.setFromNormalAndCoplanarPoint(planeNormal, anchorRef.current)

    return raycaster.ray.intersectPlane(dragPlane, out) !== null
  }

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!projectPointer(event.clientX, event.clientY, dragTarget)) return

    const index = findClosestPoint(points, dragTarget, GRAB_RADIUS)
    if (index === -1) return

    // Le geste appartient au câble : il ne doit pas aussi faire pivoter le walkman.
    event.stopPropagation()
    grabbedIndex.current = index

    const grabbed = points[index]
    if (grabbed !== undefined) grabbed.pinned = true
  }

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (grabbedIndex.current === -1) return
    event.stopPropagation()

    if (!projectPointer(event.clientX, event.clientY, dragTarget)) return

    const grabbed = points[grabbedIndex.current]
    if (grabbed === undefined) return

    grabbed.position.copy(dragTarget)
    grabbed.previous.copy(dragTarget)
  }

  const release = () => {
    const index = grabbedIndex.current
    if (index === -1) return

    const grabbed = points[index]
    if (grabbed !== undefined) grabbed.pinned = false
    grabbedIndex.current = -1
  }

  // Un relâchement hors du câble doit aussi le libérer, sinon il reste collé
  // au curseur après que la souris a quitté la zone.
  useEffect(() => {
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    return () => {
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
  }, [])

  useFrame((_, rawDelta) => {
    const mesh = meshRef.current
    if (mesh === null) return

    const anchor = anchorRef.current

    // Tant que la prise n'est pas localisée, il n'y a rien à simuler.
    if (anchor.lengthSq() === 0) return

    // Au premier ancrage valide, le câble est replacé d'un coup sous la prise
    // plutôt que de s'y traîner depuis l'origine.
    if (!initialised.current) {
      initialised.current = true
      points.forEach((point, index) => {
        point.position.set(
          anchor.x + index * 0.02,
          anchor.y - index * 0.17,
          anchor.z + index * 0.01,
        )
        point.previous.copy(point.position)
      })
    }

    // Borné : un onglet revenant d'arrière-plan produit un delta énorme qui
    // ferait exploser la simulation.
    const dt = Math.min(2.5, rawDelta * 60)

    anchorCable(points, anchor)
    stepCable(points, CABLE_CONFIG, dt)

    // La géométrie est reconstruite à chaque frame et l'ancienne libérée :
    // sans ce dispose, on fuit la mémoire GPU en quelques secondes.
    const curve = new CatmullRomCurve3(toVectors(points))
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
    <mesh
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={release}
    >
      <meshStandardMaterial color={color} roughness={0.55} metalness={0.1} />
    </mesh>
  )
}
