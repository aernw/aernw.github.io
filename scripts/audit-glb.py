#!/usr/bin/env python3
"""
Audite un fichier .glb pour décider s'il est exploitable dans la scène 3D
du portfolio, sans écrire une ligne de code autour.

Le principe : un modèle mal construit se repère par arithmétique. Les bornes
min/max des accesseurs POSITION sont stockées en clair dans le chunk JSON du
GLB — y compris sous compression Draco, qui ne touche qu'au buffer binaire.
On peut donc mesurer la boîte englobante et la hiérarchie sans rien décoder.

Usage :
    python3 scripts/audit-glb.py chemin/vers/modele.glb

Code de sortie : 0 si tous les critères passent, 1 sinon.
"""

from __future__ import annotations

import json
import math
import struct
import sys
from pathlib import Path

# ── Seuils d'acceptation ────────────────────────────────────────────
# Calibrés sur les défauts constatés : le modèle qui a échoué avait 172 nœuds,
# une échelle interne de 0,01 et un centre à 50 % de sa propre taille.
MAX_NODES = 20
MAX_MESHES = 40
# Décalage du centre toléré, en fraction du plus grand axe.
MAX_CENTER_OFFSET = 0.02
MIN_EXTENT = 0.5
MAX_EXTENT = 5.0
MAX_DEPTH = 3
MAX_SIZE_MB = 1.5

# Mots-clés cherchés dans les noms de nœuds pour juger si les pièces sont
# séparables — condition d'un agencement libre sur la page.
PART_KEYWORDS = {
    "walkman": ("walkman", "player", "cassette_player", "body", "case"),
    "casque": ("head_phone", "headphone", "headset", "ear", "phone"),
    "câble": ("wire", "cable", "cord"),
    "fiche": ("jack", "plug", "connector"),
}

GLTF_CHUNK_JSON = 0x4E4F534A


def read_gltf_json(path: Path) -> dict:
    """Extrait le chunk JSON d'un .glb. Le buffer binaire n'est jamais lu."""
    data = path.read_bytes()

    magic, _version, _length = struct.unpack("<III", data[:12])
    if magic != 0x46546C67:  # "glTF"
        raise ValueError(f"{path} n'est pas un fichier GLB valide")

    offset = 12
    while offset < len(data):
        chunk_length, chunk_type = struct.unpack("<II", data[offset : offset + 8])
        if chunk_type == GLTF_CHUNK_JSON:
            return json.loads(data[offset + 8 : offset + 8 + chunk_length])

        offset += 8 + chunk_length
        # Les chunks sont alignés sur 4 octets.
        offset += (4 - chunk_length % 4) % 4 if chunk_length % 4 else 0

    raise ValueError(f"{path} ne contient pas de chunk JSON")


def node_scale(node: dict) -> tuple[float, float, float] | None:
    """Échelle d'un nœud, qu'elle soit donnée directement ou via une matrice."""
    if "scale" in node:
        s = node["scale"]
        return (s[0], s[1], s[2])

    if "matrix" in node:
        m = node["matrix"]
        # Norme des trois premières colonnes de la matrice 4×4 (colonne-major).
        return (
            math.sqrt(m[0] ** 2 + m[1] ** 2 + m[2] ** 2),
            math.sqrt(m[4] ** 2 + m[5] ** 2 + m[6] ** 2),
            math.sqrt(m[8] ** 2 + m[9] ** 2 + m[10] ** 2),
        )

    return None


def hierarchy_depth(gltf: dict) -> int:
    """Profondeur maximale de l'arbre de nœuds."""
    nodes = gltf.get("nodes", [])
    if not nodes:
        return 0

    children_of = {i: node.get("children", []) for i, node in enumerate(nodes)}
    all_children = {c for kids in children_of.values() for c in kids}
    roots = [i for i in range(len(nodes)) if i not in all_children]

    def depth(index: int, seen: frozenset[int]) -> int:
        # `seen` protège d'un graphe cyclique, qui ferait boucler indéfiniment.
        if index in seen:
            return 0
        kids = children_of.get(index, [])
        if not kids:
            return 1
        return 1 + max(depth(k, seen | {index}) for k in kids)

    return max((depth(r, frozenset()) for r in roots), default=0)


