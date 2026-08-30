# LernHub — HKB E

Interaktives, zweisprachiges (DE/FR), installierbares (PWA) Lern- und
Nachschlagewerk für Kaufleute (1.–3. Lehrjahr) zum Handlungskompetenzbereich
HKB E. Rein statisch, kein Backend, kein Framework — ein kleiner Node-Build
erzeugt echte HTML-Seiten aus Markdown-Content.

**Stand:** 9 Themenbereiche, 47 Lektionen, 20 interaktive Widgets, ein
durchsuchbares/filterbares Glossar mit 59 Fachbegriffen — alles offline
nutzbar nach dem ersten Besuch (PWA, installierbar). Lehrjahr- und
K-Stufen-Angaben in den Lektionen sind mit der offiziellen kantonalen
Lernziele-Datenbank abgeglichen.

## Architektur: Content-as-Data

**Ein neues Modul/eine neue Lektion = eine neue Inhaltsdatei — kein
Layout-Code wird angefasst.**

```
content/
  areas.json                 ← 9 Bereiche in 4 Clustern (Titel, Farbe, Icon, Reihenfolge)
  glossar.json                ← Glossarbegriffe (DE/FR)
  <area-id>/
    01-<slug>.md               ← eine Lektion, mit Frontmatter + Body
```

`build.mjs` liest `content/`, rendert jede Lektion, jede Bereichs-Landing und
die Startseite zu echten statischen HTML-Seiten in `dist/`, plus
`search-index.json`, `manifest.webmanifest` und `sw.js`.

### Einen Bereich hinzufügen

Bereits alle 9 Bereiche in `content/areas.json` angelegt. Um einen
bestehenden Bereich mit Lektionen zu füllen, reicht Schritt 2.

### Eine Lektion hinzufügen

1. Neue Datei `content/<area-id>/<nn>-<slug>.md` anlegen.
2. Frontmatter ausfüllen:

   ```yaml
   ---
   id: mein-lektion-slug          # wird Teil der URL: /<area-id>/<id>/
   area: <area-id>                 # muss zu areas.json passen
   titel_de: Mein Titel
   titel_fr: Mon titre
   reihenfolge: 2                  # Sortierung innerhalb des Bereichs
   lernfeld: LF3                   # LF2 | LF3
   lehrjahr: 2                     # 1 | 2 | 3
   typ: theorie                    # theorie | uebung | video | tool | referenz
   kstufe: K3
   lernziele_de:
     - Erstes Lernziel.
   lernziele_fr:
     - Premier objectif.
   tags: [stichwort1, stichwort2]
   ---
   ```

3. Body in Markdown schreiben (siehe Direktiven unten).
4. `npm run build` — die Lektion erscheint automatisch in Sidebar,
   Bereichs-Landing, Startseite und Suche.

Keine Registrierung nötig — der Build scannt `content/<area-id>/*.md`
automatisch.

## Body-Direktiven (Markdown-Erweiterungen)

Alles zwischen `:::` ist eine Direktive. Bausteine:

```markdown
:::h2 de="Eine Überschrift" fr="Un titre":::

:::de
Deutscher Fliesstext. **Fett**, *kursiv*, `code`, [Link](url), {{glossar:pixel}}.
:::
:::fr
Texte français équivalent.
:::

| Spalte A | Spalte B |
|---|---|
| Ganz normale GFM-Pipe-Tabellen | funktionieren auch |

:::konzept titel_de="Konzept-Titel" titel_fr="Titre du concept"
:::de
Erklärung + Metapher auf Deutsch.
:::
:::fr
Explication + métaphore en français.
:::
:::

:::merksatz
:::de
**Der Merksatz.**
:::
:::fr
**La phrase à retenir.**
:::
:::

:::ressourcen
:::de
- [Externer Link](https://…)
:::
:::fr
- [Lien externe](https://…)
:::
:::

:::widget kontrast-checker:::

:::widget quiz
{
  "fragen": [
    { "id": "q1", "fragenDe": "...", "fragenFr": "...", "optionenDe": ["A","B"], "optionenFr": ["A","B"], "loesung": 0, "erklaerungDe": "...", "erklaerungFr": "..." }
  ]
}
:::
```

- `:::h2 de="…" fr="…":::` / `:::h3 …:::` — bilinguale Überschrift (auch für
  «Auf dieser Seite»-TOC). Plain-Markdown-`##` wird **nicht** mehr unterstützt,
  weil es nicht zweisprachig wäre.
- `{{glossar:<id>}}` bzw. `{{glossar:<id>|Anzeigetext}}` — klickbarer
  Glossarbegriff mit Tooltip, gespeist aus `content/glossar.json`.
- `:::widget <slug>:::` ohne Konfiguration (z. B. `kontrast-checker`) oder mit
  JSON-Block danach (z. B. `quiz`, `zone-sort`, `vorlage`, …) — siehe
  «Ein Widget hinzufügen».
