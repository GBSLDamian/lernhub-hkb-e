---
id: rgb-cmyk
area: bild-bildbearbeitung
titel_de: RGB & CMYK verstehen
titel_fr: Comprendre le RVB et le CMJN
reihenfolge: 1
lernfeld: LF3
lehrjahr: 1
typ: theorie
kstufe: K2
lernziele_de:
  - Ich erkläre den Unterschied zwischen additiver und subtraktiver Farbmischung.
  - Ich wähle für Bildschirm- und Druckprodukte das passende Farbmodell.
lernziele_fr:
  - J'explique la différence entre mélange de couleurs additif et soustractif.
  - Je choisis le modèle de couleur adapté pour les écrans et les produits imprimés.
tags: [farbe, druck, bildschirm, grundlagen]
---

:::h2 de="Zwei Wege, Farbe zu machen" fr="Deux façons de faire de la couleur":::

:::de
Auf dem Bildschirm entsteht Farbe aus **Licht**. Im Druck entsteht Farbe aus **Farbpigmenten** auf Papier. Weil Licht und Pigment sich völlig unterschiedlich verhalten, braucht es zwei verschiedene Farbmodelle: RGB für Bildschirme, CMYK für den Druck.
:::

:::fr
Sur un écran, la couleur naît de la **lumière**. À l'impression, la couleur naît de **pigments** sur papier. Comme la lumière et les pigments se comportent très différemment, il faut deux modèles de couleur distincts : RVB pour les écrans, CMJN pour l'impression.
:::

:::konzept titel_de="Additiv vs. subtraktiv" titel_fr="Additif vs. soustractif" bild="rgb-cmyk-venn"
:::de
**RGB (additiv):** Rot, Grün und Blau werden als Licht übereinandergelegt. Je mehr Licht dazukommt, desto heller wird es — alle drei zusammen ergeben Weiss. Das ist wie drei Taschenlampen (rot, grün, blau), die man in einem dunklen Raum auf dieselbe Stelle richtet.

**CMYK (subtraktiv):** Cyan, Magenta, Gelb (Yellow) und Schwarz (Key) werden als Farbe auf weisses Papier gedruckt. Jede Farbschicht **schluckt** einen Teil des Lichts, das vom Papier zurückgeworfen wird. Je mehr Farbe dazukommt, desto dunkler wird es — alle zusammen ergeben (theoretisch) Schwarz.

**Metapher:** RGB ist wie Licht mischen im Dunkeln — mehr Licht = heller. CMYK ist wie mit Filtern vor einer Lampe stehen — mehr Filter = dunkler.
:::
:::fr
**RVB (additif) :** le rouge, le vert et le bleu se superposent comme de la lumière. Plus il y a de lumière, plus c'est clair — les trois ensemble donnent du blanc. C'est comme trois lampes de poche (rouge, verte, bleue) dirigées au même endroit dans une pièce sombre.

**CMJN (soustractif) :** cyan, magenta, jaune (Yellow) et noir (Key) sont imprimés comme couleur sur du papier blanc. Chaque couche de couleur **absorbe** une partie de la lumière renvoyée par le papier. Plus il y a de couleur, plus c'est sombre — l'ensemble donne (en théorie) du noir.

**Métaphore :** le RVB, c'est mélanger de la lumière dans le noir — plus de lumière = plus clair. Le CMJN, c'est se tenir devant une lampe avec des filtres — plus de filtres = plus sombre.
:::
:::

:::merksatz
:::de
**Bildschirm = RGB. Druck = CMYK.** Ein Bild, das nur für den Bildschirm bestimmt ist, bleibt in RGB. Geht es in den Druck, muss es nach CMYK konvertiert werden — sonst wirken Farben im Druck oft stumpfer als am Bildschirm.
:::
:::fr
**Écran = RVB. Impression = CMJN.** Une image destinée uniquement à l'écran reste en RVB. Si elle part à l'impression, elle doit être convertie en CMJN — sinon les couleurs paraissent souvent plus ternes à l'impression qu'à l'écran.
:::
:::

:::h2 de="Ausprobieren" fr="À essayer":::

:::de
Bewege die Regler und beobachte, wie sich derselbe Farbwert je nach Modell verhält.
:::
:::fr
Déplace les curseurs et observe comment la même valeur de couleur se comporte selon le modèle.
:::

:::widget rgb-cmyk-mischer:::

:::h2 de="Bonus: Farbkontrast prüfen" fr="Bonus : vérifier le contraste des couleurs":::

:::de
RGB-Werte bestimmen nicht nur, wie eine Farbe aussieht — sie bestimmen auch, ob Text auf einem Hintergrund gut lesbar ist. Prüfe zwei Farben auf ihren Kontrast (WCAG-Richtwert für Fliesstext: mindestens 4.5:1).
:::
:::fr
Les valeurs RVB ne déterminent pas seulement l'apparence d'une couleur — elles déterminent aussi si un texte reste lisible sur un fond donné. Teste deux couleurs pour leur contraste (valeur de référence WCAG pour le texte courant : au moins 4.5:1).
:::

:::widget kontrast-checker:::

:::h2 de="Ressourcen" fr="Ressources":::

:::ressourcen
:::de
- [Farbmanagement einfach erklärt (PDF-Leitfaden, extern)](https://www.google.com/search?q=farbmanagement+rgb+cmyk+leitfaden)
:::
:::fr
- [Gestion des couleurs expliquée simplement (guide PDF, externe)](https://www.google.com/search?q=gestion+des+couleurs+rvb+cmjn+guide)
:::
:::
