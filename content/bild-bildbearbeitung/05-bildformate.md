---
id: bildformate
area: bild-bildbearbeitung
titel_de: Bildformate
titel_fr: Formats d'image
reihenfolge: 5
lernfeld: LF3
lehrjahr: 2
typ: uebung
kstufe: K3
lernziele_de:
  - Ich benenne die Eigenschaften von JPG, PNG, WebP, SVG, RAW, TIFF, PSD und EPS.
  - Ich erkläre Transparenz, Kompression und Metadaten und wähle für eine Situation das passende Format.
lernziele_fr:
  - Je nomme les caractéristiques des formats JPG, PNG, WebP, SVG, RAW, TIFF, PSD et EPS.
  - J'explique la transparence, la compression et les métadonnées, et je choisis le format adapté à une situation.
tags: [bildformate, jpg, png, webp, svg, raw, tiff, psd, kompression, metadaten]
---

:::de
Ein Foto direkt vom Handy ist selten sofort einsatzbereit — auch das richtige Dateiformat gehört dazu. Diese Lektion zeigt, welches Format wofür geeignet ist.
:::
:::fr
Une photo prise directement avec le téléphone n'est rarement utilisable telle quelle — le bon format de fichier en fait aussi partie. Cette leçon montre quel format convient à quel usage.
:::

:::h2 de="Pixelgrafik-Formate" fr="Formats matriciels":::

| Format | Eigenschaften |
|---|---|
| **GIF** | 8 Bit (256 Farben), verlustfrei, unterstützt Transparenz und Animation. Ideal für Logos/Icons mit wenigen Farben — keine Fotoqualität, keine Metadaten. |
| **JPG/JPEG** | 16.7 Mio. Farben, verlustbehaftete Kompression (Qualität sinkt bei jedem erneuten Speichern), keine Transparenz. Ideal für Fotos — braucht mind. 150 ppi für den Druck. |
| **PNG** | Verlustfrei, unterstützt viele Transparenzstufen, bis 16 Mio. Farben. Ideal für kontrastreiche Webgrafiken/Logos — für hochwertige Fotos eher ungeeignet (grosse Dateien), kein CMYK. |
| **RAW** | Unbearbeitete Rohdaten der Kamera («digitales Negativ»), verlustfrei, maximaler Bearbeitungsspielraum, aber sehr grosse Dateien und nicht standardisiert (z. B. Nikon `.nef`). Braucht einen RAW-Converter. |
| **TIFF** | Verlustfrei, unterstützt Transparenz mit mehreren Ebenen sowie RGB und CMYK. Für den professionellen Print-/DTP-Bereich — für E-Mail oder Web meist zu gross. |
| **PSD** | Natives Photoshop-Format: mehrere Ebenen, alle Farbräume, Metadaten. Sehr hoher Speicherbedarf, proprietär — für die Weitergabe in ein gängiges Format exportieren. |

:::h2 de="Vektorgrafik-Formate" fr="Formats vectoriels":::

| Format | Eigenschaften |
|---|---|
| **EPS** | Kann Vektor- und Pixelgrafiken enthalten, softwareunabhängig, verlustfrei skalierbar (solange keine Pixelgrafik enthalten ist). Verliert an Bedeutung, aber noch oft bei Logos anzutreffen. |
| **SVG** | Reines Vektorformat für den Web-Einsatz, unterstützt Transparenz und Animation, in allen Browsern darstellbar. Ideal für Logos/Icons — weniger geeignet für sehr farbenreiche, aufwendige Bilder. |

:::h2 de="Transparenz, Kompression & Metadaten" fr="Transparence, compression & métadonnées":::

:::konzept titel_de="Drei Begriffe, die jedes Format prägen" titel_fr="Trois notions qui caractérisent chaque format"
:::de
**Transparenz ({{glossar:alphakanal}}):** Ein Bild ist eigentlich vollständig undurchsichtig. Der vierte Kanal neben Rot, Grün und Blau — der Alphakanal — legt fest, wie durchsichtig (opak) jedes Pixel ist. Damit lassen sich Bilder wie Folien übereinanderlegen.

**Kompression:** Verlustfreie Formate speichern alle Bildinformationen pixelgenau — keine Qualitätseinbusse, aber viel Speicherbedarf. Verlustbehaftete Formate reduzieren Informationen (z. B. Farbanzahl) oder lassen Wiederholungen weg — kleinere Dateien, aber Qualitätsverlust beim Vergrössern. JPG fasst dazu z. B. 8×8-Bildpunkte zu einem Farb-Mittelwert zusammen — für unser Auge kaum wahrnehmbar, aber deutlich speicherschonender.

**{{glossar:exif}}:** Nebst Dateiname und Grösse verraten Metadaten Urheber:in, Kameramodell sowie Ort und Zeit der Aufnahme. Praktisch für die eigene Verwaltung — aber auch ein Datenschutzthema, wenn du eigene Fotos veröffentlichst (siehe Recht, Ethik & Sicherheit → Datenschutz & Lizenzen).
:::
:::fr
**Transparence ({{glossar:alphakanal}}) :** une image est en principe entièrement opaque. Le quatrième canal, en plus du rouge, du vert et du bleu — le canal alpha — définit le degré de transparence (opacité) de chaque pixel. On peut ainsi superposer des images comme des transparents.

**Compression :** les formats sans perte enregistrent toute l'information au pixel près — aucune perte de qualité, mais un besoin de stockage important. Les formats avec perte réduisent l'information (p. ex. le nombre de couleurs) ou omettent les répétitions — fichiers plus petits, mais perte de qualité à l'agrandissement. Le JPG regroupe par exemple des blocs de 8×8 pixels en une valeur de couleur moyenne — quasi imperceptible à l'œil, mais nettement plus économe en mémoire.

**{{glossar:exif}} :** en plus du nom de fichier et de la taille, les métadonnées révèlent l'auteur·e, le modèle d'appareil ainsi que le lieu et l'heure de la prise de vue. Pratique pour sa propre gestion — mais aussi un enjeu de protection des données si tu publies tes propres photos (voir Droit, éthique & sécurité → Protection des données & licences).
:::
:::

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
