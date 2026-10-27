import { concerts } from './concerts'
import { recentFinds, topAlbums, topArtists } from './music'
import { lessons, media } from './personal'
import { profile } from './profile'
import type { Side } from './types'

/**
 * Chaque côté du site est présenté comme un album : un titre (écrit en grand
 * sur la pochette), une ligne sous le nom dans le hero, et une liste de
 * « pistes » qui sont les sections de la page.
 *
 * Les `id` des pistes doivent correspondre aux `id` des sections dans
 * src/faces/SideA.tsx et SideB.tsx : la liste et le lecteur s'en servent pour
 * faire défiler la page jusqu'à la bonne section.
 */

export interface Track {
  readonly id: string
  readonly title: string
  /** Une ligne, tirée du contenu réel de la section. */
  readonly description: string
}

export interface Album {
  /** Nom du côté, affiché en grand sur la pochette et dans le lecteur. */
  readonly name: string
  /** Ligne sous le nom, dans le hero. */
  readonly subtitle: string
  /** Petite ligne en bas de la pochette. */
  readonly coverLine: string
  readonly tracks: readonly Track[]
}

/**
 * Nombre d'éléments de chaque section du côté Perso. Une section vide est
 * retirée de la liste des titres, donc aussi de la page et du lecteur.
 */
const persoCounts: Readonly<Record<string, number>> = {
  appris: lessons.length,
  top: topAlbums.length + topArtists.length,
  concerts: concerts.length,
  decouvertes: recentFinds.length,
  lectures: media.length,
}

const hasContent = (track: Track) => (persoCounts[track.id] ?? 1) > 0

export const albums: Readonly<Record<Side, Album>> = {
  a: {
    name: 'Pro',
    subtitle: profile.title,
    coverLine: 'Développeur fullstack',
    tracks: [
      {
        id: 'intro',
        title: 'À propos',
        description: 'Développeur en 4ème année à Epitech, passionné de musique',
      },
      {
        id: 'projets',
        title: 'Projets',
        description: 'StemHub, Music Masters, R-Type, AREA, Hackathon Onepoint',
      },
      {
        id: 'parcours',
        title: 'Parcours',
        description: 'Featuring, Travel Me, Préfecture de Police · Epitech, Efrei',
      },
      {
        id: 'competences',
        title: 'Compétences',
        description: 'C, C++, TypeScript, Go, Python, React, Next.js, Django…',
      },
      { id: 'contact', title: 'Contact', description: profile.availability },
    ],
  },
  b: {
    name: 'Perso',
    subtitle: 'Musique et expériences personnelles',
    coverLine: 'Musique & expériences',
    tracks: [
      {
        id: 'a-propos',
        title: 'À propos',
        description: 'La musique et le code, deux choses que j’ai du mal à séparer',
      },
      { id: 'appris', title: 'Ce que j’ai appris', description: 'Leçons et constats que je veux garder' },
      { id: 'top', title: 'Les albums et artistes qui m\'ont marqués', description: 'Bladee, Ecco2k, Ril3y, Yung Lean…' },
      { id: 'concerts', title: 'Concerts', description: 'The Weeknd, Bladee, Houdi, We Love Green…' },
      {
        id: 'decouvertes',
        title: 'Mes découvertes récentes',
        description: 'Musique, films et outils que je recommande',
      },
      {
        id: 'lectures',
        title: 'Ce que je lis et regarde',
        description: 'Blood Meridian, Project Hail Mary, Sapiens…',
      },
    ].filter(hasContent),
  },
}
