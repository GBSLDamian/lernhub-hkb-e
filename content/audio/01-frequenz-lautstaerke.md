---
id: frequenz-lautstaerke
area: audio
titel_de: Frequenz & Lautstärke
titel_fr: Fréquence & volume
reihenfolge: 1
lernfeld: LF3
lehrjahr: 2
typ: theorie
kstufe: K3
lernziele_de:
  - Ich erkläre die Begriffe Frequenz, dB, dBFS und LUFS.
  - Ich erkläre, wie Clipping entsteht und wie es vermieden wird.
lernziele_fr:
  - J'explique les notions de fréquence, dB, dBFS et LUFS.
  - J'explique comment naît l'écrêtage (clipping) et comment l'éviter.
tags: [frequenz, lautstaerke, dbfs, lufs, clipping, ton]
---

:::de
Schall ist nichts anderes als Luft, die in Wellen schwingt — wenn du sprichst, bringt deine Stimme die Luft vor deinem Mund ins Zittern, und dieses Zittern breitet sich aus, bis es dein Ohr (oder ein Mikrofon) erreicht.
:::
:::fr
Le son n'est rien d'autre que de l'air qui vibre en ondes — quand tu parles, ta voix fait vibrer l'air devant ta bouche, et cette vibration se propage jusqu'à atteindre ton oreille (ou un micro).
:::

:::h2 de="Frequenz – die Tonhöhe" fr="La fréquence – la hauteur du son":::

:::konzept titel_de="Wie schnell schwingt die Luft?" titel_fr="À quelle vitesse l'air vibre-t-il ?"
:::de
{{glossar:frequenz}} beschreibt, wie schnell die Luft schwingt, gemessen in {{glossar:hz}} — eine Zahl, die angibt, wie oft pro Sekunde eine volle Schwingung passiert. Für die Praxis reicht eine grobe Dreiteilung: **Bässe** (ca. 20–250 Hz, das «Fundament», aber auch Ursache für Brummen), **Mitten** (ca. 250 Hz–2 kHz, hier steckt der grösste Teil der menschlichen Sprache) und **Höhen** (ca. 2–20 kHz, verantwortlich für «Klarheit», aber auch für lästige Zischlaute).

**Metapher:** Stell dir Wellen vor, die an ein Ufer schlagen. Viele kleine Wellen schnell hintereinander = hoher Ton, wenige grosse Wellen langsam = tiefer Ton.
:::
:::fr
La {{glossar:frequenz}} décrit la vitesse à laquelle l'air vibre, mesurée en {{glossar:hz}} — un nombre qui indique combien de vibrations complètes se produisent par seconde. En pratique, une division grossière en trois suffit : **graves** (env. 20–250 Hz, le « fondement », mais aussi source de bourdonnement), **médiums** (env. 250 Hz–2 kHz, où se trouve l'essentiel de la parole humaine) et **aigus** (env. 2–20 kHz, responsables de la « clarté », mais aussi des sifflantes gênantes).

**Métaphore :** imagine des vagues qui frappent un rivage. Beaucoup de petites vagues rapprochées = son aigu, quelques grandes vagues lentes = son grave.
:::
:::

:::h2 de="Pegel und Lautstärke – dB, dBFS, LUFS" fr="Niveau et volume – dB, dBFS, LUFS":::

:::konzept titel_de="Spitze vs. Durchschnitt" titel_fr="Crête vs. moyenne"
:::de
{{glossar:db}} ist kein festes Mass, sondern ein logarithmisches Verhältnis. Eine Erhöhung um 10 dB klingt subjektiv etwa doppelt so laut. {{glossar:dbfs}} misst, wie nah ein Signal an der absoluten technischen Obergrenze ist — 0 dBFS ist das Maximum. {{glossar:lufs}} misst dagegen die *wahrgenommene* Lautheit über die gesamte Länge einer Aufnahme — der Massstab, nach dem Streaming-Plattformen normalisieren.

**Metapher:** Stell dir ein Glas vor, das du befüllst. 0 dBFS ist der Rand — füllst du darüber hinaus, läuft es über (Clipping). dBFS ist wie die höchste Note, die du in einem Lied singst; LUFS ist wie die Durchschnittsnote über das ganze Konzert.
:::
:::fr
Le {{glossar:db}} n'est pas une mesure fixe, mais un rapport logarithmique. Une augmentation de 10 dB paraît subjectivement environ deux fois plus fort. Le {{glossar:dbfs}} mesure à quel point un signal est proche de la limite technique absolue — 0 dBFS est le maximum. Le {{glossar:lufs}}, lui, mesure le volume *perçu* sur toute la durée d'un enregistrement — la référence utilisée par les plateformes de streaming pour normaliser.

**Métaphore :** imagine un verre que tu remplis. 0 dBFS est le bord — au-delà, ça déborde (écrêtage). Le dBFS est comme la note la plus haute que tu chantes dans une chanson ; le LUFS est comme la note moyenne sur tout un concert.
:::
:::

:::de
Für die Praxis relevante Zielwerte:
:::
:::fr
Valeurs cibles pertinentes en pratique :
:::

| Verwendungszweck | LUFS-Zielwert |
|---|---|
| Musik-Streaming (Spotify, Apple Music, YouTube) | ca. −14 LUFS |
| Podcasts (Apple/Spotify Podcasts) | ca. −16 LUFS |
| Broadcast/EBU R128 (z. B. SRF) | ca. −23 LUFS |

:::h2 de="Clipping und Signal-Rausch-Verhältnis" fr="Écrêtage et rapport signal/bruit":::

:::konzept titel_de="Wenn das Glas überläuft" titel_fr="Quand le verre déborde"
:::de
{{glossar:clipping}} entsteht, wenn ein Signal lauter sein will, als das System darstellen kann — die Spitzen werden hart «abgeschnitten», was zu einem harten Verzerrungsklang führt. Das {{glossar:rauschabstand}} beschreibt, wie deutlich sich das gewünschte Signal vom Grundrauschen abhebt.

**Metapher:** Das randvolle Glas von oben in Aktion — was über den Rand läuft, ist unwiederbringlich weg.
:::
:::fr
Le {{glossar:clipping}} se produit quand un signal veut être plus fort que ce que le système peut représenter — les pics sont brutalement « coupés », ce qui produit une distorsion dure. Le {{glossar:rauschabstand}} décrit à quel point le signal souhaité se distingue du bruit de fond.

**Métaphore :** le verre plein qui déborde, en action — ce qui coule par-dessus le bord est perdu pour de bon.
:::
:::

:::h2 de="Ressourcen" fr="Ressources":::
:::ressourcen
:::de
- [Audacity Manual (CC BY 3.0)](https://manual.audacityteam.org)
:::
:::fr
- [Manuel Audacity (CC BY 3.0)](https://manual.audacityteam.org)
:::
:::
