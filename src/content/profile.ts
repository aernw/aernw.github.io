import type { Education, Experience, Profile, SkillGroup } from './types'

export const profile: Profile = {
  name: 'Erwan Seytor',
  title: 'Développeur fullstack',
  location: 'Paris, France',
  email: 'erwan.seytor@epitech.eu',
  availability: 'Heureux de participer à de nouveaux projets !',
  summary:
    "Développeur en 4ème année à Epitech. J'aime aider les personnes à développer leurs idées et suis passionné par mon travail." +
    " J'aime créer des logiciels et des plateformes qui permettent de faire gagner du temps aux utilisateurs et aux entreprises." +
    " Ma passion principale est la musique et j'aime travailler sur des projets qui y sont liés de près ou de loin.",
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
    logo: 'experiences/featuring-logo.svg',
    logoBackground: '#0D1112',
    location: 'Paris',
    period: "09/2026 — aujourd'hui",
    brief: 'Développeur d’une plateforme web et mobile qui vise à relier artistes et studios.',
    summary:
      "Design et déploiement de l’application mobile (iOS et Android)." +
      " Développement de l'API REST et de la base de données." +
      " Puis conception de la plateforme web des studios et de son assistant IA, Lyra.",
    highlights: [
      "Refonte de toute l'interface de l'application iOS et Android : nouveau design system, parcours artiste et studio repensés, architecture React Native + Expo, déploiement sur App Store et Play Store",
      "Lyra, assistant IA de réservation : un agent Mistral à outils qui comprend la demande d'un artiste, cherche dans le catalogue des studios, lit les plannings et prépare la réservation.",
      'Plateforme web conçue sur Figma puis développée : espace studio (planning, réservations, équipe, finances) et réservation côté artiste, en ligne sur featuring.pro',
      'Réservation et paiement de bout en bout avec Stripe : validation par le studio, Apple Pay et Google Pay, remboursements, reversements Stripe Connect',
      "Correctifs d'un audit de sécurité de l'API : aucune donnée sensible renvoyée, validation de chaque requête, CORS restreint, webhooks Stripe traités une seule fois",
      'Déploiement Docker sur VPS OVH via GitHub Actions, avec environnements dev et production',
    ],
    stack: ['Next.js', 'React Native', 'NestJS', 'Stripe', 'Mistral AI', 'Expo', 'MySQL', 'Docker', 'GitHub Actions'],
  },
  {
    id: 'travelme',
    role: 'Développeur fullstack',
    company: 'Travel Me',
    logo: 'experiences/travelme-logo.webp',
    location: 'Paris',
    period: '09/2025 — 07/2026 (10 mois)',
    brief: 'Migration d’une infrastructure fragmentée entre plusieurs fournisseurs vers une architecture unifiée sur AWS.',
    summary:
      "Conception et pilotage de la migration : l'infrastructure, répartie entre AWS, Vercel, Firebase " +
      'et OVH, est regroupée autour d’un backend centralisé.',
    highlights: [
      "Refonte complète de l'intranet de l'entreprise : UI modernisée, automatisation de l'intégration HubSpot et Tiime avec Make",
      'Conception BDD et API REST (Django + MySQL) partagée sur 3 plateformes, en remplacement de Firebase',
      'Améliorations UI/UX, déploiements AWS, migration Firebase, applications iOS et Android',
    ],
    stack: ['React', 'Next.js', 'Django', 'AWS', 'PostgreSQL', 'Firebase', 'OVH', 'GitHub Actions', 'Make'],
  },
  {
    id: 'dilt',
    role: 'Chef de projet IA',
    company: 'DILT — Préfecture de Police',
    logo: 'experiences/dilt-logo.webp',
    location: 'Paris',
    period: '07/2024 — 12/2024 (6 mois)',
    brief: 'Cadrage et pilotage d’un PoC d’IA au sein du département innovation.',
    summary:
      'Définition du périmètre et des livrables, puis réalisation du PoC avec Ollama.',
    highlights: [
      'Cadrage projet : étude de faisabilité, budget, matrice de risques',
      'Création d’un agent IA capable de répondre aux questions des agents et du personnel sur les procédures internes',
      "Animation de sessions de sensibilisation à l'IA pour les agents et le personnel",
    ],
  },
]

export const education: readonly Education[] = [
  {
    id: 'epitech',
    school: 'Epitech Paris',
    logo: 'education/epitech-logo.webp',
    detail: 'Expert en Ingénierie Logicielle — BAC+5, RNCP niveau 7',
    period: '2023 — 2028',
  },
  {
    id: 'efrei',
    school: 'Efrei Paris',
    logo: 'education/efrei-logo.webp',
    detail: 'Classe préparatoire, section internationale (cours en anglais)',
    period: '2022 — 2023',
  },
  {
    id: 'sainte-marie',
    school: "Lycée Sainte-Marie d'Antony",
    logo: 'education/sainte-marie-logo.webp',
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
