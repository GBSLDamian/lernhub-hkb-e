---
id: drehbuch-storyboard
area: video-film
titel_de: Drehbuch & Storyboard
titel_fr: Scénario & storyboard
reihenfolge: 3
lernfeld: LF3
lehrjahr: 1
typ: uebung
kstufe: K3
lernziele_de:
  - Ich erkläre den Unterschied zwischen Drehbuch und Storyboard.
  - Ich erarbeite ein Mini-Drehbuch und einen Drehplan für eine eigene Produktion.
lernziele_fr:
  - J'explique la différence entre scénario et storyboard.
  - J'élabore un mini-scénario et un plan de tournage pour ma propre production.
tags: [drehbuch, storyboard, shotlist, drehplan]
---

:::de
Auch eine kurze Video-Produktion wirkt sicherer, wenn du vorher weisst, was in welcher Reihenfolge gezeigt wird. Ein Drehbuch (Screenplay) und ein Storyboard sind die zwei klassischen Vorbereitungswerkzeuge dafür — das eine beschreibt in Worten, das andere zeigt in Bildern.
:::
:::fr
Même une courte production vidéo paraît plus assurée quand tu sais à l'avance quoi montrer et dans quel ordre. Un scénario et un storyboard sont les deux outils de préparation classiques — l'un décrit en mots, l'autre montre en images.
:::

:::h2 de="Drehbuch vs. Storyboard" fr="Scénario vs. storyboard":::

| | Drehbuch | Storyboard |
|---|---|---|
| **Form** | Text: Szenen, Dialog, Handlungsanweisungen | Bilder: eine kleine Skizze pro Einstellung |
| **Zeigt** | Was gesagt/getan wird, in welcher Szene | Wie das Bild aussieht (Einstellungsgrösse, Perspektive) |
| **Nützlich für** | Reihenfolge, Timing, Dialoge | Bildaufbau, Kameraplanung, Teamkommunikation |

:::de
Ein einfaches Drehbuch für eine Kurzproduktion enthält für jede Szene: **Ort** (wo spielt die Szene), **Handlung** (was passiert, in Stichworten), **Dialog/Text** (was wird gesagt) und **Bildidee** (grobe Einstellungsgrösse/Perspektive).
:::
:::fr
Un scénario simple pour une courte production contient, pour chaque scène : le **lieu** (où se déroule la scène), l'**action** (ce qui se passe, en mots-clés), le **dialogue/texte** (ce qui est dit) et l'**idée visuelle** (cadrage/perspective approximatifs).
:::

:::h2 de="Dein Mini-Drehbuch" fr="Ton mini-scénario":::

:::de
Fülle die Felder für eine kurze Szene aus — wird automatisch lokal gespeichert.
:::
:::fr
Remplis les champs pour une courte scène — enregistré automatiquement en local.
:::

:::widget vorlage
{
  "storageKey": "lh_drehbuch",
  "fields": [
    { "key": "titel", "labelDe": "Arbeitstitel", "labelFr": "Titre de travail", "type": "text", "placeholderDe": "z. B. Kurzclip zum Thema ...", "placeholderFr": "p. ex. court clip sur le thème ..." },
    { "key": "ort", "labelDe": "Szene 1 – Ort", "labelFr": "Scène 1 – lieu", "type": "text", "placeholderDe": "Wo spielt die Szene?", "placeholderFr": "Où se déroule la scène ?" },
    { "key": "handlung", "labelDe": "Handlung (Stichworte)", "labelFr": "Action (mots-clés)", "type": "textarea", "placeholderDe": "Was passiert? In welcher Reihenfolge?", "placeholderFr": "Que se passe-t-il ? Dans quel ordre ?" },
    { "key": "dialog", "labelDe": "Dialog/Text", "labelFr": "Dialogue/texte", "type": "textarea", "placeholderDe": "Was wird gesagt (Stichworte reichen)?", "placeholderFr": "Que dit-on (des mots-clés suffisent) ?" },
    { "key": "bildidee", "labelDe": "Bildidee (Einstellungsgrösse/Perspektive)", "labelFr": "Idée visuelle (cadrage/perspective)", "type": "text", "placeholderDe": "z. B. Totale, Augenhöhe", "placeholderFr": "p. ex. plan d'ensemble, hauteur des yeux" }
  ]
}
:::

:::h2 de="Deine Shot-List" fr="Ta liste de plans":::

:::de
Plane echte Einstellungen für deine Mini-Produktion: mindestens 5 Shots, mindestens 3 verschiedene Einstellungsgrössen, mindestens 2 verschiedene Perspektiven.
:::
:::fr
Planifie de vrais plans pour ta mini-production : au moins 5 plans, au moins 3 cadrages différents, au moins 2 perspectives différentes.
:::

:::widget shotlist
{
  "storageKey": "lh_shotlist",
  "minShots": 5, "minGroessen": 3, "minPerspektiven": 2,
  "groessen": [
    { "id": "totale", "de": "Totale", "fr": "Plan d'ensemble" },
    { "id": "halbtotale", "de": "Halbtotale", "fr": "Plan demi-ensemble" },
    { "id": "halbnah", "de": "Halbnah", "fr": "Plan rapproché-taille" },
    { "id": "nah", "de": "Nah", "fr": "Plan rapproché-poitrine" },
    { "id": "gross", "de": "Grossaufnahme", "fr": "Gros plan" },
    { "id": "detail", "de": "Detail", "fr": "Très gros plan" }
  ],
  "perspektiven": [
    { "id": "vogel", "de": "Vogelperspektive", "fr": "Plongée" },
    { "id": "augenhoehe", "de": "Augenhöhe", "fr": "Hauteur des yeux" },
    { "id": "frosch", "de": "Froschperspektive", "fr": "Contre-plongée" }
  ]
}
:::

:::h2 de="Ressourcen" fr="Ressources":::
:::ressourcen
:::de
- [StudioBinder – Guide zu Einstellungsgrössen & Kamerawinkeln](https://www.studiobinder.com/blog/ultimate-guide-camera-shots/)
:::
:::fr
- [StudioBinder – guide des cadrages & angles de caméra](https://www.studiobinder.com/blog/ultimate-guide-camera-shots/)
:::
:::
