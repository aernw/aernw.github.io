import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Box3, Vector3 } from 'three'

/**
 * Sonde de cadrage, temporaire.
 *
 * Projette la boîte englobante de la scène en coordonnées écran normalisées et
 * publie le résultat sur `window.__framing`. Une boîte dans [0,1]² est visible ;
 * au-delà, l'objet déborde ou sort du champ.
 *
 * Cette mesure existe parce que la vérification visuelle est peu fiable dans mon
 * environnement de test : l'onglet suspend le rendu dès qu'il passe en
 * arrière-plan. Mesurer répond sans ambiguïté à « l'objet est-il dans le
 * cadre ? », là où une capture d'écran vide ne dit pas si le défaut vient du
 * code ou du navigateur.
 *
 * Conservée volontairement : elle est derrière `import.meta.env.DEV` et absente
 * du bundle de production (vérifié), et elle resservira à chaque retouche du
 * cadrage ou de la disposition des objets de fond.
 */

/** Noms des groupes du hero, selon la face affichée. */
const HERO_GROUP_NAMES = ['computer-hero', 'walkman-hero'] as const

export function FramingProbe() {
  const { camera, scene, gl } = useThree()

  useEffect(() => {
    // Laisser le temps au GLB de se charger et à la scène de se composer.
    const timer = window.setTimeout(() => {
      const box = new Box3()

      // La sonde ne mesure QUE le cœur du hero, jamais les cassettes du
      // sketchbook : celles-ci sont posées volontairement hors du cadre, et les
      // inclure ferait conclure à un mauvais cadrage.
      const hero = HERO_GROUP_NAMES.map((name) => scene.getObjectByName(name)).find(Boolean)

      if (hero === undefined) {
        Object.assign(window, {
          __framing: { erreur: `aucun groupe hero trouvé (${HERO_GROUP_NAMES.join(', ')})` },
        })
        return
      }

      hero.traverse((object) => {
        if ((object as { isMesh?: boolean }).isMesh === true) {
          box.expandByObject(object)
        }
      })

      if (box.isEmpty()) {
        Object.assign(window, { __framing: { erreur: 'aucun mesh dans le groupe du hero' } })
        return
      }

      const size = box.getSize(new Vector3())
      const center = box.getCenter(new Vector3())

      // Les huit coins, pour connaître l'emprise réelle à l'écran.
      const corners: Vector3[] = []
      for (const x of [box.min.x, box.max.x]) {
        for (const y of [box.min.y, box.max.y]) {
          for (const z of [box.min.z, box.max.z]) {
            corners.push(new Vector3(x, y, z).project(camera))
          }
        }
      }

      const xs = corners.map((c) => c.x)
      const ys = corners.map((c) => c.y)

      // De l'espace projeté [-1, 1] vers des fractions d'écran [0, 1].
      const left = (Math.min(...xs) + 1) / 2
      const right = (Math.max(...xs) + 1) / 2
      const bottom = (1 - Math.max(...ys)) / 2
      const top = (1 - Math.min(...ys)) / 2

      const round = (value: number) => Math.round(value * 100) / 100

      Object.assign(window, {
        __framing: {
          ecran: { gauche: round(left), droite: round(right), haut: round(bottom), bas: round(top) },
          dansLeCadre: left > -0.05 && right < 1.05 && bottom > -0.05 && top < 1.05,
          largeurOccupee: `${Math.round((right - left) * 100)} %`,
          tailleScene: size.toArray().map((n) => round(n)),
          centreScene: center.toArray().map((n) => round(n)),
          triangles: gl.info.render.triangles,
        },
      })
    }, 1200)

    return () => window.clearTimeout(timer)
  }, [camera, scene, gl])

  return null
}
