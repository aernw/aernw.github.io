import { useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { Box3, Group, MathUtils, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'

const MODEL_URLS = {
  walkman: `${import.meta.env.BASE_URL}models/walkman.glb`,
  computer: `${import.meta.env.BASE_URL}models/macbook_air_m2.glb`,
} as const

interface WalkmanModelProps {
  /** Rotation fixe de l'objet, en radians. */
  readonly rotation: readonly [number, number, number]
  readonly asset: keyof typeof MODEL_URLS
  readonly targetSize?: number
  readonly hovered: boolean
  readonly pressed: boolean
  readonly pulseTick: number
}

/**
 * Le modèle 3D principal du hero, qui peut être un walkman ou un ordinateur.
 *
 * On le normalise à une taille cible calculée depuis sa boîte englobante afin
 * d'obtenir le même cadrage localement et sur GitHub Pages.
 */
export function WalkmanModel({ rotation, asset, targetSize = 2.4, hovered, pressed, pulseTick }: WalkmanModelProps) {
  const { scene } = useGLTF(MODEL_URLS[asset])
  const invalidate = useThree((state) => state.invalidate)
  const animatedGroup = useRef<Group>(null)
  const pulseTimer = useRef<number | null>(null)
  const [pulsing, setPulsing] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const model = useMemo(() => {
    const clone = scene.clone(true)
    const box = new Box3().setFromObject(clone)
    const size = new Vector3()
    box.getSize(size)

    const maxDimension = Math.max(size.x, size.y, size.z) || 1
    const scale = targetSize / maxDimension

    clone.scale.setScalar(scale)
    return clone
  }, [scene, targetSize])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => setPrefersReducedMotion(media.matches)

    sync()
    media.addEventListener('change', sync)

    return () => {
      media.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      setPulsing(false)
      return
    }

    setPulsing(true)

    if (pulseTimer.current !== null) {
      window.clearTimeout(pulseTimer.current)
    }

    pulseTimer.current = window.setTimeout(() => {
      setPulsing(false)
      pulseTimer.current = null
    }, 190)

    return () => {
      if (pulseTimer.current !== null) {
        window.clearTimeout(pulseTimer.current)
      }
    }
    // Le modèle change de face quand l'asset ou le pulse changent : on rejoue
    // un petit impact pour rendre la bascule plus vivante.
  }, [asset, pulseTick, prefersReducedMotion])

  useEffect(() => {
    invalidate()
  }, [hovered, pressed, pulsing, invalidate])

  useFrame((_, delta) => {
    if (prefersReducedMotion) {
      return
    }

    const group = animatedGroup.current

    if (group === null) {
      return
    }

    const scaleTarget = pulsing ? 1.08 : hovered ? 1.03 : 1
    const tiltTargetX = pressed ? 0.08 : hovered ? 0.025 : 0
    const tiltTargetZ = pressed ? -0.06 : hovered ? 0.015 : 0
    const swayTargetY = pressed ? 0.14 : hovered ? 0.06 : 0
    const lerpFactor = 1 - Math.exp(-delta * 10)

    group.scale.x = MathUtils.lerp(group.scale.x, scaleTarget, lerpFactor)
    group.scale.y = MathUtils.lerp(group.scale.y, scaleTarget, lerpFactor)
    group.scale.z = MathUtils.lerp(group.scale.z, scaleTarget, lerpFactor)
    group.rotation.x = MathUtils.lerp(group.rotation.x, tiltTargetX, lerpFactor)
    group.rotation.y = MathUtils.lerp(group.rotation.y, swayTargetY, lerpFactor)
    group.rotation.z = MathUtils.lerp(group.rotation.z, tiltTargetZ, lerpFactor)

    const needsAnotherFrame =
      Math.abs(group.scale.x - scaleTarget) > 0.001 ||
      Math.abs(group.rotation.x - tiltTargetX) > 0.001 ||
      Math.abs(group.rotation.y - swayTargetY) > 0.001 ||
      Math.abs(group.rotation.z - tiltTargetZ) > 0.001

    if (needsAnotherFrame) {
      invalidate()
    }
  })

  return (
    <group rotation={rotation as unknown as [number, number, number]}>
      <group ref={animatedGroup}>
        <primitive object={model} />
      </group>
    </group>
  )
}

// Préchargés dès l'évaluation du module, c'est-à-dire au chargement différé de
// la scène — jamais avant.
useGLTF.preload(MODEL_URLS.walkman)
useGLTF.preload(MODEL_URLS.computer)
