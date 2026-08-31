---
id: typografie-barrierefreiheit
area: gestaltungsgrundlagen
titel_de: Typografie & Barrierefreiheit
titel_fr: Typographie & accessibilité
reihenfolge: 3
lernfeld: LF3
lehrjahr: 2
typ: theorie
kstufe: K3
lernziele_de:
  - Ich wähle für einen Zweck eine passende Schriftart aus und begründe die Wahl.
  - Ich prüfe Farbkontraste nach WCAG und wende Gestaltungsregeln pro Kanal an.
lernziele_fr:
  - Je choisis une police adaptée à un usage et justifie mon choix.
  - Je vérifie les contrastes de couleur selon les WCAG et applique des règles de conception par canal.
tags: [typografie, barrierefreiheit, kontrast, wcag, gestaltung]
---

:::h2 de="Schriftarten" fr="Familles de polices":::

| Typ | Wirkung |
|---|---|
| **Serif** | edel, klassisch — gut für längeren Print-Fliesstext |
| **Humanist-Sans** | warm, zugänglich, leicht kalligrafisch — freundlicher als Grotesk |
| **Grotesk** | neutral, geometrisch, nüchtern — Standard für Interfaces |
| **Slab** | bodenständig, technisch-warm — kräftige Zwischentitel |
| **Display** | laut, plakativ — Blickfang für kurze Überschriften |
| **Script** | verspielt, persönlich — sparsam einsetzen, schwer lesbar in Fliesstext |
| **Mono** | technisch, präzise — Code, Zahlen, Tabellen |

:::h2 de="Schriftwirkung live ausprobieren" fr="Essayer l'effet des polices en direct":::

:::de
Wähle eine Schrift aus dem Dropdown und sieh, wie sich Headline und Fliesstext dabei verändern.
:::
:::fr
Choisis une police dans le menu déroulant et observe comment le titre et le texte courant changent.
:::

:::widget schrift-explorer
{
  "headlineDe": "Klarheit beginnt mit der richtigen Schrift.",
  "headlineFr": "La clarté commence par la bonne police.",
  "textDe": "Eine gute Schriftwahl unterstützt die Botschaft, statt von ihr abzulenken. Achte auf Lesbarkeit, Kontrast und eine Wirkung, die zum Inhalt passt.",
  "textFr": "Un bon choix de police soutient le message au lieu d'en détourner l'attention. Veille à la lisibilité, au contraste et à un effet adapté au contenu.",
  "categories": [
    { "labelDe": "Serif", "labelFr": "Serif", "fonts": [
      { "id": "serif", "family": "'Playfair Display Demo', Georgia, serif", "nameDe": "Playfair Display", "nameFr": "Playfair Display", "explainDe": "Edel, klassisch, hochwertig — wirkt bei längeren Texten schnell schwer. Gut für Überschriften bei Premium-Marken.", "explainFr": "Élégant, classique, haut de gamme — devient vite lourd sur de longs textes. Bon pour les titres de marques premium." }
    ]},
    { "labelDe": "Humanist-Sans", "labelFr": "Sans humaniste", "fonts": [
      { "id": "humanist", "family": "'Fira Sans Demo', 'Segoe UI', sans-serif", "nameDe": "Fira Sans", "nameFr": "Fira Sans", "explainDe": "Warm und zugänglich durch leicht kalligrafisch inspirierte Formen — freundlicher als eine geometrische Grotesk, dabei weiterhin gut lesbar auf Bildschirmen.", "explainFr": "Chaleureuse et accessible grâce à des formes légèrement calligraphiques — plus conviviale qu'une grotesque géométrique, tout en restant bien lisible à l'écran." }
    ]},
    { "labelDe": "Grotesk", "labelFr": "Grotesque", "fonts": [
      { "id": "grotesk", "family": "'Work Sans Demo', Arial, sans-serif", "nameDe": "Work Sans", "nameFr": "Work Sans", "explainDe": "Neutral, geometrisch, nüchtern aufgebaut — der sichere Standard für Interfaces und Fliesstext, ohne stilistische Extras.", "explainFr": "Neutre, géométrique, sobre — le standard sûr pour les interfaces et le texte courant, sans fioritures stylistiques." }
    ]},
    { "labelDe": "Slab", "labelFr": "Slab", "fonts": [
      { "id": "slab", "family": "'Roboto Slab Demo', Georgia, serif", "nameDe": "Roboto Slab", "nameFr": "Roboto Slab", "explainDe": "Bodenständig, technisch-warm — kräftige Balken machen kurze Wörter/Zahlen besonders stabil und gut lesbar.", "explainFr": "Solide, technique et chaleureux — les barres épaisses rendent les mots/chiffres courts particulièrement stables et lisibles." }
    ]},
    { "labelDe": "Display", "labelFr": "Display", "fonts": [
      { "id": "display", "family": "'Bebas Neue Demo', Impact, sans-serif", "nameDe": "Bebas Neue", "nameFr": "Bebas Neue", "explainDe": "Laut, plakativ, raumsparend — perfekt für kurze Blickfang-Überschriften, unlesbar in Fliesstext.", "explainFr": "Fort, affiché, compact — parfait pour de courts titres accrocheurs, illisible en texte courant." }
    ]},
    { "labelDe": "Script", "labelFr": "Script", "fonts": [
      { "id": "script", "family": "'Dancing Script Demo', cursive", "nameDe": "Dancing Script", "nameFr": "Dancing Script", "explainDe": "Verspielt, persönlich, handschriftlich — wirkt einladend, aber nur sparsam und nie für längere Texte einsetzen.", "explainFr": "Ludique, personnel, manuscrit — paraît accueillant, mais à utiliser avec parcimonie et jamais pour de longs textes." }
    ]},
    { "labelDe": "Mono", "labelFr": "Mono", "fonts": [
      { "id": "mono", "family": "'Space Mono Demo', 'Courier New', monospace", "nameDe": "Space Mono", "nameFr": "Space Mono", "explainDe": "Technisch, präzise — jedes Zeichen gleich breit, ideal für Code, Zahlenkolonnen und Tabellen.", "explainFr": "Technique, précis — chaque caractère a la même largeur, idéal pour le code, les colonnes de chiffres et les tableaux." }
    ]}
  ]
}
:::

