---
id: audio-bearbeiten
area: audio
titel_de: Audio bearbeiten
titel_fr: Retoucher l'audio
reihenfolge: 3
lernfeld: LF3
lehrjahr: 2
typ: theorie
kstufe: K3
lernziele_de:
  - Ich benenne die Schritte einer typischen Audio-Bearbeitungskette und ihre Reihenfolge.
  - Ich erkläre, wie Rauschunterdrückung, EQ, Kompressor und De-Esser wirken.
lernziele_fr:
  - Je nomme les étapes d'une chaîne de traitement audio typique et leur ordre.
  - J'explique l'effet de la réduction de bruit, de l'EQ, du compresseur et du dé-esseur.
tags: [kompressor, eq, deesser, audacity, audition, bearbeitungskette]
---

:::de
Zwei Wege führen zum selben Ziel — ein kostenloses, quelloffenes Werkzeug (Audacity) und ein professionelles Werkzeug im Abo (Adobe Audition). Die Bearbeitungskette ist bei beiden praktisch identisch.
:::
:::fr
Deux chemins mènent au même but — un outil gratuit et open source (Audacity) et un outil professionnel par abonnement (Adobe Audition). La chaîne de traitement est pratiquement identique dans les deux cas.
:::

:::h2 de="Die Bearbeitungskette sortieren" fr="Remets la chaîne de traitement en ordre":::

:::de
Bring die 5 Schritte in die sinnvolle Reihenfolge.
:::
:::fr
Remets les 5 étapes dans le bon ordre.
:::

:::widget reihenfolge-spiel
{
  "correctOrder": ["noise", "eq", "comp", "deess", "norm"],
  "items": [
    { "id": "noise", "textDe": "Rauschunterdrückung", "textFr": "Réduction de bruit" },
    { "id": "eq", "textDe": "Equalizer (EQ)", "textFr": "Égaliseur (EQ)" },
    { "id": "comp", "textDe": "Kompressor", "textFr": "Compresseur" },
    { "id": "deess", "textDe": "De-Esser", "textFr": "Dé-esseur" },
    { "id": "norm", "textDe": "Normalisieren/Limiter", "textFr": "Normalisation/Limiteur" }
  ]
}
:::

:::merksatz
:::de
Störgeräusche zuerst raus, De-Esser erst NACH dem Kompressor (Kompression macht Zischlaute relativ lauter), Normalisieren/Limiter ganz am Schluss.
:::
:::fr
D'abord éliminer les bruits parasites, le dé-esseur seulement APRÈS le compresseur (la compression rend les sifflantes relativement plus fortes), normalisation/limiteur tout à la fin.
:::
:::

:::h2 de="Schritt 1: Rauschunterdrückung" fr="Étape 1 : réduction de bruit":::

:::de
Entfernt ein gleichbleibendes Hintergrundrauschen anhand eines kurzen «Rauschprofils». **Warum zuerst?** Alle nachfolgenden Effekte würden das Rauschen sonst mitverstärken. Ein zu hoch eingestellter Reduktionsgrad entfernt zwar mehr Rauschen, führt aber zu einem metallisch-blechernen «Roboter»-Klang, weil die Software dabei auch echte Sprachanteile beschneidet, die zufällig ähnlich klingen wie das erfasste Rauschprofil.

Für dieses Beispiel wurde einer sauberen Sprachaufnahme absichtlich künstliches Raumrauschen hinzugefügt, damit der Unterschied klar hörbar ist.
:::
:::fr
Élimine un bruit de fond constant à partir d'un court « profil de bruit ». **Pourquoi en premier ?** Tous les effets suivants amplifieraient sinon aussi le bruit. Un taux de réduction trop élevé enlève certes plus de bruit, mais produit un son métallique de « robot », car le logiciel coupe aussi de vraies parties du discours qui ressemblent par hasard au profil de bruit capté.

Pour cet exemple, du bruit ambiant artificiel a été volontairement ajouté à un enregistrement vocal propre, afin que la différence soit clairement audible.
:::

