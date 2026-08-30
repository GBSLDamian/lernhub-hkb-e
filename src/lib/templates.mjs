import { icon } from './icons.mjs';

const TYP_LABEL = {
  theorie: { de: 'Theorie', fr: 'Théorie' },
  uebung: { de: 'Übung', fr: 'Exercice' },
  video: { de: 'Video', fr: 'Vidéo' },
  tool: { de: 'Tool', fr: 'Outil' },
  referenz: { de: 'Referenz', fr: 'Référence' },
};

// Anti-flicker + PWA head script: runs before first paint so the correct
// language/theme is already active when CSS applies (see /assets/styles/*).
const HEAD_SCRIPT = `(function(){
  try {
    var lang = localStorage.getItem('lh_lang') || 'de';
    var theme = localStorage.getItem('lh_theme');
    document.documentElement.dataset.lang = lang;
    if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
  } catch (e) {}
})();`;

function dualLabel(de, fr, tag = 'span') {
  return `<${tag} data-lang="de">${de}</${tag}><${tag} data-lang="fr">${fr}</${tag}>`;
}

function head({ title, description }) {
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · LernHub</title>
<meta name="description" content="${description || ''}">
<meta name="theme-color" content="#1b49d6">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" href="/assets/icons/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/styles/tokens.css">
<link rel="stylesheet" href="/assets/styles/base.css">
<link rel="stylesheet" href="/assets/styles/components.css">
<script>${HEAD_SCRIPT}</script>`;
}

function clusterNav(clusters, areas, activeAreaId) {
  return clusters
    .map((cluster) => {
      const clusterAreas = areas.filter((a) => a.cluster === cluster.id).sort((a, b) => a.reihenfolge - b.reihenfolge);
      const items = clusterAreas
        .map((a) => {
          const isActive = a.id === activeAreaId;
          return `<li>
  <a class="nav-tree__area${isActive ? ' is-active' : ''}" href="/${a.id}/" data-area="${a.id}"${isActive ? ' aria-current="page"' : ''} style="--area-color: var(--cluster-${cluster.id})">
    ${icon(a.icon)}
    <span class="nav-tree__area-label">
      ${dualLabel(a.titel.de, a.titel.fr)}
    </span>
  </a>
</li>`;
        })
        .join('\n');
      return `<div class="nav-tree__cluster" style="--cluster-color: var(--cluster-${cluster.id})">
  <p class="nav-tree__cluster-label">${dualLabel(cluster.titel.de, cluster.titel.fr)}</p>
  <ul class="nav-tree__areas">${items}</ul>
</div>`;
    })
    .join('\n');
}

function header() {
  return `<header class="app-header">
  <button class="icon-btn app-header__menu" id="sidebar-toggle" aria-label="Menü" aria-expanded="false" aria-controls="sidebar">
    ${icon('menu')}
  </button>
  <a class="app-header__brand" href="/">LernHub<span class="app-header__brand-sub">HKB&nbsp;E</span></a>
  <button class="app-header__search-btn" id="search-open" aria-haspopup="dialog" aria-controls="search-dialog">
    ${icon('search')}
    ${dualLabel('Suchen…', 'Rechercher…')}
    <kbd class="app-header__kbd">⌘K</kbd>
  </button>
  <div class="app-header__actions">
    <button class="icon-btn" id="lang-toggle" aria-label="Sprache wechseln / Changer de langue">
      ${icon('globe')}
      <span class="lang-toggle__code" data-lang="de">DE</span><span class="lang-toggle__code" data-lang="fr">FR</span>
    </button>
    <button class="icon-btn" id="theme-toggle" aria-label="Hell/Dunkel umschalten">
      ${icon('sun', 'icon--sun')}${icon('moon', 'icon--moon')}
    </button>
  </div>
</header>`;
}

function searchDialog() {
  return `<dialog id="search-dialog" class="search-dialog" aria-label="Suche">
  <div class="search-dialog__box">
    <div class="search-dialog__input-row">
      ${icon('search')}
      <input type="search" id="search-input" class="search-dialog__input" autocomplete="off"
        placeholder="Titel, Begriff, Tag…" data-lang="de">
      <input type="search" id="search-input-fr" class="search-dialog__input" autocomplete="off"
        placeholder="Titre, terme, mot-clé…" data-lang="fr" hidden>
      <button class="icon-btn" id="search-close" aria-label="Schliessen">${icon('close')}</button>
    </div>
    <ul id="search-results" class="search-dialog__results"></ul>
    <p id="search-empty" class="search-dialog__empty" hidden>
      <span data-lang="de">Keine Treffer.</span><span data-lang="fr">Aucun résultat.</span>
    </p>
  </div>
</dialog>`;
}

function frCheckBanner() {
  return `<div class="fr-check-banner" data-lang="fr" id="fr-check-banner" hidden>
  <p>⚠ Traduction assistée par machine, en cours de relecture.</p>
  <button class="fr-check-banner__close" id="fr-check-close" aria-label="Fermer">${icon('close')}</button>
</div>`;
}

function breadcrumbs(trail) {
  if (!trail || !trail.length) return '';
  const items = trail
    .map((t, i) => {
      const isLast = i === trail.length - 1;
      const inner = dualLabel(t.de, t.fr);
      return isLast
        ? `<li aria-current="page">${inner}</li>`
        : `<li><a href="${t.href}">${inner}</a></li>`;
    })
    .join(`<li class="breadcrumbs__sep" aria-hidden="true">${icon('chevron-right')}</li>`);
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items}</ol></nav>`;
}

