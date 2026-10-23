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
      { id: 'lab', title: 'Lab', description: 'Des outils et des expériences faits par curiosité' },
      { id: 'appris', title: 'Ce que j’ai appris', description: 'Leçons et constats que je veux garder' },
      {
        id: 'lectures',
        title: 'Ce que je lis et regarde',
        description: 'Blood Meridian, Project Hail Mary, Sapiens…',
      },
      { id: 'decouvertes', title: 'Découvertes', description: 'Fennes, Saaz, The Quiet Ones' },
      { id: 'top', title: 'Mon top de tous les temps', description: 'Bladee, Ecco2k, Retro X, Yung Lean…' },
      {
        id: 'vinyles',
        title: 'Vinyles',
        description: 'OK Computer, Nevermind, Californication, After Hours…',
      },
      { id: 'colophon', title: 'Colophon', description: 'Comment ce site est fait' },
    ],
  },
}