:::widget ab-player
{
  "before": "/assets/audio/demo-verrauscht.m4a",
  "after": "/assets/audio/demo-rauschunterdrueckung.m4a",
  "beforeLabelDe": "Verrauscht", "beforeLabelFr": "Bruité",
  "afterLabelDe": "Bereinigt", "afterLabelFr": "Nettoyé",
  "captionDe": "Künstliches Rauschen hinzugefügt, dann mit Spektral-Rauschunterdrückung entfernt.",
  "captionFr": "Bruit artificiel ajouté, puis retiré par réduction de bruit spectrale."
}
:::

:::h2 de="Schritt 2: Equalizer (EQ)" fr="Étape 2 : égaliseur (EQ)":::

:::de
Hebt oder senkt gezielt Frequenzbereiche an. Ein Hochpassfilter unter ca. 80–100 Hz entfernt Trittschall/Brummen, ohne Sprachinformation zu verlieren — menschliche Sprache enthält dort kaum Nutzinformation. Eine leichte Anhebung um 2–4 kHz erhöht die «Präsenz», weil dieser Bereich für die Verständlichkeit von Konsonanten wichtig ist.
:::
:::fr
Augmente ou réduit de manière ciblée certaines plages de fréquences. Un filtre passe-haut sous env. 80–100 Hz élimine les bruits de pas/bourdonnements sans perdre d'information vocale — la parole humaine y contient peu d'information utile. Une légère augmentation vers 2–4 kHz renforce la « présence », car cette zone est importante pour l'intelligibilité des consonnes.
:::

:::widget ab-player
{
  "before": "/assets/audio/demo-roh.m4a",
  "after": "/assets/audio/demo-eq.m4a",
  "beforeLabelDe": "Vorher", "beforeLabelFr": "Avant",
  "afterLabelDe": "Mit EQ", "afterLabelFr": "Avec EQ",
  "captionDe": "Bässe unter 100 Hz raus, Präsenz bei 3 kHz angehoben.",
  "captionFr": "Graves sous 100 Hz retirés, présence à 3 kHz renforcée."
}
:::

:::h2 de="Schritt 3: Kompressor" fr="Étape 3 : compresseur":::

:::de
Der {{glossar:kompressor}} verringert den Dynamikumfang, indem laute Stellen automatisch leiser werden. Zentrale Regler: {{glossar:threshold}}, {{glossar:ratio}}, {{glossar:attackrelease}}. Ein niedriger Threshold kombiniert mit einer hohen Ratio komprimiert fast das gesamte Signal stark — klingt «produziert» und gleichmässig laut, kann aber unnatürlich wirken. Ein hoher Threshold mit niedriger Ratio fängt nur die allerlautesten Spitzen sanft ein — dezenter, natürlicher.
:::

![Kompressor-Kennlinie: unterhalb des Thresholds 1:1, oberhalb flacher im Verhältnis 4:1, danach Makeup Gain.](/assets/img/audacity/kompressor-kennlinie.svg)
:::fr
Le {{glossar:kompressor}} réduit la plage dynamique en atténuant automatiquement les passages forts. Réglages centraux : {{glossar:threshold}}, {{glossar:ratio}}, {{glossar:attackrelease}}. Un seuil bas combiné à un ratio élevé comprime presque tout le signal fortement — cela paraît « produit » et uniformément fort, mais peut sembler artificiel. Un seuil élevé avec un ratio faible ne capture que les pics les plus forts, en douceur — plus discret, plus naturel.
:::

:::widget ab-player
{
  "before": "/assets/audio/demo-roh.m4a",
  "after": "/assets/audio/demo-kompressor.m4a",
  "beforeLabelDe": "Vorher", "beforeLabelFr": "Avant",
  "afterLabelDe": "Komprimiert", "afterLabelFr": "Compressé",
  "captionDe": "Threshold −18 dB, Ratio 4:1 — lautere und leisere Stellen liegen näher beieinander.",
  "captionFr": "Seuil −18 dB, ratio 4:1 — les passages forts et faibles sont plus rapprochés."
}
:::

:::h2 de="Schritt 4: De-Esser" fr="Étape 4 : dé-esseur":::

