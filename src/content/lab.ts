import type { LabItem } from './types'

/**
 * Le lab : expériences, outils personnels, choses faites par curiosité.
 * Ce ne sont pas des produits finis, et c'est assumé — le lab montre ce qui
 * intéresse, là où la section projets montre ce qui a été mené à bout.
 */
export const labItems: readonly LabItem[] = [
  {
    id: 'playlist-generator',
    name: 'Playlist generator',
    description:
      'Un script qui crée des playlists en groupant les morceaux par genre et par similarité, ' +
      'plutôt que de les empiler dans l\'ordre où on les a ajoutés.',
    stack: ['Python'],
    links: [{ label: 'GitHub', href: 'https://github.com/aernw/playlist-generator' }],
  },
  {
    id: 'youtube-recommendation-extension',
    name: 'YouTube recommendation extension',
    description:
      'Une extension qui remplace les recommandations YouTube par ce qu\'on cherche réellement, ' +
      'au lieu de ce que l\'algorithme veut nous faire regarder.',
    stack: ['JavaScript', 'Chrome Extension'],
    links: [{ label: 'GitHub', href: 'https://github.com/aernw/youtube-recommendation-extension' }],
  },
  {
    id: 'tailwind-css-previewer',
    name: 'Tailwind CSS previewer',
    description:
      'Une page pour prévisualiser les classes Tailwind et les apprendre en les voyant agir, ' +
      'sans aller-retour avec la documentation.',
    stack: ['TypeScript', 'React', 'Tailwind CSS'],
    links: [{ label: 'GitHub', href: 'https://github.com/aernw/tailwind-css-previewer' }],
  },
  {
    id: 'workshop-extension-chrome',
    name: 'Workshop — créer une extension Chrome',
    description:
      'Un atelier pour apprendre à construire une extension Chrome de bout en bout, ' +
      'écrit pour être suivi par d\'autres étudiants.',
    stack: ['JavaScript', 'Pédagogie'],
    links: [{ label: 'GitHub', href: 'https://github.com/aernw/workshop-extension-chrome' }],
  },
  {
    id: 'paired',
    name: 'Paired',
    description: 'Une application web pour les couples, construite en Go et TypeScript.',
    stack: ['TypeScript', 'Go', 'Docker'],
    links: [
      { label: 'Démo', href: 'https://pairedd.netlify.app' },
      { label: 'GitHub', href: 'https://github.com/aernw/Paired' },
    ],
  },
]
