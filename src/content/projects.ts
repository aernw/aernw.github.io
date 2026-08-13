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
    tagline: 'Git pour la production musicale',
    description:
      "Les producteurs de musique n'ont jamais eu de gestion de versions. Le résultat, ce sont " +
      "des dossiers remplis de projet_final_v2_VRAI_CELUI-LA. StemHub apporte les commits, les " +
      'branches et la collaboration directement dans le DAW, via un plugin, avec une plateforme ' +
      "web par-dessus. Le stockage est adressé par contenu, ce qui permet de ne jamais renvoyer " +
      'deux fois le même échantillon audio.',
    role: 'Contributeur principal — plugin C++, backend et plateforme web, en équipe de 6',
    metrics: ['252 commits sur ~504', '46 pull requests mergées'],
    stack: ['TypeScript', 'Python', 'C++', 'CMake', 'Docker'],
    links: [
      { label: 'stemhub.fr', href: 'https://stemhub.fr' },
      { label: 'GitHub', href: 'https://github.com/stemhub-org/Stemhub' },
    ],
    year: '2026',
    emphasis: 'feature',
    sides: ['a', 'b'],
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
    metrics: ['284 commits sur ~728', "Jusqu'à 4 joueurs simultanés"],
    stack: ['C++', 'CMake', 'UDP/TCP', 'ECS', 'LZ4'],
    links: [{ label: 'GitHub', href: 'https://github.com/aernw/r-type' }],
    year: '2025',
    emphasis: 'standard',
    sides: ['a'],
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
  },
]
