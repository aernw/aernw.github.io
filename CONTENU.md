# Tenir le site à jour

Tout le contenu vit dans `src/content/`. Aucun texte n'est écrit en dur dans les
composants : pour modifier le site, tu édites un fichier de données, tu commites,
et GitHub Actions déploie tout seul.

**Règle générale : une section dont les données sont vides ne s'affiche pas.**
Tu peux donc laisser des listes vides sans casser la mise en page.

## Où trouver quoi

| Fichier | Contenu |
|---|---|
| `music.ts` | Découvertes, top albums, top artistes, vinyles |
| `personal.ts` | Lectures et visionnages, ce que j'ai appris |
| `artistic.ts` | Ta musique, liens plateformes, texte « à propos », section « en ce moment » |
| `projects.ts` | Projets des deux faces |
| `profile.ts` | Identité, expériences, formation, compétences |
| `lab.ts` | Expériences et petits outils |

## Organisation des images locales

Les images de couverture vivent dans le dossier `public/covers/` et sont classées par type de contenu :

- `public/covers/discoveries/` → découvertes musicales
- `public/covers/albums/` → top albums
- `public/covers/artists/` → portraits du top artistes
- `public/covers/vinyls/` → vinyles

Exemple de structure :

```text
public/
  covers/
    discoveries/
      fennes.svg
      saaz.svg
    albums/
      bladee-333.webp
      retro-x-heroes.webp
    artists/
      bladee.webp
    vinyls/
      ambient-selection.svg
```

Ensuite, dans les données, on pointe vers le chemin public :

```ts
cover: '/covers/discoveries/fennes.svg'
cover: '/covers/albums/bladee-333.webp'
cover: '/covers/artists/bladee.webp'
cover: '/covers/vinyls/ambient-selection.svg'
```

Convention de nommage : minuscules, tirets, `artiste-titre` pour un album et
`artiste` pour un portrait — le même slug que l'`id` de l'entrée.

Format : privilégie le **WebP en 400×400**. Les pochettes des services de
streaming font souvent 768×768 pour 300–500 Ko, alors qu'elles s'affichent à
88 px. Pour convertir une image téléchargée :

```bash
sips -Z 400 pochette.jpg --out pochette.jpg && cwebp -q 82 pochette.jpg -o pochette.webp
```

Cette méthode est préférable aux URLs externes parce qu’elle est stable, versionnée dans le dépôt et intégrée automatiquement par Vite au build.

## Ajouter une découverte musicale

Dans `music.ts`, ajoute une entrée **en haut** de `discoveries` (les plus récentes d'abord) :

```ts
{
  id: 'artiste-titre',
  artist: "Nom de l'artiste",
  title: "Titre de l'album",
  year: '2025',
  note: "Ce qui t'a marqué. Deux phrases suffisent — c'est la partie qu'on lit.",
  discovered: '2026-08',
  cover: '/covers/discoveries/artiste-titre.svg',
  href: 'https://open.spotify.com/album/…',
},
```

- `id` doit être unique, sans espaces.
- `discovered` est au format `AAAA-MM`. Il sert à afficher « Dernier ajout en août 2026 »
  en bas de section — **c'est volontaire** : si la section vieillit, ça se voit, pour toi
  comme pour le visiteur.
- `cover` est optionnel ; si tu n’as pas d’image, le composant affiche automatiquement les initiales.
- `href` est facultatif.

## Ajouter un album au top

Dans `music.ts`, `topAlbums`. **L'ordre du tableau est le classement** : la première
entrée est le n° 1. Pour changer un rang, déplace la ligne.

```ts
{
  id: 'artiste-titre',
  artist: "Nom de l'artiste",
  title: "Titre de l'album",
  year: '1997',
  note: 'Une ligne : pourquoi celui-ci.',
  cover: '/covers/albums/artiste-titre.webp',
},
```

Il n'y a pas de note en étoiles, volontairement : sur un top de tous les temps, tout
serait à cinq étoiles. La place dans le classement porte le jugement.

`note` est facultatif : le classement actuel vient des écoutes cumulées
(stats.fm) et les notes sont laissées vides, à remplir à la main disque par
disque. Sans note, seuls le rang, le titre et l'artiste s'affichent.

## Ajouter un artiste au top

Dans `music.ts`, `topArtists` — même principe, l'ordre du tableau est le classement :

```ts
{ id: 'artiste', name: 'Artiste', cover: '/covers/artists/artiste.webp' },
```

`cover` est un portrait carré, affiché en rond. Sans image, le composant retombe
sur les initiales. `note` et `href` sont facultatifs.

## Ajouter un vinyle

Dans `music.ts`, `vinyls`. `pressing` est facultatif — à utiliser quand l'édition a
un intérêt (réédition, vinyle coloré, coffret).

```ts
{
  id: 'artiste-titre',
  artist: '…',
  title: '…',
  year: '1985',
  pressing: 'Réédition 2021',
  cover: '/covers/vinyls/artiste-titre.svg',
},
```

## Ajouter une lecture ou un film

Dans `personal.ts`, `media`. Le champ `kind` accepte `'livre'`, `'film'`, `'série'` ou `'autre'`.

```ts
{ id: 'un-id', title: 'Titre', author: 'Auteur', kind: 'livre', note: 'Ton avis.', year: '2021' },
```

## Ajouter un apprentissage

Dans `personal.ts`, `lessons`. Le `statement` est affiché en gros, comme une citation.

```ts
{ id: 'un-id', statement: 'Une phrase courte et assumée.', context: "D'où elle vient." },
```

Le piège de cette section, c'est la banalité : « il faut tester son code » ne dit rien
de toi. Ce qui fonctionne, c'est ce qui t'a coûté quelque chose, rattaché à un moment précis.

## À propos des pochettes

Les images sont maintenant stockées localement dans `public/covers/`.

- Elles doivent être placées dans le bon dossier : `discoveries`, `albums` ou `vinyls`.
- Le chemin dans les données doit commencer par `/covers/...`.
- Si une image n’existe pas ou casse, le composant la remplace automatiquement par les initiales de l’artiste.
- Cela évite les liens cassés et rend le site fiable sur le long terme.

## Publier tes changements

```bash
npm run dev
```

Vérifie le rendu sur `http://localhost:5173/?side=b`, puis :

```bash
git add -A && git commit -m "content: ajout de découvertes" && git push
```

Le déploiement se fait tout seul. Le workflow vérifie le typage avant de publier :
si tu as fait une faute dans la structure des données, le site en ligne n'est pas
cassé, le déploiement est simplement refusé.

## Plus tard : automatiser depuis Spotify

La structure de `discoveries` est prête à être alimentée automatiquement par une
GitHub Action nocturne qui interrogerait l'API Spotify et commiterait le résultat.
Les composants n'auraient pas à changer. À faire si la mise à jour manuelle devient
une corvée.