- Normale GFM-Pipe-Tabellen (`| … | … |`) werden automatisch in eine
  scrollbare `<table>` gerendert.

**Regel:** Genau eine Sprache wird je gerendert — auf Elemente mit
`data-lang="de"` bzw. `data-lang="fr"` greift die globale CSS-Regel in
`src/styles/base.css`:

```css
html[data-lang="de"] [data-lang="fr"] { display: none !important; }
html[data-lang="fr"] [data-lang="de"] { display: none !important; }
```

Beide Sprachen werden immer ins HTML gerendert (kein Reload beim Umschalten);
CSS blendet nur die inaktive Sprache aus. Das gilt für Content **und**
Shell-Chrome (Header, Sidebar, Buttons) — dieselbe Regel, ein Mechanismus.

Ein globaler, wegklickbarer Hinweis («maschinell vorübersetzt») erscheint nur
in FR (`#fr-check-banner`), solange er nicht geschlossen wurde.

## Ein Widget hinzufügen

1. `src/widgets/<slug>.js` — exportiert `mount(container, config)`. `config`
   ist entweder `null` (bei `:::widget slug:::` ohne Konfiguration) oder das
   per JSON übergebene Objekt (bei `:::widget slug\n{ ... }\n:::`).
2. In `src/scripts/app.js` in `WIDGET_MODULES` eintragen:
   `'<slug>': '/assets/widgets/<slug>.js'`.
3. Im Lektionstext `:::widget <slug>:::` bzw. mit Konfiguration verwenden.

`app.js` mountet automatisch beim Seitenaufbau und nach jeder clientseitigen
Navigation — dynamisch per Element, dedupliziert und idempotent
(`data-initialized`).

Vorhandene Widgets (20): `kontrast-checker`, `rgb-cmyk-mischer`,
`font-switcher`, `vorlage` (ausfüllbare Vorlage, z. B. Persona/SWOT/BMC/
Steckbrief/Drehbuch), `decision-widget` (Auswahl → Ergebnis),
`entscheidungsbaum` (verschachtelte Ja/Nein-Fragen), `reihenfolge-spiel`,
`zone-sort` (Drag&Drop-Zuordnung), `checkliste`, `technik-karten`,
`ab-player` (Vorher/Nachher-Audio), `sound-rezept`, `shotlist`
(Drehplan-Tool), `format-matcher` (Memory-Zuordnung), `quiz`
(Mehrfachauswahl mit Musterlösung), sowie fünf in Prompt 4 ergänzte
Interaktionen:

- `fakt-oder-fake` — Karten-Spiel zur Quellenkritik (Statement → Fakt/Fake
  → Begründung), in `recherche-digitale-arbeitswelt → Fake News erkennen`.
- `einstellung-matcher` — Bild↔Wirkung-Zuordnungsspiel mit den bestehenden
  SVG-Illustrationen der Einstellungsgrössen, in `video-film`.
- `drittel-schnitt-overlay` — schaltbares Raster (Drittel-Regel/Goldener
  Schnitt) über einem echten Foto, in `bild-bildbearbeitung`.
- `kompression-demo` — echte Canvas-JPEG-Neukodierung (kein Simulations-
  Trick) mit Qualitäts-Regler und Live-Dateigrössenanzeige, in
  `bild-bildbearbeitung`.
- `belichtung-framerate` — Blende/Verschlusszeit/ISO-Regler mit
  Live-Vorschau plus separater Bildraten-Vergleich, in `video-film`.

Alle Widgets: reines Vanilla JS ohne Abhängigkeiten, per Tastatur bedienbar,
DE/FR über den bestehenden `data-lang`-Mechanismus, kontraststabil in
Hell/Dunkel über CSS-Variablen, offlinefähig (keine Laufzeit-Netzwerk-
Abhängigkeit ausser bei `kompression-demo`s Ausgangsbild, das wie alle
Assets vom Service Worker gecacht wird).

## Design-System

- Tokens in `src/styles/tokens.css`: Farben (hell/dunkel + 4 Cluster-Farben),
  Typografie, Radien, Abstände. `src/styles/base.css` = Reset + Sprachregel.
  `src/styles/components.css` = alle Komponenten.
- Schriften **selbst-gehostet** (`assets/fonts/*.woff2`, kein CDN zur
  Laufzeit): Archivo (Display, Variable Font), IBM Plex Sans (Text, Variable
  Font), IBM Plex Mono (Labels/Code).
- Dark Mode: System-Präferenz standardmässig, manueller Umschalter
  überschreibt (`data-theme` auf `<html>`, persistiert in
  `localStorage.lh_theme`). Anti-Flacker-Skript im `<head>` jeder Seite setzt
  Sprache/Theme vor dem ersten Render.

