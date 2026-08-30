---
id: sound-design-podcast
area: audio
titel_de: Sound-Design & Podcast-Struktur
titel_fr: Sound design & structure de podcast
reihenfolge: 4
lernfeld: LF3
lehrjahr: 2
typ: uebung
kstufe: K3
lernziele_de:
  - Ich erkläre das Sound-Ebenen-Modell (Sprache, Musik, SFX, Atmo).
  - Ich erarbeite ein einfaches Skript/Storyboard für eine Audio-Produktion.
lernziele_fr:
  - J'explique le modèle des couches sonores (parole, musique, SFX, ambiance).
  - J'élabore un script/storyboard simple pour une production audio.
tags: [sound-design, sfx, atmo, skript, podcast]
---

:::h2 de="Das Sound-Ebenen-Modell" fr="Le modèle des couches sonores":::

:::konzept titel_de="Vier Ebenen, ein Ganzes" titel_fr="Quatre couches, un tout"
:::de
Professioneller Ton besteht praktisch nie aus einer einzigen Spur, sondern aus mehreren übereinandergelegten Ebenen: **Sprache/Dialog** ist der inhaltliche Kern. **Musik** steuert die emotionale Grundstimmung. **{{glossar:sfx}}** sind gezielte Akzente. **{{glossar:atmo}}** ist die «Hintergrundluft», die eine Aufnahme glaubwürdig macht.

**Metapher:** Wie bei einer Lasagne — jede Schicht für sich wäre unspektakulär, aber zusammen ergeben sie etwas Vollständiges.
:::
:::fr
Un son professionnel se compose presque toujours de plusieurs couches superposées : la **parole/dialogue** est le cœur du contenu. La **musique** dirige l'ambiance émotionnelle générale. Les **{{glossar:sfx}}** sont des accents ciblés. L'**{{glossar:atmo}}** est «l'air de fond» qui rend un enregistrement crédible.

**Métaphore :** comme une lasagne — chaque couche seule serait quelconque, mais ensemble elles forment un tout.
:::
:::

:::h2 de="Sound-Rezept bauen" fr="Compose une recette sonore":::

:::de
Wähle für ein Szenario je eine Zutat aus den drei Ebenen Musik, SFX und Atmo.
:::
:::fr
Choisis un ingrédient dans chacune des trois couches — musique, SFX et ambiance — pour un scénario donné.
:::

:::widget sound-rezept
{
  "szenarien": [
    { "id": "gasse", "textDe": "Eine dunkle Gasse spätnachts, eine Person geht allein.", "textFr": "Une ruelle sombre tard le soir, une personne marche seule.", "ziel": "spannung", "zielLabelDe": "Spannung/Unbehagen", "zielLabelFr": "Tension/malaise" },
    { "id": "sieg", "textDe": "Eine Sportmannschaft gewinnt im letzten Moment.", "textFr": "Une équipe sportive gagne au dernier moment.", "ziel": "froehlich", "zielLabelDe": "Freude/Euphorie", "zielLabelFr": "Joie/euphorie" },
    { "id": "aussicht", "textDe": "Drohnenaufnahme über einer Berglandschaft bei Sonnenaufgang.", "textFr": "Prise de vue par drone d'un paysage montagneux au lever du soleil.", "ziel": "episch", "zielLabelDe": "Episch/Grossartig", "zielLabelFr": "Épique/grandiose" }
  ],
  "musik": [
    { "id": "dissonant", "labelDe": "tief, langsam, dissonant", "labelFr": "grave, lent, dissonant", "tags": ["spannung"] },
    { "id": "treibend", "labelDe": "hell, schnell, treibend", "labelFr": "clair, rapide, entraînant", "tags": ["froehlich"] },
    { "id": "orchestral", "labelDe": "grosses Orchester, breite Streicher", "labelFr": "grand orchestre, cordes amples", "tags": ["episch"] },
    { "id": "keine", "labelDe": "keine Musik, nur Stille", "labelFr": "pas de musique, seulement le silence", "tags": ["spannung"] }
  ],
  "sfx": [
    { "id": "scharf", "labelDe": "plötzlicher, scharfer Akzent (Jump-Scare-Sound)", "labelFr": "accent soudain et net (effet de sursaut)", "tags": ["spannung"] },
    { "id": "jubel", "labelDe": "Jubel, Applaus, helle Klicks", "labelFr": "acclamations, applaudissements, clics clairs", "tags": ["froehlich"] },
    { "id": "weiter", "labelDe": "weiter Wind-Whoosh", "labelFr": "long souffle de vent (whoosh)", "tags": ["episch"] },
    { "id": "schritte", "labelDe": "einzelne, hallende Schritte", "labelFr": "pas isolés et résonnants", "tags": ["spannung"] }
  ],
  "atmo": [
    { "id": "leer", "labelDe": "unheimlich leer, entfernter Verkehrslärm", "labelFr": "étrangement vide, bruit de circulation lointain", "tags": ["spannung"] },
    { "id": "belebt", "labelDe": "belebt, Stimmengewirr, Feiernde", "labelFr": "animé, brouhaha de voix, gens qui font la fête", "tags": ["froehlich"] },
    { "id": "natur", "labelDe": "weite Naturkulisse, Wind in der Höhe", "labelFr": "vaste décor naturel, vent en altitude", "tags": ["episch"] },
    { "id": "ruhig", "labelDe": "ruhige Innenraum-Atmo", "labelFr": "ambiance intérieure calme", "tags": ["froehlich", "episch"] }
  ]
}
:::

