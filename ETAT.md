# Portfolio — état du projet

Document de reprise. À lire en premier pour reprendre le travail sans contexte
préalable.

---

## 1. Le projet

Portfolio d'Erwan Seytor, étudiant en 4ème année à Epitech, développeur et
musicien. Hébergé sur GitHub Pages (`aernw.github.io`).

**Double objectif** : servir de vitrine à des recruteurs (projets expliqués, CV
accessible) *et* démontrer une compétence front par une UI originale qui ne
reprend pas les codes classiques d'un site web.

### Le concept

Un objet unique porte toute la métaphore : **un walkman avec son casque**,
présent dès l'écran d'accueil.

Le site a **deux faces**, comme une cassette :

- **Face A — pro** : projets, parcours, compétences, contact. Sobre et dense.
- **Face B — artistique** : musique, découvertes, vinyles, lectures, lab.

Principe directeur : **une seule référence musicale forte, déclinée**, plutôt
qu'une accumulation de clins d'œil au domaine musical.

### Décisions verrouillées

| Sujet | Choix |
|---|---|
| Différenciation des faces | Contenus réellement distincts, pas un reskin |
| Persistance | Aucune. `?side=b` dans l'URL via `history.replaceState`, sans localStorage |
| Face par défaut | A (pro) — le visiteur inconnu voit d'abord les projets |
| Mobile | Desktop d'abord, mobile lisible mais non travaillé |
| Audio | Sons d'interface uniquement — **non implémenté à ce jour** |
| Palette face A | Noir et blanc, rigueur Apple, un bleu rationné |
| Palette face B | Fond sombre, accents ocre |
| Mise en page | Pas de colonne centrée, pas de bandes entre les sections |

### Direction artistique