## App-Shell

- Sidebar: Modulbaum aus `areas.json`, gruppiert nach Cluster; mobil
  Off-Canvas-Schublade.
- Suche (⌘K oder Button): durchsucht `search-index.json` (Substring + simple
  Fuzzy-Toleranz), springt zur Lektion.
- Home-Dashboard: Begrüssung, «Weiterlernen» (letzte Lektion aus
  `localStorage`), Filter-Chips (Lehrjahr/Typ), Bereichs-Karten mit
  Fortschrittsbalken.
- Favoriten/Fortschritt: `localStorage`, Präfix `lh_`, freiwillig, per
  Klick im Footer zurücksetzbar. Kein Konto, keine Sperren.
- Clientseitige Navigation: Klicks auf interne Links werden per `fetch` +
  History-API abgefangen (View-Transitions-API wenn verfügbar); schlägt der
  Fetch fehl, greift ein normaler Reload als Fallback.

## Glossar

`content/glossar.json` ist die zentrale Datenquelle für alle Fachbegriffe
(59 Einträge). Jeder Eintrag: `id`, `begriff_de/fr`, `kurz_de/fr`, optional
`metapher_de/fr`, und `bereiche` (Array von `area`-IDs — bestimmt, unter
welchen Filter-Chips der Begriff auf der Glossar-Seite erscheint).

- **Inline-Tooltip:** `{{glossar:id}}` bzw. `{{glossar:id|Anzeigetext}}` im
  Lektionstext macht den Begriff klickbar (Tooltip mit Kurzdefinition +
  Metapher), siehe «Body-Direktiven» oben.
- **Glossar-Seite** (`/glossar/`): alphabetisch gruppiert mit
  Sprungnavigation, Live-Textsuche (durchsucht DE- und FR-Text unabhängig
  von der aktuell aktiven Sprache) und Bereich-Filter-Chips — beides
  clientseitig in `initGlossaryPage()` (`src/scripts/app.js`).
- **Globale Suche:** Jeder Glossar-Begriff ist zusätzlich zweisprachig im
  `search-index.json` enthalten (`typ: "glossar"`) und taucht damit auch im
  ⌘K-Suchdialog auf, mit eigener Meta-Zeile («Glossar · Bereich») und Link
  direkt zum Eintrag (`/glossar/#glossar-<id>`).

**Einen Begriff hinzufügen:** neuen Eintrag in `glossar.json` anhängen (id,
begriff_de/fr, kurz_de/fr, optional metapher_de/fr, bereiche), danach an
mindestens einer Stelle im Lektionstext mit `{{glossar:id}}` referenzieren
(sonst hat der Begriff zwar einen Glossar-Eintrag, aber keinen Tooltip-Link
aus dem Fliesstext heraus).

## Medien-Einbindung

Videos werden nicht direkt eingebettet, sondern über eine Facade
(`:::video youtube="<id>":::` im Content, `mountVideoFacades()` in
`app.js`) geladen:

1. **Offline-Erkennung:** ist `navigator.onLine === false`, erscheint sofort
   ein Hinweis «Keine Internetverbindung» mit Direktlink zu YouTube, statt
   eines kaputten Thumbnails — die restliche Seite bleibt ja offlinefähig,
   das Video ist die einzige Online-Abhängigkeit auf dieser Lektion.
2. **Einbettbarkeits-Check (playableInEmbed):** vor der Anzeige wird die
   YouTube-oEmbed-API abgefragt. Hat der Kanal die Einbettung deaktiviert
   (oder ist das Video nicht erreichbar), erscheint automatisch ein
   Direktlink-Fallback statt eines defekten Players.
3. Erst nach Klick auf den Play-Button wird der eigentliche
   `youtube-nocookie.com`-iframe geladen (kein Tracking vor dem Klick).
4. Ein «Online-Inhalt»-Badge markiert das Element visuell als Ausnahme in
   einer sonst komplett offlinefähigen Seite.

**Ressourcen-Attribution:** externe Quellen stehen in `:::ressourcen:::`-
Blöcken je Lektion (zweisprachig, ein Eintrag pro Sprachblock) und öffnen
seit Prompt 4 in einem neuen Tab (`target="_blank" rel="noopener
noreferrer"`), damit ein Klick nicht aus der installierten PWA
herausnavigiert. Echte Fotos tragen eine Quellenangabe direkt im
Lektionstext (z. B. `*(Foto: Autor:in, CC-Lizenz)*`) — **innerhalb** des
jeweiligen `:::de`/`:::fr`-Blocks, damit die Übersetzung («Foto:» /
«Photo :») korrekt mitwechselt. Alle SVG-Diagramme (Einstellungsgrössen,
Perspektiven, Polardiagramme, Kompressor-Kennlinien …) sind eigene,
schematische Illustrationen für dieses Projekt — keine externen Quellen,
daher ohne Attribution.