:::de
Ein spezialisierter Kompressor, der nur im Zischlaut-Bereich (ca. 4–10 kHz) eingreift und dort scharfe S-/Sch-Laute automatisch absenkt. **Warum erst nach dem Kompressor?** Kompression macht Zischlaute relativ zum Rest oft lauter — der De-Esser danach kann sie gezielt einfangen. Der Frequenzregler muss exakt auf die individuelle Zischlaut-Frequenz der jeweiligen Stimme abgestimmt werden — zu tief eingestellt, erzeugt er einen hörbaren Lispel-Effekt.

Für dieses Beispiel wurden die Höhen der Aufnahme absichtlich angehoben, um typische, etwas zu scharfe Zischlaute zu simulieren.
:::

![Frequenzspektrum mit hervorgehobener Zischlaut-Zone zwischen 4 und 10 kHz.](/assets/img/audacity/deesser-frequenzband.svg)
:::fr
Un compresseur spécialisé qui n'intervient que dans la zone des sifflantes (env. 4–10 kHz) et y atténue automatiquement les S/Ch trop marqués. **Pourquoi seulement après le compresseur ?** La compression rend souvent les sifflantes relativement plus fortes — le dé-esseur peut ensuite les cibler. Le réglage de fréquence doit être ajusté précisément à la fréquence de sifflante propre à chaque voix — trop bas, il produit un effet de zézaiement audible.

Pour cet exemple, les aigus de l'enregistrement ont été volontairement augmentés pour simuler des sifflantes typiques, un peu trop marquées.
:::

:::widget ab-player
{
  "before": "/assets/audio/demo-vor-deesser.m4a",
  "after": "/assets/audio/demo-deesser.m4a",
  "beforeLabelDe": "Scharfe Esses", "beforeLabelFr": "Sifflantes marquées",
  "afterLabelDe": "De-Essed", "afterLabelFr": "Dé-essé",
  "captionDe": "Simulierte überbetonte Zischlaute, dann mit De-Esser gezähmt.",
  "captionFr": "Sifflantes simulées surmarquées, puis atténuées par le dé-esseur."
}
:::

:::h2 de="Schritt 5: Normalisieren/Limiter" fr="Étape 5 : normalisation/limiteur":::

:::de
Hebt bzw. begrenzt den Pegel final auf einen Ziel-LUFS-Wert (siehe Frequenz & Lautstärke) — der letzte Schritt vor dem Export. **Normalize/Amplify** sind peak-basiert (dBFS), **Loudness Normalization** zielt dagegen auf die wahrgenommene Lautheit (LUFS), weil nur das dem tatsächlichen Massstab der Streaming-Plattformen entspricht. Ein Limiter ergänzt als Sicherheitsnetz: er begrenzt harte Spitzen, statt die ganze Aufnahme leiser zu machen.
:::
:::fr
Ajuste ou limite finalement le niveau à une valeur LUFS cible (voir Fréquence & volume) — la dernière étape avant l'export. **Normalize/Amplify** se basent sur les crêtes (dBFS), tandis que la **normalisation de loudness** vise le volume perçu (LUFS), car c'est la seule mesure conforme aux standards réels des plateformes de streaming. Un limiteur agit en filet de sécurité : il limite les pics durs plutôt que de baisser tout l'enregistrement.
:::

:::h2 de="Audacity vs. Adobe Audition" fr="Audacity vs. Adobe Audition":::

| | Audacity | Adobe Audition |
|---|---|---|
| **Kosten** | kostenlos, Open Source | Abo (Creative Cloud) |
| **Am besten für** | Einsteiger, Schule ohne Lizenzkosten | professionelle Produktion |

:::h2 de="Ressourcen" fr="Ressources":::
:::ressourcen
:::de
- [Audacity Manual (CC BY 3.0)](https://manual.audacityteam.org)
- [Adobe Audition Hilfe](https://helpx.adobe.com/de/audition/)
:::
:::fr
- [Manuel Audacity (CC BY 3.0)](https://manual.audacityteam.org)
- [Aide Adobe Audition](https://helpx.adobe.com/fr/audition/)
:::
:::
