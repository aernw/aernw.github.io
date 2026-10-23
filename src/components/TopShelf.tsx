import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Cover } from './Cover'
import type { FavouriteAlbum, FavouriteArtist } from '../content'
import './TopShelf.css'

interface TopShelfProps {
  readonly albums: readonly FavouriteAlbum[]
  readonly artists: readonly FavouriteArtist[]
}

/** Albums par planche : deux rangées de cinq pour un top 10. */
const PER_SHELF = 5

/**
 * Le top de tous les temps, en pochettes posées face à nous sur des planches
 * en verre. Un clic sur une pochette l'ouvre : le vinyle sort, avec le rang,
 * l'artiste, l'année et la note. On passe d'un album à l'autre sans refermer.
 * Les artistes suivent, en portraits ronds.
 */
export function TopShelf({ albums, artists }: TopShelfProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  const current = open === null ? undefined : albums[open]

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog === null) return
    if (open !== null && !dialog.open) dialog.showModal()
    if (open === null && dialog.open) dialog.close()
  }, [open])

  const shelves: FavouriteAlbum[][] = []
  for (let start = 0; start < albums.length; start += PER_SHELF) {
    shelves.push(albums.slice(start, start + PER_SHELF))
  }

  const step = (delta: number) =>
    setOpen((index) => (index === null ? null : (index + delta + albums.length) % albums.length))

  // Un clic sur le voile (le <dialog> lui-même, hors du panneau) referme.
  const handleBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) setOpen(null)
  }

  return (
    <>
      <h3 className="eyebrow top__label">Albums</h3>
      <div className="top-shelves">
        {shelves.map((shelf, row) => (
          <ol key={row} className="top-shelf" start={row * PER_SHELF + 1}>
            {shelf.map((album, column) => {
              const index = row * PER_SHELF + column
              return (
                <li key={album.id}>
                  <button type="button" className="top-sleeve" onClick={() => setOpen(index)}>
                    <Cover src={album.cover} title={album.title} subtitle={album.artist} alt="" />
                    <span className="top-sleeve__rank" aria-hidden="true">
                      N° {index + 1}
                    </span>
                    <span className="visually-hidden">
                      N° {index + 1} : {album.title}, {album.artist}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        ))}
      </div>

      {artists.length > 0 ? (
        <>
          <h3 className="eyebrow top__label top__label--artists">Artistes</h3>
          <ol className="top-artists">
            {artists.map((artist, index) => (
              <li key={artist.id} className="top-artist">
                <Cover src={artist.cover} title={artist.name} subtitle={artist.name} alt="" />
                <span className="top-artist__name">
                  <span className="visually-hidden">N° {index + 1} : </span>
                  {artist.name}
                </span>
              </li>
            ))}
          </ol>
        </>
      ) : null}

      <dialog
        ref={dialogRef}
        className="top-dialog"
        aria-labelledby="top-dialog-title"
        onClose={() => setOpen(null)}
        onClick={handleBackdrop}
      >
        {current === undefined || open === null ? null : (
          <div className="top-dialog__panel glass" key={current.id}>
            <div className="top-dialog__art">
              <span className="top-dialog__vinyl" aria-hidden="true">
                {current.cover === undefined ? null : <img src={current.cover} alt="" />}
              </span>
              <Cover src={current.cover} title={current.title} subtitle={current.artist} />
            </div>

            <div className="top-dialog__info">
              <p className="top-dialog__rank">N° {open + 1}</p>
              <h3 id="top-dialog-title" className="top-dialog__title">
                {current.title}
              </h3>
              <p className="top-dialog__meta">
                {current.artist}  ·  {current.year}
              </p>
              {/* Une note vide ne laisse pas de cadre vide : rien n'est affiché. */}
              {current.note && current.note.trim().length > 0 ? (
                <p className="top-dialog__note">« {current.note.trim()} »</p>
              ) : null}

              <div className="top-dialog__nav">
                <button type="button" onClick={() => step(-1)}>
                  ‹ N° {((open - 1 + albums.length) % albums.length) + 1}
                </button>
                <button type="button" onClick={() => step(1)}>
                  N° {((open + 1) % albums.length) + 1} ›
                </button>
              </div>
            </div>

            <button type="button" className="top-dialog__close" onClick={() => setOpen(null)}>
              <span aria-hidden="true">×</span>
              <span className="visually-hidden">Fermer</span>
            </button>
          </div>
        )}
      </dialog>
    </>
  )
}