## Lokal starten

Voraussetzung: Node.js ≥ 18 (keine weiteren Abhängigkeiten).

```bash
npm run icons   # einmalig: PWA-Icons erzeugen (assets/icons/)
npm run build   # baut dist/
npm start        # baut + startet einen lokalen Server auf :8080
```

`npm start` entspricht `node build.mjs --serve`.

## PWA

`manifest.webmanifest` und `sw.js` werden vom Build erzeugt. Der Service
Worker cached App-Shell, alle generierten Seiten, Assets und den Suchindex
(Cache-first mit Netzwerk-Update) → Offline-Fähigkeit und «Zum Homescreen
hinzufügen». Icons werden mit `npm run icons` aus einem winzigen,
abhängigkeitsfreien PNG-Encoder erzeugt (kein Bild-Tool nötig).

> Hinweis: Service-Worker-Registrierung lässt sich in manchen abgeschotteten
> Vorschau-/Sandbox-Browsern nicht testen (Policy-Block). Auf einer echten
> HTTPS-Deployment (z. B. Netlify) funktioniert die Registrierung normal.

## Deployment (Netlify)

`netlify.toml` ist vorbereitet:

```toml
[build]
  command = "npm run icons && npm run build"
  publish = "dist"
```

1. Repo ist bereits auf GitHub: `GBSLDamian/lernhub-hkb-e`.
2. Auf [app.netlify.com](https://app.netlify.com) → **Add new site** →
   **Import an existing project** → GitHub → `GBSLDamian/lernhub-hkb-e`
   auswählen.
3. Build-Einstellungen werden aus `netlify.toml` übernommen
   (Build-Command + Publish-Verzeichnis `dist`) — nichts weiter nötig.
4. Site-Name `lernhub-hkb-e` setzen (Site settings → Change site name).

## Neue Module ergänzen

Für ein zukünftiges Modul oder einen neuen Themenbereich:

1. **Bereich anlegen** (nur falls wirklich neu): Eintrag in
   `content/areas.json` (`id`, `nr`, `cluster`, `icon`, `reihenfolge`,
   `titel.de/fr`, `kurz.de/fr`). Meistens reicht es, Lektionen in einen der
   9 bestehenden Bereiche zu legen — vor dem Anlegen eines neuen Bereichs
   prüfen, ob das Thema nicht besser in einen bestehenden passt (z. B.
   gehört alles rund um Bildkomposition zu `bild-bildbearbeitung`, nicht zu
   einem neuen Bereich).
2. **Lektion anlegen**: neue `.md`-Datei in `content/<area-id>/`, siehe
   «Eine Lektion hinzufügen» oben. `lehrjahr` und `kstufe` nach Möglichkeit
   an der offiziellen kantonalen Lernziele-Datenbank ausrichten, falls für
   das Fach/Themenfeld eine Zuordnung existiert (bei diesem Projekt war das
   `~/Desktop/Lernziele/lernziele.json`, insbesondere das `lehrjahre`-Array
   mit dem Semesterplan pro Fach/Themenbereich) — sonst nach didaktischem
   Ermessen setzen und im Frontmatter-Kommentar oder Commit-Message
   vermerken, dass keine offizielle Quelle vorlag.
3. **Widgets wiederverwenden statt neu bauen**: Für Zuordnungsaufgaben
   passen `zone-sort` oder `format-matcher`, für Wissens-Checks `quiz`, für
   ausfüllbare Vorlagen `vorlage`, für Wahr/Falsch-Karten `fakt-oder-fake`.
   Nur bei echtem Bedarf ein neues Widget bauen (siehe «Ein Widget
   hinzufügen» oben) — jedes neue Widget muss vanilla JS, tastaturbedienbar,
   dark-mode-sicher (CSS-Variablen, keine harten Farben) und zweisprachig
   sein.
4. **Glossar pflegen**: neue Fachbegriffe in `content/glossar.json`
   aufnehmen und im Lektionstext mit `{{glossar:id}}` verlinken (siehe
   «Glossar» oben) — sonst bleibt der Begriff für die Such- und
   Filterfunktion unsichtbar mit ungenutztem `bereiche`-Feld.
5. **Ressourcen/Medien**: externe Links in `:::ressourcen:::`, echte Fotos
   mit Lizenzangabe im jeweiligen Sprachblock, YouTube-Videos nur über die
   `:::video youtube="…":::`-Direktive (nie ein rohes `<iframe>`) — sonst
   fehlen Offline-Fallback und Einbettbarkeits-Check.
6. `npm run build` ausführen und im Browser gegenprüfen: DE/FR, hell/dunkel,
   Mobile (≤375px, kein horizontales Scrollen), Konsole ohne neue Fehler.
