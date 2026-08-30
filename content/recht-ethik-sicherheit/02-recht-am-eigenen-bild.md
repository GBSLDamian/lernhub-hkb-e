---
id: recht-am-eigenen-bild
area: recht-ethik-sicherheit
titel_de: Recht am eigenen Bild
titel_fr: Droit à l'image
reihenfolge: 2
lernfeld: LF2
lehrjahr: 1
typ: uebung
kstufe: K4
lernziele_de:
  - Ich beurteile anhand von Art. 28 ZGB, ob ein Foto einer Person veröffentlicht werden darf.
lernziele_fr:
  - J'évalue, sur la base de l'art. 28 CC, si la photo d'une personne peut être publiée.
tags: [persoenlichkeitsrecht, art28zgb, einwilligung]
---

:::de
Kolleg:innen haben mündlich einer Verwendung eines Team-Ausflugsfotos im Intranet zugestimmt. Nun will das Marketing dasselbe Foto in einer gedruckten Broschüre wiederverwenden.
:::
:::fr
Des collègues ont accepté oralement l'utilisation d'une photo de sortie d'équipe sur l'intranet. Le marketing souhaite maintenant réutiliser la même photo dans une brochure imprimée.
:::

:::h2 de="Du bestimmst über dein eigenes Bild" fr="Tu décides de ta propre image":::

:::de
Nach {{glossar:art28zgb}} ist eine Persönlichkeitsverletzung widerrechtlich, ausser sie ist gerechtfertigt (Einwilligung, überwiegendes Interesse, Gesetz) — wer sich darauf beruft, muss das begründen.

**Die Beiwerk-Regel des EDÖB:** Personen, die im öffentlichen Raum nur zufällig als «Beiwerk» erscheinen (z. B. Passant:innen vor einem Wahrzeichen), ohne im Fokus zu stehen, wiegen laut EDÖB weniger schwer — es reicht, das Bild auf Verlangen zu löschen. Gezielte Porträts brauchen dagegen vorab eine informierte Einwilligung.

Eine Einwilligung kann jederzeit widerrufen werden; führt der Widerruf zu einem Schaden (z. B. bereits gedruckte Flyer), kann das eine Schadenersatzpflicht auslösen. Für kommerzielle Nutzung (Werbung) braucht es immer eine explizite, konkrete Einwilligung — eine allgemeine Pauschal-Zustimmung reicht nicht.
:::
:::fr
Selon l'{{glossar:art28zgb}}, une atteinte à la personnalité est illicite, sauf si elle est justifiée (consentement, intérêt prépondérant, loi) — celui qui s'en prévaut doit le démontrer.

**La règle de l'accessoire du PFPDT :** les personnes qui n'apparaissent qu'accessoirement dans l'espace public (p. ex. des passant·es devant un monument), sans être au centre de l'image, pèsent moins lourd selon le PFPDT — il suffit de supprimer l'image sur demande. Les portraits ciblés nécessitent en revanche un consentement informé préalable.

Un consentement peut être révoqué à tout moment ; si la révocation cause un dommage (p. ex. des flyers déjà imprimés), cela peut entraîner une obligation de réparation. Pour un usage commercial (publicité), un consentement explicite et concret est toujours nécessaire — un accord général forfaitaire ne suffit pas.
:::

:::h2 de="Darf ich das Foto posten?" fr="Puis-je publier cette photo ?":::

:::de
Beantworte die Fragen und erhalte eine begründete Einschätzung.
:::
:::fr
Réponds aux questions et obtiens une évaluation justifiée.
:::

:::widget entscheidungsbaum
{
  "root": {
    "qDe": "Ist die Person auf dem Foto erkennbar (Gesicht sichtbar oder eindeutig identifizierbar)?",
    "qFr": "La personne sur la photo est-elle reconnaissable (visage visible ou clairement identifiable) ?",
    "no": { "result": true, "titleDe": "Kein Thema fürs Recht am eigenen Bild", "titleFr": "Pas un enjeu pour le droit à l'image", "textDe": "Ist niemand erkennbar, ist Art. 28 ZGB nicht betroffen. Urheberrecht/Datenschutz können trotzdem relevant sein.", "textFr": "Si personne n'est reconnaissable, l'art. 28 CC n'est pas concerné. Le droit d'auteur/la protection des données peuvent tout de même être pertinents." },
    "yes": {
      "qDe": "Liegt eine informierte Einwilligung der Person für genau diese Verwendung vor?",
      "qFr": "Existe-t-il un consentement informé de la personne pour exactement cette utilisation ?",
      "yes": { "result": true, "titleDe": "Posten grundsätzlich möglich", "titleFr": "Publication généralement possible", "textDe": "Mit einer informierten Einwilligung für genau diesen Zweck darfst du das Foto verwenden. Ein Widerruf mit Schaden (z. B. gedruckte Flyer) kann Schadenersatzpflicht auslösen.", "textFr": "Avec un consentement informé pour exactement ce but, tu peux utiliser la photo. Une révocation causant un dommage (p. ex. flyers imprimés) peut entraîner une obligation de réparation." },
      "no": {
        "qDe": "Ist die Person nur zufälliges «Beiwerk» im öffentlichen Raum, ohne besonders im Fokus zu stehen?",
        "qFr": "La personne n'apparaît-elle qu'accessoirement dans l'espace public, sans être particulièrement mise en avant ?",
        "yes": { "result": true, "titleDe": "Meist unproblematisch", "titleFr": "Généralement sans problème", "textDe": "Laut EDÖB wiegt der Eingriff bei blossem Beiwerk weniger schwer. Es reicht, das Bild auf Verlangen zu löschen.", "textFr": "Selon le PFPDT, l'atteinte pèse moins lourd pour un simple accessoire. Il suffit de supprimer l'image sur demande." },
        "no": {
          "qDe": "Handelt es sich um eine öffentliche Veranstaltung mit überwiegendem öffentlichen Interesse?",
          "qFr": "S'agit-il d'un événement public avec un intérêt public prépondérant ?",
          "yes": { "result": true, "titleDe": "Einzelfallprüfung nötig", "titleFr": "Examen au cas par cas nécessaire", "textDe": "Ein überwiegendes öffentliches Interesse kann eine Persönlichkeitsverletzung ausnahmsweise rechtfertigen (Art. 28 ZGB).", "textFr": "Un intérêt public prépondérant peut exceptionnellement justifier une atteinte à la personnalité (art. 28 CC)." },
          "no": { "result": true, "titleDe": "Erst Einwilligung einholen", "titleFr": "Obtenir d'abord le consentement", "textDe": "Ohne Einwilligung, Beiwerk-Situation oder öffentliches Interesse ist die Verletzung widerrechtlich (Art. 28 ZGB).", "textFr": "Sans consentement, situation d'accessoire ou intérêt public, l'atteinte est illicite (art. 28 CC)." }
        }
      }
    }
  }
}
:::