function metaChips(lesson) {
  const typ = TYP_LABEL[lesson.typ] || { de: lesson.typ, fr: lesson.typ };
  const frOrdinal = lesson.lehrjahr === 1 ? '1re' : `${lesson.lehrjahr}e`;
  return `<div class="meta-chips">
  <span class="chip chip--mono">${lesson.lernfeld} · <span data-lang="de">${lesson.lehrjahr}. LJ</span><span data-lang="fr">${frOrdinal} an.</span></span>
  <span class="chip">${dualLabel(typ.de, typ.fr)}</span>
  <span class="chip chip--mono">${lesson.kstufe}</span>
</div>`;
}

function toc(headings) {
  if (!headings || !headings.length) return '';
  const items = headings
    .filter((h) => h.level === 2)
    .map((h) => `<li><a href="#${h.id}">${h.text}</a></li>`)
    .join('');
  return `<nav class="toc" aria-label="Auf dieser Seite">
  <p class="toc__label"><span data-lang="de">Auf dieser Seite</span><span data-lang="fr">Sur cette page</span></p>
  <ul>${items}</ul>
</nav>`;
}

function prevNextNav(prev, next) {
  if (!prev && !next) return '';
  return `<nav class="prev-next" aria-label="Lektionsnavigation">
  ${prev ? `<a class="prev-next__link prev-next__link--prev" href="${prev.href}">
    <span class="prev-next__dir"><span data-lang="de">Zurück</span><span data-lang="fr">Précédent</span></span>
    <span class="prev-next__title">${dualLabel(prev.titel_de, prev.titel_fr)}</span>
  </a>` : '<span></span>'}
  ${next ? `<a class="prev-next__link prev-next__link--next" href="${next.href}">
    <span class="prev-next__dir"><span data-lang="de">Weiter</span><span data-lang="fr">Suivant</span></span>
    <span class="prev-next__title">${dualLabel(next.titel_de, next.titel_fr)}</span>
  </a>` : '<span></span>'}
</nav>`;
}

function footer() {
  return `<footer class="app-footer">
  <p>${dualLabel('LernHub · Nachschlagewerk HKB E', 'LernHub · Ouvrage de référence HKB E')}</p>
  <button class="link-btn" id="reset-progress">${dualLabel('Fortschritt zurücksetzen', 'Réinitialiser la progression')}</button>
</footer>`;
}

export function pageShell({ title, description, bodyHtml, activeAreaId, activeLessonId, clusters, areas, trail, headings, prev, next, widgets = [], extraScripts = [] }) {
  const widgetScripts = widgets
    .map((w) => `<script type="module" src="/assets/widgets/${w}.js" defer></script>`)
    .join('\n');
  return `<!DOCTYPE html>
<html lang="de">
<head>
${head({ title, description })}
</head>
<body data-area="${activeAreaId || ''}" data-lesson="${activeLessonId || ''}">
${frCheckBanner()}
${header()}
${searchDialog()}
<div class="app-shell">
  <nav class="sidebar" id="sidebar" aria-label="Modulbaum">
    <a class="sidebar__home" href="/">${icon('home')} ${dualLabel('Startseite', 'Accueil')}</a>
    ${clusterNav(clusters, areas, activeAreaId)}
  </nav>
  <div class="sidebar-scrim" id="sidebar-scrim" hidden></div>
  <main class="main-content" id="main-content">
    ${breadcrumbs(trail)}
    <div class="content-grid">
      <article class="lesson-article">
        ${bodyHtml}
        ${prevNextNav(prev, next)}
      </article>
      ${toc(headings)}
    </div>
  </main>
</div>
${footer()}
<script type="module" src="/assets/scripts/app.js"></script>
${widgetScripts}
${extraScripts.join('\n')}
</body>
</html>`;
}

export { dualLabel, metaChips, TYP_LABEL };
