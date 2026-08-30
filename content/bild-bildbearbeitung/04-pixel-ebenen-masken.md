---
id: pixel-ebenen-masken
area: bild-bildbearbeitung
titel_de: Pixel, Ebenen & Masken
titel_fr: Pixels, calques & masques
reihenfolge: 4
lernfeld: LF3
lehrjahr: 2
typ: theorie
kstufe: K3
lernziele_de:
  - Ich erkläre die Begriffe Pixel, Auflösung und DPI und weiss, wann welcher zählt.
  - Ich nutze Ebenen und Masken, um Bilder zerstörungsfrei zu bearbeiten.
lernziele_fr:
  - J'explique les notions de pixel, résolution et DPI et sais laquelle compte quand.
  - J'utilise des calques et des masques pour retoucher des images de manière non destructive.
tags: [pixel, aufloesung, dpi, ebenen, maske, grundlagen]
---

:::de
Ein Foto direkt vom Handy ist selten sofort einsatzbereit: zu dunkel, falscher Ausschnitt oder schlicht die falsche Grösse für die Plattform. Dieser Baustein liefert die Grundbegriffe, mit denen jede Bildbearbeitung beginnt.
:::
:::fr
Une photo prise directement avec le téléphone est rarement utilisable telle quelle : trop sombre, mauvais cadrage, ou simplement la mauvaise taille pour la plateforme. Ce module pose les bases avec lesquelles commence toute retouche d'image.
:::

:::h2 de="Pixel, Auflösung & DPI" fr="Pixels, résolution & DPI":::

:::konzept titel_de="Wie fein ist ein Bild?" titel_fr="Quelle est la finesse d'une image ?"
:::de
Ein {{glossar:pixel}} ist der kleinste Bildpunkt eines digitalen Bilds. Die {{glossar:aufloesung}} gibt an, aus wie vielen Pixeln ein Bild besteht (z. B. 1920×1080). **DPI** (Dots per Inch) ist für den **Druck** relevant – wie viele Punkte pro Zoll gedruckt werden (Richtwert: mind. 300 dpi für scharfen Print) –, während für Bildschirme meist nur die reine Pixelanzahl zählt.

**Metapher:** Wie ein Mosaik aus kleinen Steinchen: Je kleiner und zahlreicher die Steinchen, desto feiner und detailreicher wirkt das Gesamtbild aus der Nähe betrachtet.
:::
:::fr
Un {{glossar:pixel}} est le plus petit point d'une image numérique. La {{glossar:aufloesung}} indique de combien de pixels une image est composée (p. ex. 1920×1080). Le **DPI** (points par pouce) est déterminant pour l'**impression** – combien de points sont imprimés par pouce (valeur de référence : min. 300 dpi pour un tirage net) –, alors que pour les écrans, seul le nombre de pixels compte généralement.

**Métaphore :** comme une mosaïque de petites pierres : plus les pierres sont petites et nombreuses, plus l'image d'ensemble paraît fine et détaillée de près.
:::
:::

:::h2 de="Absolute & relative Auflösung" fr="Résolution absolue & relative":::

:::de
Die Angabe der Auflösung ist oft verwirrend, weil zwei verschiedene Grössen gemeint sein können:

- **Absolute Auflösung:** die Gesamtzahl der Pixel, z. B. «12 Megapixel». Sie sagt wenig über die Bildqualität aus und nichts über das Seitenverhältnis (Hoch-, Querformat, 4:3 oder 16:9).
- **Relative Auflösung:** die «Dichte» der Pixel — Anzahl Pixel pro Zoll (ppi). Sie bestimmt, wie gross ein Bild ausgedruckt werden kann, ohne unscharf zu wirken.

Empfohlene relative Auflösung je nach Einsatz:

| Verwendung | Empfohlene Auflösung |
|---|---|
| Internet/Bildschirm | 72 ppi |
| Poster (grosser Betrachtungsabstand) | unter 100 ppi |
| Dokumente (Laser-/Tintenstrahldrucker, A4) | 100–150 ppi |
| Zeitschriften, Bücher, Hochglanz-Broschüren | 300 ppi |
:::
:::fr
L'indication de la résolution prête souvent à confusion, car deux grandeurs différentes peuvent être visées :

- **Résolution absolue :** le nombre total de pixels, p. ex. « 12 mégapixels ». Elle en dit peu sur la qualité de l'image et rien sur le format (portrait, paysage, 4:3 ou 16:9).
- **Résolution relative :** la « densité » des pixels — nombre de pixels par pouce (ppi). Elle détermine la taille d'impression possible sans que l'image paraisse floue.

Résolution relative recommandée selon l'usage :

