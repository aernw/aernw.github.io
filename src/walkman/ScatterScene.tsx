import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { ScatteredObjects } from './ScatteredObjects'
import './ScatterScene.css'

/**
 * Combien d'unités de scène la caméra parcourt pour un écran de défilement.
 *
 * À z=6 avec un fov de 38°, la hauteur visible vaut 2 × tan(19°) × 6 ≈ 4,13
 * unités. Faire correspondre un écran de scroll à cette valeur donne un
 * défilement au même rythme que la page : les objets se comportent comme s'ils
 * y étaient posés, sans effet de parallaxe.
 */
const UNITS_PER_VIEWPORT = 4.13

/**
 * Fait défiler la caméra avec la page.
 *
 * Le canvas étant fixé au viewport, c'est la caméra qui doit bouger pour que
 * les objets paraissent ancrés dans la page.
 *
 * Le rendu reste à la demande : `invalidate()` n'est appelé que lorsque la
 * position a réellement changé. Immobile, la scène ne consomme rien — la
 * garantie de `frameloop="demand"` est préservée hors défilement.
 */
function ScrollCamera() {
  const invalidate = useThree((state) => state.invalidate)
  const camera = useThree((state) => state.camera)

  useEffect(() => {
    let frame = 0
    let lastY = -1

    const apply = () => {
      frame = 0
      const y = window.scrollY

      if (y === lastY) {
        return
      }

      lastY = y
      camera.position.y = -(y / window.innerHeight) * UNITS_PER_VIEWPORT
      invalidate()
    }

    // Le scroll émet bien plus souvent que le taux de rafraîchissement : on
    // n'en garde qu'un par frame.
    const onScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(apply)
      }
    }

    apply()

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', apply)
    window.addEventListener('resize', apply)
    window.addEventListener('pageshow', apply)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', apply)
      window.removeEventListener('resize', apply)
      window.removeEventListener('pageshow', apply)
    }
  }, [camera, invalidate])

  return null
}

/**
 * Seconde scène 3D, dédiée aux objets de fond du reste de la page.
 *
 * Elle existe parce que la scène du hero ne peut pas grandir : sa caméra a un
 * fov vertical fixe, donc étirer son canvas en hauteur rétrécit la largeur
 * visible et fait déborder le walkman (mesuré : 140 % de la largeur à 260vh).
 * Agrandir la première scène et y descendre des objets était donc une impasse.
 *
 * Cette scène-ci n'a pas cette contrainte : rien n'y est cadré au pixel près,
 * seulement des objets dispersés. Elle peut donc couvrir toute la hauteur
 * restante de la page.
 *
 * Comme la première, elle est entièrement statique et n'intercepte aucun
 * événement.
 */
export function ScatterScene() {
  return (
    <div className="scatter-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 38 }}
        frameloop="demand"
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 6]} intensity={2.3} />
        <directionalLight position={[-4, 0, -2]} intensity={0.5} />

        <ScrollCamera />

        <Suspense fallback={null}>
          <ScatteredObjects />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}
