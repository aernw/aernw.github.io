import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import { Cover } from './Cover'
import { releasesOf } from '../content'
import type { AlbumRelease, FavouriteAlbum, FavouriteArtist } from '../content'
import './TopShelf.css'

interface TopShelfProps {
  readonly albums: readonly FavouriteAlbum[]
  readonly artists: readonly FavouriteArtist[]
}

/** Albums par planche : trois rangées de cinq pour un top 15. */
const PER_SHELF = 5

/**
 * Au-delà de 12 producteurs (une mixtape en compte parfois des dizaines), seuls
 * les 10 plus présents sont nommés, suivis du nombre des autres.
 */
const PRODUCERS_MAX = 12
const PRODUCERS_SHOWN = 10

function listProducers(producers: readonly string[]): string {
  if (producers.length <= PRODUCERS_MAX) return producers.join(', ')
  const rest = producers.length - PRODUCERS_SHOWN
  return `${producers.slice(0, PRODUCERS_SHOWN).join(', ')} et ${rest} autres`
}

/** Place d'une pochette dans une pile : la première devant, les suivantes derrière. */
type StackStyle = CSSProperties & { readonly '--i': number; readonly '--n': number }

const dateFormats = {
  1: { year: 'numeric' },
  2: { month: 'long', year: 'numeric' },
  3: { day: 'numeric', month: 'long', year: 'numeric' },
} as const satisfies Record<number, Intl.DateTimeFormatOptions>

/** « 2020-06-26 » devient « 26 juin 2020 » ; « 2019-03 » et « 2019 » restent aussi précis qu'eux. */
function formatRelease(released: string): string {
  const parts = released.split('-')
  const options = dateFormats[parts.length as keyof typeof dateFormats]
  if (options === undefined) return released
  const [year = '', month = '01', day = '01'] = parts
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
  return new Intl.DateTimeFormat('fr-FR', { ...options, timeZone: 'UTC' }).format(date)
}

/** La pochette sur l'étagère : une seule, ou les volumes d'une série empilés. */
function Sleeve({ album }: { readonly album: FavouriteAlbum }) {
  const releases = releasesOf(album)
  if (releases.length === 1) {
    return <Cover src={releases[0].cover} title={album.title} subtitle={album.artist} alt="" />
  }

  return (
    <span className="top-sleeve__stack">
      {releases.map((release, index) => {
        const style: StackStyle = { '--i': index, '--n': releases.length }
        return (
          <span key={release.title} className="top-sleeve__layer" style={style}>
            <Cover src={release.cover} title={release.title} subtitle={album.artist} alt="" />
          </span>
        )
      })}
    </span>
  )
}

/** Les crédits d'une sortie. Un champ absent n'affiche pas de ligne. */
function Credits({ release }: { readonly release: AlbumRelease }) {
  const { released, label, producers, features } = release
  return (
    <dl className="top-dialog__credits">
      <dt>Sortie</dt>
      <dd>{formatRelease(released)}</dd>
      {label === undefined ? null : (
        <>
          <dt>Label</dt>
          <dd>{label}</dd>
        </>
      )}
      {producers === undefined || producers.length === 0 ? null : (
        <>
          <dt>Production</dt>
          <dd>{listProducers(producers)}</dd>
        </>
      )}
      {features === undefined ? null : (
        <>
          <dt>Featurings</dt>
          <dd>{features.length === 0 ? 'Aucun' : features.join(', ')}</dd>
        </>
      )}
    </dl>
  )
}

interface AlbumPanelProps {
  readonly album: FavouriteAlbum
  readonly rank: number
  readonly previous: number
  readonly next: number
  readonly onStep: (delta: number) => void
  readonly onClose: () => void
}

/**
 * L'album ouvert. Pour une série, des vignettes passent d'un volume à l'autre :
 * le vinyle ressort, et les crédits suivent.
 */
function AlbumPanel({ album, rank, previous, next, onStep, onClose }: AlbumPanelProps) {
  const [volume, setVolume] = useState(0)
  const releases = releasesOf(album)
  const release = releases[volume] ?? releases[0]
  const isSeries = releases.length > 1

  return (
    <div className="top-dialog__panel glass">
      <div className="top-dialog__nav">
        <button type="button" onClick={() => onStep(-1)} aria-label={`Album précédent : ${previous}`}>
          <span aria-hidden="true">‹</span>
        </button>
        <button type="button" onClick={() => onStep(1)} aria-label={`Album suivant : ${next}`}>
          <span aria-hidden="true">›</span>
        </button>
      </div>

      {/* La clé rejoue la sortie du vinyle à chaque changement de volume. */}
      <div className="top-dialog__art" key={volume}>
        <span className="top-dialog__vinyl" aria-hidden="true">
          {release.cover === undefined ? null : <img src={release.cover} alt="" />}
        </span>
        <Cover src={release.cover} title={release.title} subtitle={album.artist} />
      </div>

      <div className="top-dialog__info">
        <h3 id="top-dialog-title" className="top-dialog__title">
          {release.title}
        </h3>
        <p className="top-dialog__meta">
          {album.artist}
          {isSeries ? `  ·  ${album.title}, vol. ${volume + 1}` : ''}
        </p>

        {isSeries ? (
          <ul className="top-dialog__volumes" aria-label={`Volumes de ${album.title}`}>
            {releases.map((item, index) => (
              <li key={item.title}>
                <button
                  type="button"
                  className="top-dialog__volume"
                  aria-pressed={index === volume}
                  onClick={() => setVolume(index)}
                >
                  <Cover src={item.cover} title={item.title} subtitle={album.artist} alt="" />
                  <span className="top-dialog__volume-label">Vol. {index + 1}</span>
                  <span className="visually-hidden"> : {item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <Credits release={release} />

        {/* Une note vide ne laisse pas de cadre vide : rien n'est affiché. */}
        {album.note && album.note.trim().length > 0 ? (
          <p className="top-dialog__note">« {album.note.trim()} »</p>
        ) : null}

      </div>

      <button type="button" className="top-dialog__close" onClick={onClose}>
        <span aria-hidden="true">×</span>
        <span className="visually-hidden">Fermer</span>
      </button>
    </div>
  )
}

/**
 * Le top de tous les temps, en pochettes posées face à nous sur des planches
 * en verre. Un clic sur une pochette l'ouvre : le vinyle sort, avec le rang,
 * l'artiste, la note et les crédits. On passe d'un album à l'autre sans
 * refermer. Les artistes suivent, en portraits ronds.
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

  const wrap = (index: number) => (index + albums.length) % albums.length
  const step = (delta: number) => setOpen((index) => (index === null ? null : wrap(index + delta)))

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
              const volumes = releasesOf(album).length
              return (
                <li key={album.id}>
                  <button type="button" className="top-sleeve" onClick={() => setOpen(index)}>
                    <Sleeve album={album} />
                    <span className="top-sleeve__rank" aria-hidden="true">
                      N° {index + 1}
                    </span>
                    <span className="visually-hidden">
                      N° {index + 1} : {album.title}, {album.artist}
                      {volumes > 1 ? `, ${volumes} volumes` : ''}
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
          <AlbumPanel
            key={current.id}
            album={current}
            rank={open + 1}
            previous={wrap(open - 1) + 1}
            next={wrap(open + 1) + 1}
            onStep={step}
            onClose={() => setOpen(null)}
          />
        )}
      </dialog>
    </>
  )
}