| Usage | Résolution recommandée |
|---|---|
| Internet/écran | 72 ppi |
| Poster (grande distance de vue) | moins de 100 ppi |
| Documents (imprimante laser/jet d'encre, A4) | 100–150 ppi |
| Magazines, livres, brochures glacées | 300 ppi |
:::

:::konzept titel_de="Rechenbeispiel: DIN-A3-Flyer" titel_fr="Exemple de calcul : flyer A3"
:::de
Ein DIN-A3-Flyer (42.0 × 29.7 cm) soll mit mindestens 150 ppi gedruckt werden. Rechnung: Höhe in cm ÷ 2.54 cm × gewünschte Auflösung.

- Höhe: 42.0 cm ÷ 2.54 cm × 150 = **2480 Pixel**
- Breite: 29.7 cm ÷ 2.54 cm × 150 = **1754 Pixel**

Das Bild braucht also mindestens 2480 × 1754 Pixel (rund 4.35 Megapixel), damit der Druck bei 150 ppi scharf aussieht.

**Merken:** Da du einem Bild keine zusätzlichen Pixel hinzufügen kannst, wirkt sich eine zu niedrige Auflösung vor allem beim Vergrössern negativ aus. Viele Bilder aus dem Internet sehen am (niedrig auflösenden) Bildschirm gut aus — die Überraschung folgt erst beim Ausdrucken.
:::
:::fr
Un flyer A3 (42.0 × 29.7 cm) doit être imprimé à au moins 150 ppi. Calcul : hauteur en cm ÷ 2.54 cm × résolution souhaitée.

- Hauteur : 42.0 cm ÷ 2.54 cm × 150 = **2480 pixels**
- Largeur : 29.7 cm ÷ 2.54 cm × 150 = **1754 pixels**

L'image a donc besoin d'au moins 2480 × 1754 pixels (environ 4.35 mégapixels) pour que l'impression paraisse nette à 150 ppi.

**À retenir :** comme on ne peut pas ajouter de pixels supplémentaires à une image, une résolution trop basse se remarque surtout à l'agrandissement. Beaucoup d'images d'Internet ont l'air bien sur un écran (à basse résolution) — la surprise vient seulement à l'impression.
:::
:::

:::h2 de="Ebenen & Masken" fr="Calques & masques":::

:::konzept titel_de="Unabhängig bearbeiten, nichts zerstören" titel_fr="Modifier indépendamment, sans rien détruire"
:::de
{{glossar:ebenen}} erlauben es, Bildelemente unabhängig voneinander zu bearbeiten – wie transparente Folien übereinander. Eine {{glossar:maske}} blendet Teile einer Ebene aus, ohne sie zu löschen: Schwarz auf der Maske = unsichtbar, Weiss = sichtbar – jederzeit rückgängig machbar.

**Metapher:** Ebenen sind wie ein Stapel durchsichtiger Folien auf einem Overhead-Projektor. Eine Maske ist wie ein Stück Klebeband auf einer Folie: Es verdeckt einen Teil, ohne die Folie selbst zu zerschneiden – Klebeband entfernen, und alles ist wieder da.
:::
:::fr
Les {{glossar:ebenen}} permettent de modifier des éléments d'image indépendamment les uns des autres – comme des feuilles transparentes superposées. Un {{glossar:maske}} masque une partie d'un calque sans la supprimer : noir sur le masque = invisible, blanc = visible – réversible à tout moment.

**Métaphore :** les calques sont comme une pile de transparents sur un rétroprojecteur. Un masque est comme un morceau de ruban adhésif sur un transparent : il cache une partie sans découper la feuille elle-même – on enlève le ruban, et tout réapparaît.
:::
:::

:::h2 de="Zerstörungsfrei arbeiten" fr="Travailler de manière non destructive":::

:::de
„Zerstörungsfrei" (non-destructive) heisst: Das Originalbild bleibt unverändert erhalten, Anpassungen (Helligkeit, Zuschnitt, Filter) werden als separate, jederzeit änderbare Schritte gespeichert – statt das Bild direkt zu überschreiben. So kannst du jederzeit zu einer früheren Version zurück, ohne von vorne beginnen zu müssen.
:::
:::fr
« Non destructif » signifie : l'image originale reste inchangée, les ajustements (luminosité, recadrage, filtres) sont enregistrés comme des étapes séparées et modifiables à tout moment — au lieu d'écraser directement l'image. Tu peux ainsi revenir à une version antérieure à tout moment, sans devoir tout recommencer.
:::

:::h2 de="Ressourcen" fr="Ressources":::
:::ressourcen
:::de
- [Photopea – kostenloser, browserbasierter Bildeditor mit Ebenen/Masken](https://www.photopea.com)
:::
:::fr
- [Photopea – éditeur d'image gratuit dans le navigateur, avec calques et masques](https://www.photopea.com)
:::
:::