Références : [pavlosanchez.com](https://pavlosanchez.com), Lusion, ToyFight,
Spencer Gabor, plus le système de design Apple.

Ce qui est repris d'Apple : la discipline typographique, un accent rationné aux
éléments actionnables, une motion courte et non décorative, aucune ombre sur le
contenu.

Ce qui est écarté d'Apple : les bandes de couleur empilées. La surface est
continue, le contenu flotte dessus.

**Mot d'ordre d'Erwan** : simple et efficace, peu d'éléments, typo lisible et
moderne, composants flottants, aucune délimitation visible entre les sections.

---

## 2. Stack et architecture

React 19 · TypeScript · Vite · React Three Fiber · drei · three

```
src/
  content/     Toutes les données du site. Aucun texte codé en dur ailleurs.
  faces/       Composition des deux faces (SideA, SideB)
  components/  Section, ProjectCard, Rail, Reveal, Cover, Discoveries, TopList…
  walkman/     Scène 3D
  side/        Contexte de la face active + synchronisation de l'URL
  styles/      tokens.css (deux palettes derrière un même jeu de rôles), base.css
scripts/
  audit-glb.py Audite un modèle 3D avant de l'intégrer
public/models/
  walkman.glb  Modèle préparé hors ligne (80 Ko)
```

### Poids

| | gzip |
|---|---|
| Bundle principal | ~68 Ko |
| Scène 3D (chargée en différé) | ~264 Ko |
| Modèle GLB | 80 Ko |

La 3D est en `lazy()` : le texte s'affiche avant elle.

---

## 3. Ce qui est fait

### Contenu et structure

- Données réelles : profil, expériences (Travel Me, DILT), formation, compétences
- **Projets** avec rôles honnêtes, vérifiés sur l'API GitHub : StemHub
  (contributeur principal, 252 commits sur ~504), R-Type (284 sur ~728), AREA
  (frontend en équipe de 4), Hackathon Onepoint
- Identité visuelle par projet : teinte propre (StemHub reprend le violet
  `#9c57df` de son design system), sprites réels de R-Type
- Face B structurée : découvertes, top all-time, vinyles, lectures,
  apprentissages, lab, colophon

### Mise en page

- Sortie de la colonne centrée : les sections occupent toute la largeur, seul le
  contenu est borné
- Titres de section collants au scroll (désactivés sous 60rem)
- Projets en flux irrégulier : pleine largeur, aligné à droite, à gauche, décalé
- Rails horizontaux accessibles (clavier, boutons explicites, scroll-snap)
- Hero centré plein écran : nom + métier, walkman derrière, description descendue
  sous la ligne de flottaison

### Interactions

- Apparition au scroll (`Reveal`), avec repli si `IntersectionObserver` manque
- Transition entre les faces, scroll remis en haut au changement
- Halo derrière le texte du hero pour le détacher de l'objet 3D
- Micro-interactions : pochettes qui se soulèvent, stack qui prend la teinte du projet

### Scène 3D

- Modèle **Low poly Sony Walkman WM-22** par **ima_ethan**, licence **CC
  Attribution** — crédit obligatoire présent dans le colophon de la face B
- Préparé hors ligne : `dedup → flatten → join → center → resize → webp → draco`
  (draco en dernier, sinon chaque étape suivante le décompresse). 63 → 14 nœuds,
  7 → 1 niveau de profondeur, 0,58 Mo → 80 Ko
- Scène **entièrement statique** : `frameloop="demand"`, aucune boucle de rendu
- Le canvas est en `pointer-events: none` et `z-index: 0` — il ne capte aucun
  événement et passe derrière le texte
- La scène est dans le flux de la page (`position: absolute`), donc le walkman
  défile avec le hero au lieu de rester collé au viewport

### Accessibilité

- Contrastes vérifiés WCAG AA sur les deux faces (minimum mesuré 4,87)
- `prefers-reduced-motion` respecté partout
- Lien d'évitement, focus visible, navigation clavier
- Repli sans WebGL : le hero reste complet, le bouton de bascule prend le relais

---

## 4. Ce qui reste à faire

> **Plan arrêté le 14/08/2026 avec Erwan.** Pas de deadline : le chantier 3D
> passe devant le contenu.
>
> **Le câble est abandonné.** Trop coûteux pour un gain incertain : il imposait
> de la modélisation, pas du code. Le fil conducteur passe désormais par des
> **objets de fond façon sketchbook** — fait, voir ci-dessous.
>
> **`FramingProbe` est conservé** — contrairement à ce qu'indiquait la P4.
> Il est derrière `import.meta.env.DEV` et vérifié absent du bundle de
> production ; il resservira à chaque retouche du cadrage.

### ✅ Fait — Le fil conducteur : objets de fond

Quatre cassettes flottent derrière le contenu, clonées depuis les nœuds déjà
présents dans le GLB (`src/walkman/ScatteredObjects.tsx`). Coût réel :
**+0,31 Ko gzip**, la géométrie étant déjà chargée.

La scène reste **entièrement statique** — `frameloop="demand"` intact, coût
processeur nul.

Pièces du modèle, toutes nommées séparément :

| Pièce | Nœud |
|---|---|
| Boîtier | `Box003_walkman_0` |
| Casque | `Box014_headphoneGrey_0`, `Box014_headphoneOrange_0` |
| Câble | `Tube001_headJack grey_0` |
| Fiche | `Tube001_headjack Green_0` |
| Arceau (probable) | `Loft001_superblack_0` |
| Cassettes | `Box010_cassette_0`, `Box013_cassette01_0` |

⚠️ **Le casque ne fonctionne pas en objet isolé** : modélisé en deux nœuds et
détaché de son arceau, il ne se lit plus comme un casque. Essayé, écarté.

⚠️ **Poser un objet demande de mesurer, pas d'estimer.** À z=6 avec un fov de
38°, la demi-hauteur visible vaut 2,07 unités et la demi-largeur descend à 1,62
sur une fenêtre étroite. Un premier essai à x=±3,4 tombait entièrement hors
champ. La sonde donne ces valeurs ; `scripts/audit-glb.py` donne les positions
des pièces :

```bash
python3 scripts/audit-glb.py public/models/walkman.glb
```

### ❌ Écarté — La cassette qui se rembobine au scroll

Idée séduisante, techniquement infondée : **la cassette n'a pas de bobines
modélisées**. `Box010_cassette_0` est un nœud unique avec un seul matériau — les
bobines sont peintes dans la texture. Les faire tourner supposerait de dessiner
de vrais cylindres en code et de les aligner sur la texture existante.

Écarté pour garder la scène statique. À rouvrir seulement si le fond paraît trop
figé à l'usage.

### Priorité 1 — Animations 3D (si l'envie revient)

Idée d'Erwan, non commencée : ouvrir le couvercle du walkman et y insérer une
cassette au changement de face.

⚠️ Le sketchbook a été choisi **statique** à dessein. Toute animation rouvre la
question de la boucle de rendu, aujourd'hui fermée — à ne pas engager sans le
vouloir explicitement.

**Le modèle ne contient aucune animation** (`animations: 0`). Il faudrait donc
animer les nœuds à la main — trouver l'axe de rotation du couvercle, sa position
de repos, son amplitude.

⚠️ Cela implique de réintroduire une boucle de rendu. `frameloop="demand"` devra
alors demander un rendu pendant l'animation seulement, sinon la scène se figera
en milieu de mouvement.

### Priorité 2 — Contenu de la face B

**10 marqueurs `TODO Erwan`** dans `src/content/` :

- `artistic.ts` : liens plateformes, morceaux, texte « à propos » (marqué
  `isDraft`, à réécrire), section « en ce moment »
- `music.ts` : découvertes, top albums, top artistes, vinyles
- `personal.ts` : lectures et visionnages, apprentissages

Les sections concernées ne s'affichent pas tant que leur contenu est vide. Voir
[CONTENU.md](CONTENU.md) pour la marche à suivre, avec exemples copiables.

**Décision (14/08/2026)** : Erwan remplira lui-même, plus tard. Les placeholders
sont assumés, ce n'est pas un chantier ouvert.

À ce jour **toutes** les listes de la face B sont vides, `discoveries` comprise :
la face se replie proprement sur hero + Lab + Colophon. Il n'y a donc aucun
déséquilibre entre sections — l'ancienne alerte sur « Ma musique vide à côté de
Découvertes remplie » était fondée sur une lecture erronée et a été retirée.

⚠️ En revanche, `aboutDraft.isDraft` n'est lu par **aucun** composant : le
brouillon s'affiche en ligne comme un texte normal. Choix assumé au merge de la
PR #4, mais c'est le premier texte à réécrire.

### Priorité 3 — Divers

- **CV en PDF** téléchargeable : prévu au plan, jamais ajouté
- ~~Nettoyer `FramingProbe.tsx`~~ — **conservé volontairement**, voir l'encadré
  en tête de section
- Mobile : jamais travaillé, seulement vérifié qu'il ne déborde pas
- Le README d'AREA crédite `@aernw1` — lien mort, à signaler à l'équipe

---

## 5. État Git

Branche courante : **`feat/walkman-3d`**, à jour avec `main`.

Les PR #1 (visuels), #2 (cassette 2D), #3 et #4 sont mergées. **Tout le travail
3D est en ligne** : le site déployé sert le walkman en fond de hero.

⚠️ Le workflow ne se déclenche que sur `push` vers `main` — une PR n'affiche donc
aucun check. La vérification de typage tourne *après* le merge, pendant le
déploiement. Il faut valider `npx tsc --noEmit && npm run build` en local avant
de merger.

Branches conservées mais obsolètes : `feat/cassette-fil` (approche 2D
abandonnée), `feat/portfolio-v1`, `feat/layout-libre`, `feat/face-b-content`,
`feat/visuels`.

### Déploiement

GitHub Actions à chaque push sur `main`, avec vérification du typage avant build.

⚠️ **Settings → Pages → Source doit être réglé sur « GitHub Actions »** dans le
dépôt, sinon le build passe mais le déploiement échoue.

---

## 6. Leçons de la scène 3D — à ne pas réapprendre

Cette partie a coûté plusieurs itérations ratées. Les causes, pour ne pas les
répéter :

**Le modèle décide de tout.** Le premier GLB était une mise en scène Sketchfab :
172 nœuds, 8 niveaux de hiérarchie, une échelle interne de 0,01, un centre décalé
de 26 % de sa propre taille, dix cassettes décoratives. Chaque bug de cadrage en
découlait. `scripts/audit-glb.py` existe pour rejeter ce genre de fichier en
trente secondes.

**Préparer le fichier plutôt que corriger au chargement.** La normalisation dans
un `useEffect` devait rester idempotente et jonglait entre deux repères. Elle a
été supprimée, pas améliorée : le fichier livré est déjà propre.

**`Box3.setFromObject` renvoie un centre en coordonnées MONDE**, qu'on ne peut
pas soustraire à une position locale quand des nœuds portent leurs propres
transformations.

**Geler le repère avant d'y accrocher quoi que ce soit.** Régler le cadrage du
walkman et l'ancrage du câble en parallèle, c'est deux inconnues pour une seule
observation — chaque correction en cassait une autre.

**Mesurer plutôt que regarder.** `FramingProbe.tsx` projette la boîte du modèle
en coordonnées écran et répond sans ambiguïté à « dans le cadre ou hors champ ».
Une capture vide ne dit pas si le défaut vient du code ou du navigateur —
l'environnement de test suspend le rendu quand l'onglet passe en arrière-plan.

**Ne pas conclure d'une heuristique silencieuse.** J'avais déclaré « ce modèle
n'a pas de câble » parce que mon test cherchait une pièce allongée sur un axe.
Or un câble enroulé occupe un volume cubique. Résultat : deux câbles à l'écran.

---

## 7. Vérifier que tout va bien

```bash
npm install
npm run dev
```

```bash
npx tsc --noEmit && npm run build
```

```bash
python3 scripts/audit-glb.py public/models/walkman.glb
```

En développement, la sonde de cadrage publie ses mesures sur `window.__framing` :
`dansLeCadre`, emprise à l'écran, nombre de triangles rendus.

Les réglages de la scène sont regroupés en tête de `src/walkman/WalkmanScene.tsx` :
`WALKMAN_POSITION`, `WALKMAN_ROTATION`, `WALKMAN_SCALE`.