:::h2 de="Freie Plattformen für Musik & Soundeffekte" fr="Plateformes libres pour musique & effets sonores":::

| Plattform | Am besten geeignet für |
|---|---|
| [Pixabay](https://pixabay.com/music/) | breite, einsteigerfreundliche Grundauswahl |
| [Freesound.org](https://freesound.org) | riesige Geräusche-Datenbank — Lizenz einzeln prüfen |
| YouTube Audio Library | direkt in YouTube Studio integriert |
| [Mixkit](https://mixkit.co) | kuratierte Auswahl, hohe Qualität |
| [Zapsplat](https://zapsplat.com) | sehr grosse SFX-Bibliothek |

:::h2 de="Warum ein Skript wichtig ist" fr="Pourquoi un script est important":::

:::de
Auch ein 30-Sekunden-Podcast-Teaser klingt sicherer und runder, wenn du vorher weisst, was du sagen willst — nicht Wort für Wort ablesen, sondern die Kernpunkte und die Reihenfolge festlegen.
:::
:::fr
Même un teaser de podcast de 30 secondes sonne plus sûr et plus abouti si tu sais à l'avance ce que tu veux dire — pas besoin de tout lire mot à mot, mais fixer les points clés et leur ordre.
:::

:::widget vorlage
{
  "storageKey": "lh_audio_skript",
  "fields": [
    { "key": "thema", "labelDe": "Thema/Ziel der Aufnahme", "labelFr": "Thème/objectif de l'enregistrement", "type": "text", "placeholderDe": "z. B. Kurzer Podcast-Teaser zum Thema ...", "placeholderFr": "p. ex. court teaser de podcast sur le thème ..." },
    { "key": "zielgruppe", "labelDe": "Zielgruppe", "labelFr": "Public cible", "type": "text", "placeholderDe": "Wer hört zu?", "placeholderFr": "Qui écoute ?" },
    { "key": "kernpunkte", "labelDe": "Kernpunkte (Stichworte, Reihenfolge)", "labelFr": "Points clés (mots-clés, ordre)", "type": "textarea", "placeholderDe": "1. Begrüssung ...\n2. Hauptaussage ...\n3. Abschluss/Call-to-Action ...", "placeholderFr": "1. Accueil ...\n2. Message principal ...\n3. Conclusion/appel à l'action ..." },
    { "key": "ton", "labelDe": "Ton/Stil", "labelFr": "Ton/style", "type": "text", "placeholderDe": "z. B. locker & persönlich", "placeholderFr": "p. ex. décontracté et personnel" },
    { "key": "storyboard", "labelDe": "Storyboard: Ebenen pro Abschnitt", "labelFr": "Storyboard : couches par section", "type": "textarea", "placeholderDe": "Intro: Jingle + Anmoderation\nHauptteil: Sprache + leises Musikbett\nOutro: Zusammenfassung + Outro-Jingle", "placeholderFr": "Intro : jingle + présentation\nCorps : parole + tapis musical discret\nOutro : résumé + jingle de fin" }
  ]
}
:::
