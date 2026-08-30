---
id: raster-vektor
area: bild-bildbearbeitung
titel_de: Raster- oder Vektorbilder
titel_fr: Images matricielles ou vectorielles
reihenfolge: 2
lernfeld: LF3
lehrjahr: 2
typ: theorie
kstufe: K3
lernziele_de:
  - Ich unterscheide Raster- und Vektorgrafiken und erkläre ihr Verhalten beim Skalieren.
  - Ich wähle das passende Bildformat für einen gegebenen Verwendungszweck.
lernziele_fr:
  - Je distingue les images matricielles et vectorielles et j'explique leur comportement à l'agrandissement.
  - Je choisis le format d'image adapté à un usage donné.
tags: [raster-grafik, vektor-grafik, pixel]
---

:::de
Ein digitales Bild ist nicht immer gleich gespeichert: Ein Bild kann mit Pixeln in einem Raster gespeichert werden — oder als Vektorgrafik, bei der die Elemente durch mathematische Formeln ausgedrückt werden. Wie ein Bild gespeichert ist, entscheidet massgeblich, wie gut es sich bearbeiten und skalieren lässt.
:::
:::fr
Une image numérique n'est pas toujours enregistrée de la même façon : elle peut être stockée avec des pixels dans une grille — ou comme image vectorielle, où les éléments sont exprimés par des formules mathématiques. La façon dont une image est enregistrée détermine largement sa capacité à être modifiée et redimensionnée.
:::

![Vergleich: Beim Vergrössern wird eine Rastergrafik grob und pixelig, eine Vektorgrafik bleibt scharf](/assets/svg/bild/raster-vs-vektor.svg)

:::h2 de="Pixelgrafiken (Raster-/Bitmap-Grafiken)" fr="Images matricielles (bitmap)":::

:::konzept titel_de="Wie ein Mosaik" titel_fr="Comme une mosaïque"
:::de
{{glossar:raster-grafik}} lassen sich mit Mosaiken vergleichen, da sie aus einzelnen Bildpunkten ({{glossar:pixel}}) in einem Raster bestehen — der Begriff «Pixel» ist ein Kunstwort aus *Picture Element*. Sie lassen sich nur mit Qualitätsverlust vergrössern, da die Pixelanzahl gleich bleibt: Pixel werden lediglich vergrössert, nie vermehrt — was zu sichtbarer Unschärfe («Treppenbildung») führt. Ausserdem benötigen sie mehr Speicherplatz als Vektorgrafiken, da jedes Pixel mit Grösse, Farbe und Koordinaten gespeichert werden muss.

**Merken:** Bilder, die du mit Smartphone oder Digitalkamera aufnimmst oder einscannst, sind immer Pixelgrafiken. Typische Programme dafür: Photoshop, Photoshop Elements sowie die kostenlosen Paint.net (Windows) und GIMP (Windows/Mac).

**Metapher:** Wie ein Mosaik aus Steinchen — willst du das Bild vergrössern, werden nur die vorhandenen Steinchen grösser. Neue, feinere Steinchen bekommst du nicht dazu.
:::
:::fr
Les {{glossar:raster-grafik}} sont comparables à des mosaïques, car elles se composent de points individuels ({{glossar:pixel}}) organisés en grille — le terme « pixel » est un mot-valise venant de *Picture Element*. Elles ne peuvent être agrandies qu'avec une perte de qualité, car le nombre de pixels reste constant : les pixels sont seulement agrandis, jamais multipliés — ce qui crée un flou visible (effet d'« escalier »). Elles nécessitent en outre plus d'espace de stockage que les images vectorielles, car chaque pixel doit enregistrer sa taille, sa couleur et ses coordonnées.

**À retenir :** les images prises avec un smartphone ou un appareil photo, ou numérisées, sont toujours des images matricielles. Logiciels typiques : Photoshop, Photoshop Elements, ainsi que les gratuits Paint.net (Windows) et GIMP (Windows/Mac).

**Métaphore :** comme une mosaïque de petites pierres — pour agrandir l'image, seules les pierres existantes grossissent. Tu n'obtiens pas de pierres nouvelles et plus fines.
:::
:::

:::h2 de="Vektorgrafiken" fr="Images vectorielles":::

:::konzept titel_de="Formen statt Pixel" titel_fr="Des formes plutôt que des pixels"
:::de
Eine {{glossar:vektor-grafik}} besteht aus mathematisch berechneten Formen (Linien, Kurven, Rechtecke, Ellipsen) und kann auch vektorisierte Texte enthalten. Eine Teilform lässt sich nur als Ganzes verändern oder löschen. Sie eignen sich nicht für fotorealistische Bilder — dafür liessen sich Vektorgrafiken ohne Qualitätsverlust fast unbeschränkt vergrössern und benötigen wenig Speicherplatz (ein Kreis braucht z. B. nur Mittelpunkt, Radius, Strichstärke und Farbe).

Typische Programme: Adobe Illustrator (professionell) oder die kostenlose Freeware Inkscape.

**Metapher:** Wie eine Bauanleitung statt eines fertigen Fotos — «zeichne einen Kreis mit Radius 5cm» bleibt bei jeder Grösse exakt gültig.
:::
:::fr
Une {{glossar:vektor-grafik}} se compose de formes calculées mathématiquement (lignes, courbes, rectangles, ellipses) et peut aussi contenir du texte vectorisé. Une forme partielle ne peut être modifiée ou supprimée que dans son ensemble. Ces images ne conviennent pas aux visuels photoréalistes — en revanche, elles peuvent être agrandies presque sans limite sans perte de qualité et nécessitent peu d'espace de stockage (un cercle n'a besoin, par exemple, que d'un centre, d'un rayon, d'une épaisseur de trait et d'une couleur).

Logiciels typiques : Adobe Illustrator (professionnel) ou le logiciel libre et gratuit Inkscape.

**Métaphore :** comme un plan de construction plutôt qu'une photo finie — « dessine un cercle de 5cm de rayon » reste exactement valable à n'importe quelle taille.
:::
:::

:::merksatz
:::de
Für Fotos, die mit einer Digitalkamera aufgenommen wurden oder aus Bildgalerien im Internet stammen, brauchst du immer ein Bildbearbeitungsprogramm für Rastergrafiken — nicht für Vektorgrafiken.
:::
:::fr
Pour les photos prises avec un appareil numérique ou provenant de galeries d'images sur Internet, il te faut toujours un logiciel de retouche pour images matricielles — pas pour images vectorielles.
:::
:::
