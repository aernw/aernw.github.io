import type { Education, Experience, Profile, SkillGroup } from './types'

export const profile: Profile = {
  name: 'Erwan Seytor',
  title: 'Développeur fullstack',
  location: 'Paris, France',
  email: 'erwan.seytor@epitech.eu',
  availability: 'Heureux de participer à de nouveaux projets !',
  summary:
    "Développeur en 4ème année à Epitech. Je viens de la programmation système (C/C++)." +
    " J'ai pour passe-temps de créer des logiciels qui optimisent mon temps et celui des autres. Je suis aussi un passioné de musique : " +
    "les deux se rejoignent plus souvent qu'on ne le croit.",
  links: [
    { label: 'GitHub', href: 'https://github.com/aernw' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/erwan-seytor' },
    { label: 'Email', href: 'mailto:erwan.seytor@epitech.eu' },
  ],
}

export const experiences: readonly Experience[] = [
  {
    id: 'featuring',
    role: 'Développeur fullstack',
    company: 'Featuring',
    location: 'Paris',
    period: "09/2026 — aujourd'hui",
    summary:
      "Seul développeur d'une startup qui met en relation artistes et studios d'enregistrement. " +
      "Reprise de l'application mobile et de l'API livrées par une agence, puis conception de la plateforme web des studios.",
    highlights: [
      'Plateforme web conçue sur Figma puis développée : espace studio (planning, réservations, équipe, finances) et réservation côté artiste, en ligne sur featuring.pro',
      'Réservation et paiement de bout en bout avec Stripe : validation par le studio, Apple Pay et Google Pay, remboursements, reversements Stripe Connect',
      "Application iOS et Android : séparation des parcours artiste et studio, corrections, builds TestFlight",
      'Déploiement Docker sur VPS OVH via GitHub Actions, avec environnements dev et production',
    ],
    stack: ['Next.js', 'React Native', 'Expo', 'NestJS', 'MySQL', 'Stripe', 'Docker', 'GitHub Actions'],
  },
  {
    id: 'travelme',
    role: 'Développeur fullstack',
    company: 'Travel Me',
    location: 'Paris',
    period: '09/2025 — 07/2026',
    summary:
      "Conception et pilotage de la migration d'une infrastructure fragmentée " +
      '(AWS + Vercel + Firebase + OVH) vers une architecture unifiée sur AWS avec un backend centralisé.',
    highlights: [
      "Refonte complète de l'intranet : UI modernisée, intégrations HubSpot et Tiime avec Make",
      'Conception BDD et API REST (Django + MySQL) partagée sur 3 plateformes, en remplacement de Firebase NoSQL',
      'Améliorations UI/UX, déploiements AWS, migration Firebase, applications iOS et Android',
    ],
    stack: ['React', 'Next.js', 'Django', 'postgresql', 'Firebase', 'AWS', 'OVH', 'GitHub Actions', 'Make'],
  },
  {
    id: 'dilt',
    role: 'Chef de projet IA',
    company: 'DILT — Préfecture de Police',
    location: 'Paris',
    period: '07/2024 — 12/2024',
    summary:
      "Cadrage et pilotage d'un projet IA au sein du département innovation : " +
      'définition du périmètre et des livrables.',
    highlights: [
      'Cadrage projet : étude de faisabilité, budget, matrice de risques',
      "Animation de sessions de sensibilisation à l'IA pour les agents et le personnel",
    ],
  },
]

export const education: readonly Education[] = [
  {
    id: 'epitech',
    school: 'Epitech Paris',
    detail: 'Expert en Ingénierie Logicielle — BAC+5, RNCP niveau 7',
    period: '2023 — 2028',
  },
  {
    id: 'efrei',
    school: 'Efrei Paris',
    detail: 'Classe préparatoire, section internationale (cours en anglais)',
    period: '2022 — 2023',
  },
  {
    id: 'sainte-marie',
    school: "Lycée Sainte-Marie d'Antony",
    detail: 'Baccalauréat général — Maths, Physique-Chimie, NSI',
    period: '2019 — 2022',
  },
]

export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'languages',
    label: 'Langages',
    items: ['C', 'C++', 'TypeScript', 'JavaScript', 'Go', 'Python'],
  },
  {
    id: 'frameworks',
    label: 'Frameworks',
    items: ['React', 'Next.js', 'Django', 'FastAPI', 'Tailwind CSS', 'Go Fiber', 'Asio', 'SFML', 'JUCE'],
  },
  {
    id: 'tools',
    label: 'Outils & environnements',
    items: ['Node.js', 'Git', 'CMake', 'Docker', 'GitHub Actions', 'AWS', 'OVH', 'Google Cloud', 'Bash', 'Make', 'n8n', 'Vercel', 'Firebase', 'PostgreSQL', 'Stripe'],
  },
  {
    id: 'languages-spoken',
    label: 'Langues',
    items: ['Français (natif)', 'Anglais (C1)', 'Espagnol (B2)'],
  },
]
