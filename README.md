# aernw.github.io

Portfolio d'Erwan Seytor — développeur fullstack et musicien.

> **[ETAT.md](ETAT.md)** — concept, avancement et prochaines étapes. À lire en
> premier pour reprendre le travail.

Le site a **deux faces**, comme une cassette : la face A (pro) présente les projets,
le parcours et les compétences ; la face B (artistique) présente la musique, le lab
et le colophon. La bascule n'est pas mémorisée — elle met simplement à jour `?side=b`
dans l'URL, ce qui permet de partager un lien ciblé.

## Développement

```bash
npm install
npm run dev
```

```bash
npm run build
```

## Structure

| Chemin | Rôle |
|---|---|
| `src/content/` | Toutes les données du site (projets, profil, lab). Aucun texte n'est codé en dur dans les composants. |
| `src/side/` | Contexte React de la face active et synchronisation de l'URL. |
| `src/faces/` | Composition des deux faces. |
| `src/components/` | Composants partagés (section, carte de projet, bascule). |
| `src/styles/` | Tokens de design et styles de base. |

## À compléter

Plusieurs fichiers de `src/content/` contiennent des `TODO` : musique et plateformes
(`artistic.ts`), découvertes, top et vinyles (`music.ts`), lectures et apprentissages
(`personal.ts`). Les sections concernées ne s'affichent pas tant que leur contenu est vide.

**Voir [CONTENU.md](CONTENU.md)** pour la marche à suivre, avec des exemples copiables.

## Déploiement

Automatique sur GitHub Pages à chaque push sur `main`, via `.github/workflows/deploy.yml`.
Le workflow vérifie le typage avant de builder.

> Pages doit être configuré sur **GitHub Actions** comme source
> (Settings → Pages → Build and deployment → Source).
