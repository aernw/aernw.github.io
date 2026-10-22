import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent, ReactElement } from 'react'
import type { Project } from '../content'
import { ProjectNotes } from './ProjectNotes'
import { ProjectSleeve, sleeveId } from './ProjectSleeve'
import './ProjectCrate.css'

interface ProjectCrateProps {
  readonly projects: readonly Project[]
}

/** Nombre de colonnes réellement tracées par la grille, quelle que soit la règle CSS qui les produit. */
function countColumns(grid: HTMLElement): number {
  const tracks = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean)
  return Math.max(1, tracks.length)
}

/**
 * Le bac à disques : les projets en pochettes, rangée par rangée.
 *
 * Une seule pochette est ouverte à la fois. Ses notes se déploient sous sa
 * rangée, en pleine largeur — pour savoir où s'arrête une rangée, le bac lit
 * le nombre de colonnes que la grille CSS a tracées, et le relit quand sa
 * largeur change.
 *
 * Échap referme les notes et rend le focus à la pochette.
 */
export function ProjectCrate({ projects }: ProjectCrateProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState(1)
  const [openId, setOpenId] = useState<string | null>(null)

  // Avant la première peinture : sans cela, la grille s'afficherait une fois
  // avec un panneau après chaque pochette, donc une pochette par rangée.
  useLayoutEffect(() => {
    const grid = gridRef.current
    if (grid === null) return

    const update = () => setColumns(countColumns(grid))
    update()

    const observer = new ResizeObserver(update)
    observer.observe(grid)
    return () => observer.disconnect()
  }, [])

  const toggle = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id))
  }, [])

  // Le panneau devient inerte en se fermant : le focus qu'il contenait serait
  // perdu, d'où le retour explicite sur la pochette.
  const close = useCallback(() => {
    if (openId !== null) document.getElementById(sleeveId(openId))?.focus()
    setOpenId(null)
  }, [openId])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && openId !== null) {
      event.preventDefault()
      close()
    }
  }

  const cells: ReactElement[] = []

  for (let start = 0; start < projects.length; start += columns) {
    const row = projects.slice(start, start + columns)
    const panelId = `notes-rangee-${start / columns + 1}`

    row.forEach((project) => {
      cells.push(
        <ProjectSleeve
          key={project.id}
          project={project}
          expanded={project.id === openId}
          controls={panelId}
          onToggle={() => toggle(project.id)}
        />,
      )
    })

    cells.push(
      <ProjectNotes
        // Les rangées changent de composition avec le nombre de colonnes :
        // un panneau neuf évite d'y garder le projet d'une ancienne rangée.
        key={`${panelId}-${columns}`}
        id={panelId}
        project={row.find((project) => project.id === openId) ?? null}
        onClose={close}
      />,
    )
  }

  return (
    <div
      ref={gridRef}
      className={`crate${openId === null ? '' : ' crate--open'}`}
      onKeyDown={handleKeyDown}
    >
      {cells}
    </div>
  )
}
