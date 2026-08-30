---
id: bildformate
area: bild-bildbearbeitung
titel_de: Bildformate
titel_fr: Formats d'image
reihenfolge: 3
lernfeld: LF3
lehrjahr: 2
typ: uebung
kstufe: K3
lernziele_de:
  - Ich benenne die Eigenschaften von JPG, PNG, WebP, SVG und RAW.
  - Ich wähle für eine gegebene Situation das passende Bildformat.
lernziele_fr:
  - Je nomme les caractéristiques des formats JPG, PNG, WebP, SVG et RAW.
  - Je choisis le format d'image adapté à une situation donnée.
tags: [bildformate, jpg, png, webp, svg, raw, "vertiefung-ausstehend"]
---

:::de
Ein Foto direkt vom Handy ist selten sofort einsatzbereit — auch das richtige Dateiformat gehört dazu. Diese Lektion zeigt, welches Format wofür geeignet ist.
:::
:::fr
Une photo prise directement avec le téléphone n'est rarement utilisable telle quelle — le bon format de fichier en fait aussi partie. Cette leçon montre quel format convient à quel usage.
:::

:::h2 de="Welches Format wofür?" fr="Quel format pour quel usage ?":::

| Format | Eigenschaften |
|---|---|
| **JPG/JPEG** | Verlustbehaftete Kompression, keine Transparenz, Pixelbild. Ideal für Fotos. |
| **PNG** | Verlustfreie Kompression, Transparenz möglich, Pixelbild. Ideal für Grafiken/Logos mit scharfen Kanten. |
| **WebP** | Moderne Kompression (verlustfrei/-behaftet wählbar), Transparenz möglich, kleinere Dateien als JPG/PNG. Ideal fürs Web. |
| **SVG** | Vektorformat (keine Pixel) — verlustfrei in jeder Grösse skalierbar. Ideal für Logos/Icons. |
| **RAW** | Unbearbeitete Rohdaten der Kamera, sehr grosse Dateien, maximaler Bearbeitungsspielraum. Ideal als Ausgangsmaterial vor der Bearbeitung. |

:::h2 de="Format der Situation zuordnen" fr="Associer le format à la situation":::

:::de
Welches Format passt am besten zu welcher Situation?
:::
:::fr
Quel format convient le mieux à quelle situation ?
:::

:::widget zone-sort
{
  "cols": 4,
  "zones": [
    { "id": "jpg", "labelDe": "JPG", "labelFr": "JPG" },
    { "id": "webp", "labelDe": "WebP", "labelFr": "WebP" },
    { "id": "svg", "labelDe": "SVG", "labelFr": "SVG" },
    { "id": "raw", "labelDe": "RAW", "labelFr": "RAW" }
  ],
  "items": [
    { "id": "foto-social", "textDe": "Ein Urlaubsfoto für Instagram posten", "textFr": "Publier une photo de vacances sur Instagram", "zone": "jpg", "explainDe": "JPG: Fotos mit vielen Farbverläufen komprimieren hier am effizientesten.", "explainFr": "JPG : les photos avec de nombreux dégradés de couleur se compressent ici le plus efficacement." },
    { "id": "logo-transparent", "textDe": "Ein Firmenlogo mit transparentem Hintergrund für die Website", "textFr": "Un logo d'entreprise à fond transparent pour le site web", "zone": "svg", "explainDe": "SVG (oder alternativ PNG): Logos sind meist einfache Formen, die als Vektor gestochen scharf in jeder Grösse bleiben.", "explainFr": "SVG (ou alternativement PNG) : les logos sont souvent des formes simples qui restent nettes en vecteur, à toute taille." },
    { "id": "web-foto", "textDe": "Viele Produktfotos für einen schnell ladenden Online-Shop", "textFr": "De nombreuses photos produit pour une boutique en ligne rapide", "zone": "webp", "explainDe": "WebP: kleinere Dateigrösse als JPG bei ähnlicher Qualität — wichtig für Ladezeiten.", "explainFr": "WebP : taille de fichier plus petite que JPG à qualité similaire — important pour les temps de chargement." },
    { "id": "ausgangsdatei", "textDe": "Eine Ausgangsdatei für eine aufwändige Fotobearbeitung", "textFr": "Un fichier de départ pour une retouche photo poussée", "zone": "raw", "explainDe": "RAW: enthält alle Sensordaten der Kamera, maximaler Bearbeitungsspielraum.", "explainFr": "RAW : contient toutes les données du capteur, marge de manœuvre maximale pour la retouche." },
    { "id": "icon-app", "textDe": "Ein Icon, das auf jedem Bildschirm scharf aussehen muss", "textFr": "Une icône qui doit rester nette sur tout écran", "zone": "svg", "explainDe": "SVG: Vektorformat, verlustfrei skalierbar, egal ob 16px oder 500px.", "explainFr": "SVG : format vectoriel, redimensionnable sans perte, que ce soit 16px ou 500px." }
  ]
}
:::

:::h2 de="Ressourcen" fr="Ressources":::
:::ressourcen
:::de
- [MDN – Bildformate im Web](https://developer.mozilla.org/de/docs/Web/Media/Formats/Image_types)
- [Squoosh – Bilder im Browser komprimieren/konvertieren](https://squoosh.app)
:::
:::fr
- [MDN – Formats d'image sur le Web](https://developer.mozilla.org/fr/docs/Web/Media/Formats/Image_types)
- [Squoosh – compresser/convertir des images dans le navigateur](https://squoosh.app)
:::
:::