:::h2 de="Schriftpaarung: gut vs. schlecht" fr="Association de polices : bon vs. mauvais":::

:::de
Faustregel: maximal 2 Schriftfamilien pro Dokument — eine für Überschriften, eine ruhige für Fliesstext. Zwei sehr ähnliche Schriften nebeneinander wirken dagegen oft wie ein Versehen: z. B. eine Serif-Überschrift kombiniert mit ruhigem Sans-Serif-Fliesstext wirkt bewusst, dieselbe Serif-Überschrift kombiniert mit einer zweiten, sehr ähnlichen Serif-Schrift im Fliesstext wirkt wie ein Versehen.
:::
:::fr
Règle empirique : maximum 2 familles de polices par document — une pour les titres, une police sobre pour le texte courant. Deux polices très similaires côte à côte paraissent en revanche souvent accidentelles : un titre serif combiné à un texte courant sans-serif sobre paraît intentionnel, tandis que le même titre serif combiné à une seconde police serif très similaire dans le texte courant paraît accidentel.
:::

:::h2 de="Barrierefreiheit: Kontrast zählt" fr="Accessibilité : le contraste compte":::

:::de
Schöne Farben nützen nichts, wenn der Text nicht lesbar ist. Die WCAG (Web Content Accessibility Guidelines) legen Mindest-Kontrastverhältnisse fest: **AA** (Standard) verlangt 4.5:1 für Normaltext bzw. 3:1 für Grosstext, **AAA** (erhöht) verlangt 7:1 bzw. 4.5:1.
:::
:::fr
De belles couleurs ne servent à rien si le texte n'est pas lisible. Les WCAG (Web Content Accessibility Guidelines) fixent des ratios de contraste minimaux : **AA** (standard) exige 4.5:1 pour le texte normal, resp. 3:1 pour le grand texte ; **AAA** (renforcé) exige 7:1, resp. 4.5:1.
:::

:::h2 de="WCAG-Kontrast-Checker" fr="Vérificateur de contraste WCAG":::

:::de
Wähle zwei Farben und prüfe live, ob sie genug Kontrast für barrierefreien Text bieten.
:::
:::fr
Choisis deux couleurs et vérifie en direct si elles offrent assez de contraste pour un texte accessible.
:::

:::widget kontrast-checker:::

:::h2 de="Gestaltungsregeln pro Kanal" fr="Règles de conception par canal":::

| Kanal | Worauf achten |
|---|---|
| **Print** | CMYK statt RGB, hohe Auflösung (mind. 300 dpi), Anschnitt/Blutrand für randabfallende Elemente einplanen |
| **Social Media** | plattformspezifische Formate/Seitenverhältnisse beachten, kurze Texte, mobile-first |
| **Web** | RGB, responsive (funktioniert auf jeder Bildschirmgrösse), Ladezeit optimieren, Barrierefreiheit beachten |

:::h2 de="Ressourcen" fr="Ressources":::
:::ressourcen
:::de
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Google Fonts](https://fonts.google.com)
:::
:::fr
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Google Fonts](https://fonts.google.com)
:::
:::