def bounding_box(gltf: dict) -> tuple[list[float], list[float]] | None:
    """
    Boîte englobante des meshes, échelle et translation des nœuds appliquées.

    Prendre les bornes brutes des accesseurs ne suffit pas : après un `flatten`,
    l'échelle du modèle vit dans les nœuds et non dans la géométrie. Un modèle
    parfaitement dimensionné paraîtrait alors cent fois trop grand.

    Les rotations sont ignorées — elles ne changent pas l'ordre de grandeur, qui
    est ce qu'on cherche à mesurer ici.
    """
    accessors = gltf.get("accessors", [])
    meshes = gltf.get("meshes", [])

    lo = [float("inf")] * 3
    hi = [float("-inf")] * 3
    found = False

    for node in gltf.get("nodes", []):
        mesh_index = node.get("mesh")
        if mesh_index is None or mesh_index >= len(meshes):
            continue

        scale = node.get("scale", [1.0, 1.0, 1.0])
        translation = node.get("translation", [0.0, 0.0, 0.0])

        for primitive in meshes[mesh_index].get("primitives", []):
            position = primitive.get("attributes", {}).get("POSITION")
            if position is None or position >= len(accessors):
                continue

            accessor = accessors[position]
            if len(accessor.get("min", [])) != 3 or len(accessor.get("max", [])) != 3:
                continue

            found = True
            for axis in range(3):
                low = accessor["min"][axis] * scale[axis] + translation[axis]
                high = accessor["max"][axis] * scale[axis] + translation[axis]
                # Une échelle négative inverse les bornes.
                lo[axis] = min(lo[axis], low, high)
                hi[axis] = max(hi[axis], low, high)

    return (lo, hi) if found else None


def find_parts(gltf: dict) -> dict[str, list[str]]:
    """Repère les pièces nommées, pour savoir si le modèle est réagençable."""
    names = [node.get("name", "") for node in gltf.get("nodes", [])]
    found: dict[str, list[str]] = {}

    for part, keywords in PART_KEYWORDS.items():
        matches = sorted(
            {n for n in names if n and any(k in n.lower() for k in keywords)}
        )
        found[part] = matches[:6]

    return found


def audit(path: Path) -> bool:
    gltf = read_gltf_json(path)
    size_mb = path.stat().st_size / 1_048_576

    nodes = gltf.get("nodes", [])
    meshes = gltf.get("meshes", [])
    animations = gltf.get("animations", [])

    # On ne traque que les échelles NON UNIFORMES, celles qui déforment l'objet
    # selon un axe. Une échelle uniforme est inoffensive : elle survit d'ailleurs
    # à un `flatten`, qui la déplace de la hiérarchie vers les nœuds feuilles.
    odd_scales = []
    for node in nodes:
        scale = node_scale(node)
        if scale is None:
            continue
        if max(scale) - min(scale) > 0.001 * max(abs(s) for s in scale):
            # Le vecteur complet, pas seulement sa première composante : une
            # échelle comme [1, 1, 0.91] paraîtrait sinon neutre.
            odd_scales.append((node.get("name", "?"), [round(s, 3) for s in scale]))

    depth = hierarchy_depth(gltf)
    box = bounding_box(gltf)

    checks: list[tuple[str, bool, str]] = [
        ("Nœuds", len(nodes) < MAX_NODES, f"{len(nodes)} (max {MAX_NODES})"),
        ("Meshes", len(meshes) < MAX_MESHES, f"{len(meshes)} (max {MAX_MESHES})"),
        ("Animations", len(animations) == 0, f"{len(animations)} (attendu 0)"),
        ("Profondeur", depth <= MAX_DEPTH, f"{depth} niveaux (max {MAX_DEPTH})"),
        (
            "Échelles ≠ 1",
            len(odd_scales) == 0,
            "aucune" if not odd_scales else f"{len(odd_scales)} — {odd_scales[:3]}",
        ),
        ("Poids", size_mb < MAX_SIZE_MB, f"{size_mb:.2f} Mo (max {MAX_SIZE_MB})"),
    ]

    if box is None:
        checks.append(("Boîte englobante", False, "illisible"))
    else:
        lo, hi = box
        extent = [hi[i] - lo[i] for i in range(3)]
        center = [(hi[i] + lo[i]) / 2 for i in range(3)]
        largest = max(extent)
        offset = max(abs(c) for c in center) / largest if largest > 0 else float("inf")

        checks.append(
            (
                "Centre",
                offset < MAX_CENTER_OFFSET,
                f"décalé de {offset * 100:.0f} % (max {MAX_CENTER_OFFSET * 100:.0f} %)",
            )
        )
        checks.append(
            (
                "Plus grand axe",
                MIN_EXTENT <= largest <= MAX_EXTENT,
                f"{largest:.3f} (attendu {MIN_EXTENT}–{MAX_EXTENT})",
            )
        )

    print(f"\n  Audit de {path.name}\n")

    passed = 0
    for name, ok, detail in checks:
        mark = "OK  " if ok else "ÉCHEC"
        print(f"  [{mark}] {name:16} {detail}")
        passed += ok

    print(f"\n  {passed}/{len(checks)} critères passés")

    print("\n  Pièces identifiables :")
    for part, matches in find_parts(gltf).items():
        print(f"    {part:10} {', '.join(matches) if matches else '— aucune'}")

    print()
    return passed == len(checks)


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 2

    path = Path(sys.argv[1])
    if not path.is_file():
        print(f"Fichier introuvable : {path}")
        return 2

    try:
        return 0 if audit(path) else 1
    except (ValueError, KeyError, struct.error) as error:
        print(f"Lecture impossible : {error}")
        return 2


if __name__ == "__main__":
    sys.exit(main())
