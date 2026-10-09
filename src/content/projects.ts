import type { Project } from './types'

/**
 * Projets principaux, dans l'ordre d'affichage.
 *
 * StemHub ouvre la liste : c'est le seul projet où le développement et la musique
 * ne font qu'un, et celui où la contribution est la plus lourde. Il apparaît sur
 * les deux faces de la cassette, raconté sous deux angles différents.
 *
 * Les chiffres proviennent de l'API GitHub (août 2026) et sont vérifiables.
 */
export const projects: readonly Project[] = [
  {
    id: 'stemhub',
    name: 'StemHub',
    tagline: 'Contrôle de version pour la production musicale',
    description:
      "Les producteurs de musique n'ont jamais eu de contrôle de versions. Le résultat, ce sont " +
      "des dossiers locaux remplis de fichiers, d'exports, de versions différentes. StemHub apporte le versionning, " +
      'la résolution de conflits, l\'import de projets, et le suivi des différentes versions directement dans le DAW, via un plugin, avec une plateforme ' +
      "web par-dessus.",
    role: 'Contributeur principal — plugin C++, backend et plateforme web, en équipe de 6',
    stack: ['TypeScript', 'Python', 'C++', 'CMake', 'Docker'],
    links: [
      { label: 'stemhub.fr', href: 'https://stemhub.fr' },
      { label: 'GitHub', href: 'https://github.com/stemhub-org/Stemhub' },
    ],
    year: '2026',
    emphasis: 'feature',
    sides: ['a', 'b'],
    accent: '#9c57df',
  },
  {
    id: 'music-masters',
    name: 'Music Masters',
    tagline: 'Les cartes Pokémon, version albums de musique',
    description:
      'Ouvrir des boosters, compléter sa collection, échanger, enchérir sur un marché tenu par les joueurs ' +
      "et s'affronter en quiz musicaux. La rareté d'une carte vient du vrai parcours de l'album dans les " +
      'classements français, américains et britanniques, recalculée chaque semaine. Les nouvelles sorties ' +
      'arrivent automatiquement en édition limitée.',
    role: 'Projet personnel, conçu et développé seul — de la maquette Figma au déploiement',
    stack: ['Next.js', 'TypeScript', 'FastAPI', 'Python', 'PostgreSQL', 'Redis', 'Stripe', 'Docker'],
    links: [{ label: 'music-masters.trade', href: 'https://music-masters.trade' }],
    year: '2026',
    emphasis: 'standard',
    sides: ['a'],
    accent: '#ff3ea5',
    // Cartes exportées du Figma du jeu : une Live drop face cachée, derrière une Diamant.
    visual: {
      kind: 'sprites',
      sources: ['projects/mm-card-facedown.webp', 'projects/mm-card-diamond.webp'],
    },
  },
  {
    id: 'r-type',
    name: 'R-Type',
    tagline: 'Un moteur de jeu multijoueur écrit de zéro en C++',
    description:
      "Un shoot'em up jouable à quatre, construit sur un moteur maison : ECS développé from scratch, " +
      "serveur autoritaire en UDP/TCP, protocole binaire avec compression delta et LZ4, et un système " +
      'de plugins permettant de charger les bibliothèques graphiques et audio à la volée. ' +
      "Le serveur fait autorité sur l'état du jeu pour garantir un multijoueur équitable.",
    role: 'Contributeur principal, en équipe de 5',
    stack: ['C++', 'CMake', 'UDP/TCP', 'ECS', 'LZ4'],
    links: [{ label: 'GitHub', href: 'https://github.com/aernw/r-type' }],
    year: '2025',
    emphasis: 'standard',
    sides: ['a'],
    accent: '#3ecfa0',
    // Boucle capturée en jeu (partie à 4), recadrée et compressée pour le web.
    visual: {
      kind: 'video',
      sources: { mp4: 'projects/rtype-gameplay.mp4', webm: 'projects/rtype-gameplay.webm' },
      poster: 'projects/rtype-gameplay-poster.jpg',
    },
    visualPlacement: 'left',
  },
  {
    id: 'area',
    name: 'AREA',
    tagline: "Une plateforme d'automatisation façon IFTTT",
    description:
      'Connecter des services entre eux pour déclencher des réactions automatiques : envoyer un mail ' +
      "quand une issue GitHub est créée, alimenter un Google Sheet depuis Slack. Plus de 20 services " +
      'intégrés et 60 actions/réactions, avec un backend Go en gRPC, une application web React et ' +
      'une application mobile Flutter.',
    role: 'Développeur frontend, en équipe de 4',
    metrics: ['20+ services intégrés', '60+ actions et réactions'],
    stack: ['Go', 'gRPC', 'React', 'TypeScript', 'Flutter', 'Docker'],
    links: [{ label: 'GitHub', href: 'https://github.com/aernw/Area' }],
    year: '2026',
    emphasis: 'standard',
    sides: ['a'],
    accent: '#4b8bf5',
  },
  {
    id: 'onepoint',
    name: 'Hackathon Onepoint',
    tagline: 'Chatbot éco-responsable pour développeurs — 1ère place',
    description:
      "Un assistant qui évalue l'empreinte écologique du code et suggère des alternatives plus sobres. " +
      'Conçu et développé pendant un hackathon, arrivé premier.',
    role: 'En équipe, sur un temps de hackathon',
    metrics: ['1ère place'],
    stack: ['TypeScript', 'IA'],
    links: [{ label: 'GitHub', href: 'https://github.com/aernw/sylvAI' }],
    year: '2025',
    emphasis: 'compact',
    sides: ['a'],
    accent: '#5fb87a',
  },
]
