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
tags: [sound-design, sfx, atmo, skript, podcast, foley]
---

:::h2 de="Die Wichtigkeit von Ton" fr="L'importance du son":::

:::de
Der Ton transportiert Dialoge, Soundeffekte und Musik und vermittelt so Stimmung und Atmosphäre eines Films oder Podcasts. Ohne eine qualitativ hochwertige Tonspur bleibt das Erlebnis unvollständig. Interessant dabei: **Fehler im Bild werden vom Publikum oft toleriert** — ein kurz unscharfes Gesicht oder ein leichtes Wackeln stört selten gross. Fehlt aber über eine gewisse Zeit der Ton oder ist ein Rascheln hörbar, empfinden wir das sofort als störend. Im Tonbereich lohnt es sich darum, besonders sorgfältig zu arbeiten.
:::
:::fr
Le son transporte les dialogues, les effets sonores et la musique, transmettant ainsi l'ambiance d'un film ou d'un podcast. Sans piste audio de qualité, l'expérience reste incomplète. Fait intéressant : **le public tolère souvent les défauts d'image** — un visage brièvement flou ou un léger tremblement dérange rarement beaucoup. Mais si le son manque un moment ou qu'un bruissement est audible, on le perçoit immédiatement comme gênant. Il vaut donc la peine de travailler le son avec un soin particulier.
:::

:::h2 de="Das Sound-Ebenen-Modell" fr="Le modèle des couches sonores":::

:::konzept titel_de="Fünf Ebenen, ein Ganzes" titel_fr="Cinq couches, un tout"
:::de
Professioneller Ton besteht praktisch nie aus einer einzigen Spur, sondern aus mehreren übereinandergelegten Ebenen: **Dialoge** transportieren Informationen über Handlung, Charaktere und ihre Beziehungen. **Musik** steuert die emotionale Grundstimmung. **{{glossar:sfx}}** sind gezielte Akzente. **{{glossar:atmo}}** ist die «Hintergrundluft», die eine Aufnahme glaubwürdig macht. **Sprecherstimme/Off-Text** liefert — gerade in Dokumentarfilmen oder Reportagen — zusätzliche Informationen zur Handlung und kann komplexe Zusammenhänge verständlich erklären.

**Metapher:** Wie bei einer Lasagne — jede Schicht für sich wäre unspektakulär, aber zusammen ergeben sie etwas Vollständiges.
:::
:::fr
Un son professionnel se compose presque toujours de plusieurs couches superposées : les **dialogues** transportent des informations sur l'action, les personnages et leurs relations. La **musique** dirige l'ambiance émotionnelle générale. Les **{{glossar:sfx}}** sont des accents ciblés. L'**{{glossar:atmo}}** est «l'air de fond» qui rend un enregistrement crédible. La **voix off** apporte — surtout dans les documentaires ou reportages — des informations supplémentaires sur l'action et peut expliquer clairement des contextes complexes.

**Métaphore :** comme une lasagne — chaque couche seule serait quelconque, mais ensemble elles forment un tout.
:::
:::

:::h2 de="Foley-Geräusche" fr="Bruitages Foley":::

:::de
Manchmal können nicht alle Geräusche während des Drehs sauber aufgenommen werden. Dann kommen {{glossar:foley}} ins Spiel: nachträglich mit Hilfsmitteln erzeugte Nachahmungen von alltäglichen Geräuschen (Schritte, Türen, Stoffrascheln), die die Atmosphäre und Authentizität einer Szene verstärken.
:::
:::fr
Parfois, tous les sons ne peuvent pas être enregistrés proprement pendant le tournage. C'est là qu'interviennent les {{glossar:foley}} : des imitations de bruits du quotidien (pas, portes, froissement de tissu) recréées après coup avec des accessoires, qui renforcent l'atmosphère et l'authenticité d'une scène.
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
| [Artlist](https://artlist.io) | kuratierte Musik & SFX im Abo, häufig in der Werbebranche genutzt |
| [Soundstripe](https://soundstripe.com) | Abo-Bibliothek mit einfacher Lizenzierung für Unternehmen |

:::de
Wichtig: Auch bei kostenlosen Datenbanken immer die Lizenzbedingungen prüfen — manche Werke sind komplett frei, andere erfordern eine Namensnennung oder dürfen nur nicht-kommerziell verwendet werden.
:::
:::fr
Important : même avec des bases de données gratuites, toujours vérifier les conditions de licence — certaines œuvres sont entièrement libres, d'autres exigent une mention d'auteur ou ne peuvent être utilisées qu'à des fins non commerciales.
:::

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
