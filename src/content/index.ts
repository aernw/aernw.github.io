export type {
  Education,
  Experience,
  Link,
  Profile,
  Project,
  Side,
  SkillGroup,
} from './types'

export { education, experiences, profile, skillGroups } from './profile'
export { projects } from './projects'
export { albums } from './album'
export type { Album, Track } from './album'
export { aboutDraft } from './artistic'
export { concerts } from './concerts'
export type { Concert, ConcertKind } from './concerts'

export { recentFinds, releasesOf, topAlbums, topArtists } from './music'
export type {
  AlbumRelease,
  AlbumSeries,
  FavouriteAlbum,
  FavouriteArtist,
  FindKind,
  RecentFind,
  SingleAlbum,
} from './music'

export { lessons, media } from './personal'
export type { Lesson, MediaItem, MediaKind } from './personal'
