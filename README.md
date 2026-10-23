# aernw.github.io

Portfolio d'Erwan Seytor — développeur fullstack et musicien.

> **[ETAT.md](ETAT.md)** — concept, avancement et prochaines étapes. À lire en
> premier pour reprendre le travail.

Le site est présenté comme un **disque à deux côtés**, dans le style Liquid Glass
d'Apple Music : le côté **Pro** présente les projets, le parcours et les compétences ;
le côté **Perso** présente la musique, le lab et le colophon. Le haut de page est une
page d'album (pochette, CD, liste des titres) et un lecteur fixe en bas sert à naviguer
de section en section — sans aucun son.

Un clic sur le CD (ou la pochette) retourne le disque et change de côté. Le choix n'est
pas mémorisé — il met simplement à jour `?side=perso` dans l'URL, ce qui permet de
partager un lien ciblé (`?side=b`, l'ancienne valeur, fonctionne toujours).

Les maquettes sont sur Figma : https://www.figma.com/design/OVhla9MIkAfeha1u9iH8fg
(page « Round 3 — Pro / Perso (Chrome) »).

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
| `src/components/` | Composants partagés (section, pochettes et notes de projet, bascule). |
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
