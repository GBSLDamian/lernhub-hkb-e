// LernHub app shell: theme/language toggles, sidebar, search, home filters,
// progress/favorites (localStorage, prefix "lh_"), lightweight client-side
// navigation (History API) with a full-reload fallback, and SW registration.
const LS = {
  lang: 'lh_lang',
  theme: 'lh_theme',
  lastLesson: 'lh_last_lesson',
  frBannerDismissed: 'lh_fr_banner_dismissed',
  progress: (id) => `lh_progress_${id}`,
};

const WIDGET_MODULES = {
  'kontrast-checker': '/assets/widgets/kontrast-checker.js',
  'rgb-cmyk-mischer': '/assets/widgets/rgb-cmyk-mischer.js',
};

function safeGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
}
function safeRemove(key) {
  try { localStorage.removeItem(key); } catch { /* storage unavailable */ }
}

// ---------- Theme ----------
function currentEffectiveTheme() {
  const stored = safeGet(LS.theme);
  if (stored === 'light' || stored === 'dark') return stored;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = currentEffectiveTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    safeSet(LS.theme, next);
  });
}

// ---------- Language ----------
function initLangToggle() {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.lang === 'fr' ? 'de' : 'fr';
    document.documentElement.dataset.lang = next;
    safeSet(LS.lang, next);
    updateFrBanner();
  });
}
function updateFrBanner() {
  const banner = document.getElementById('fr-check-banner');
  if (!banner) return;
  const dismissed = safeGet(LS.frBannerDismissed) === '1';
  banner.hidden = dismissed;
}
function initFrBanner() {
  const closeBtn = document.getElementById('fr-check-close');
  updateFrBanner();
  closeBtn?.addEventListener('click', () => {
    safeSet(LS.frBannerDismissed, '1');
    document.getElementById('fr-check-banner').hidden = true;
  });
}

// ---------- Sidebar (mobile off-canvas) ----------
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  const scrim = document.getElementById('sidebar-scrim');
  if (!sidebar || !toggle) return;
  const close = () => {
    sidebar.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    scrim.hidden = true;
  };
  const open = () => {
    sidebar.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    scrim.hidden = false;
  };
  toggle.addEventListener('click', () => (sidebar.classList.contains('is-open') ? close() : open()));
  scrim.addEventListener('click', close);
  sidebar.addEventListener('click', (e) => {
    if (e.target.closest('a')) close();
  });
}
function updateActiveNav() {
  const areaId = document.body.dataset.area;
  document.querySelectorAll('.nav-tree__area').forEach((a) => {
    a.classList.toggle('is-active', a.dataset.area === areaId);
    if (a.dataset.area === areaId) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

// ---------- Search ----------
let searchIndexPromise = null;
function loadSearchIndex() {
  if (!searchIndexPromise) {
    searchIndexPromise = fetch('/search-index.json').then((r) => r.json()).catch(() => []);
  }
  return searchIndexPromise;
}
function normalize(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}
function fuzzyScore(query, entry) {
  const q = normalize(query);
  if (!q) return 0;
  const title = normalize(entry.titel);
  const text = normalize(entry.text || '');
  const tags = (entry.tags || []).map(normalize);
  if (title.startsWith(q)) return 100;
  if (title.includes(q)) return 80;
  if (tags.some((t) => t.includes(q))) return 60;
  if (text.includes(q)) return 40;
  // tolerant fallback: all query words appear (any order) somewhere in title+text
  const words = q.split(/\s+/).filter(Boolean);
  const hay = `${title} ${text}`;
  if (words.length && words.every((w) => hay.includes(w))) return 20;
  return 0;
}
function renderResults(list, entries) {
  const empty = document.getElementById('search-empty');
  list.innerHTML = entries
    .map(
      (e) => `<li><a href="${e.href}">
        <span class="search-dialog__result-title">${e.titel}</span>
        <span class="search-dialog__result-meta">${e.areaTitel} · ${e.lernfeld} · ${e.lehrjahr}. LJ</span>
      </a></li>`
    )
    .join('');
  empty.hidden = entries.length !== 0;
}
function initSearch() {
  const openBtn = document.getElementById('search-open');
  const dialog = document.getElementById('search-dialog');
  const closeBtn = document.getElementById('search-close');
  const inputDe = document.getElementById('search-input');
  const inputFr = document.getElementById('search-input-fr');
  const resultsList = document.getElementById('search-results');
  if (!openBtn || !dialog) return;

  const activeInput = () => (document.documentElement.dataset.lang === 'fr' ? inputFr : inputDe);

  const runQuery = (value) => {
    loadSearchIndex().then((entries) => {
      const lang = document.documentElement.dataset.lang === 'fr' ? 'fr' : 'de';
      const scored = entries
        .filter((e) => e.lang === lang)
        .map((e) => ({ e, score: fuzzyScore(value, e) }))
        .filter((r) => r.score > 0 || !value)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map((r) => r.e);
      renderResults(resultsList, value ? scored : []);
    });
  };

  openBtn.addEventListener('click', () => {
    dialog.showModal();
    activeInput().focus();
  });
  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  [inputDe, inputFr].forEach((input) => {
    input.addEventListener('input', () => runQuery(input.value.trim()));
  });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (dialog.open) dialog.close();
      else { dialog.showModal(); activeInput().focus(); }
    }
  });
}

// ---------- Home filters ----------
function initHomeFilters() {
  const chips = document.querySelectorAll('.chip--filter');
  const cards = document.querySelectorAll('#home-lesson-list .lesson-card');
  if (!chips.length || !cards.length) return;
  const active = { lehrjahr: new Set(), typ: new Set() };
  const apply = () => {
    cards.forEach((card) => {
      const okYear = active.lehrjahr.size === 0 || active.lehrjahr.has(card.dataset.lehrjahr);
      const okTyp = active.typ.size === 0 || active.typ.has(card.dataset.typ);
      card.classList.toggle('is-hidden', !(okYear && okTyp));
    });
  };
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const group = chip.dataset.filterLehrjahr ? 'lehrjahr' : 'typ';
      const value = chip.dataset.filterLehrjahr || chip.dataset.filterTyp;
      chip.classList.toggle('is-active');
      if (active[group].has(value)) active[group].delete(value);
      else active[group].add(value);
      apply();
    });
  });
}

// ---------- Progress & continue-learning ----------
function recordVisit() {
  const lessonId = document.body.dataset.lesson;
  const areaId = document.body.dataset.area;
  if (!lessonId) return;
  const titleDe = document.querySelector('.lesson-article__header h1[data-lang="de"]')?.textContent || document.title;
  const titleFr = document.querySelector('.lesson-article__header h1[data-lang="fr"]')?.textContent || document.title;
  safeSet(LS.lastLesson, JSON.stringify({ href: location.pathname, titel_de: titleDe, titel_fr: titleFr, area: areaId }));
}
function initProgressTracking() {
  const lessonId = document.body.dataset.lesson;
  if (!lessonId) return;
  const article = document.querySelector('.lesson-article');
  if (!article) return;
  const marker = article.lastElementChild;
  if (!marker || !('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        safeSet(LS.progress(lessonId), '100');
        obs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  obs.observe(marker);
}
function paintProgressBars() {
  document.querySelectorAll('[data-progress-for]').forEach((el) => {
    const value = Number(safeGet(LS.progress(el.dataset.progressFor)) || 0);
    const bar = el.querySelector('.lesson-card__progress-bar');
    if (bar) bar.style.width = `${value}%`;
  });
  const areaEls = document.querySelectorAll('[data-area-progress]');
  if (!areaEls.length) return;
  loadSearchIndex().then((entries) => {
    const lessonsByArea = new Map();
    entries.filter((e) => e.lang === 'de').forEach((e) => {
      if (!lessonsByArea.has(e.area)) lessonsByArea.set(e.area, []);
      lessonsByArea.get(e.area).push(e.id);
    });
    areaEls.forEach((el) => {
      const ids = lessonsByArea.get(el.dataset.areaProgress) || [];
      const total = ids.reduce((sum, id) => sum + Number(safeGet(LS.progress(id)) || 0), 0);
      const pct = ids.length ? Math.round(total / ids.length) : 0;
      const bar = el.querySelector('.area-card__progress-bar');
      if (bar) bar.style.width = `${pct}%`;
    });
  });
}
function paintContinueLearning() {
  const container = document.getElementById('continue-learning');
  if (!container) return;
  const raw = safeGet(LS.lastLesson);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    const link = document.getElementById('continue-learning-link');
    link.href = data.href;
    link.innerHTML = `<span data-lang="de">${data.titel_de}</span><span data-lang="fr">${data.titel_fr}</span>`;
    container.hidden = false;
  } catch { /* ignore corrupt entry */ }
}

// ---------- Reset progress ----------
function initReset() {
  const btn = document.getElementById('reset-progress');
  btn?.addEventListener('click', () => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('lh_progress_')) keys.push(k);
    }
    keys.forEach(safeRemove);
    safeRemove(LS.lastLesson);
    paintProgressBars();
    const container = document.getElementById('continue-learning');
    if (container) container.hidden = true;
  });
}

// ---------- Widgets ----------
async function mountWidgets(root = document) {
  const slugs = new Set(
    [...root.querySelectorAll('[data-widget-mount]')].map((el) => el.dataset.widgetMount)
  );
  for (const slug of slugs) {
    const src = WIDGET_MODULES[slug];
    if (!src) continue;
    try {
      const mod = await import(src);
      mod.initAll?.();
    } catch (err) {
      console.error('Widget konnte nicht geladen werden:', slug, err);
    }
  }
}

// ---------- Client-side navigation ----------
function swapMainContent(doc) {
  const newMain = doc.getElementById('main-content');
  const oldMain = document.getElementById('main-content');
  if (!newMain || !oldMain) return false;
  document.title = doc.title;
  oldMain.innerHTML = newMain.innerHTML;
  document.body.dataset.area = doc.body.dataset.area || '';
  document.body.dataset.lesson = doc.body.dataset.lesson || '';
  updateActiveNav();
  mountWidgets(oldMain);
  recordVisit();
  initProgressTracking();
  paintProgressBars();
  window.scrollTo(0, 0);
  return true;
}

async function navigate(url, push = true) {
  try {
    const res = await fetch(url, { headers: { 'X-LernHub-Nav': '1' } });
    if (!res.ok) throw new Error('http ' + res.status);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const apply = () => swapMainContent(doc);
    if (document.startViewTransition) document.startViewTransition(apply);
    else apply();
    if (push) history.pushState({ url }, '', url);
  } catch (err) {
    window.location.href = url;
  }
}

function initClientNav() {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    let url;
    try { url = new URL(a.href, location.href); } catch { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname) return; // in-page anchors (TOC)
    e.preventDefault();
    navigate(url.pathname);
  });
  window.addEventListener('popstate', () => navigate(location.pathname, false));
}

// ---------- Service worker ----------
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}

// ---------- Boot ----------
function boot() {
  initThemeToggle();
  initLangToggle();
  initFrBanner();
  initSidebar();
  initSearch();
  initHomeFilters();
  initReset();
  updateActiveNav();
  recordVisit();
  initProgressTracking();
  paintProgressBars();
  paintContinueLearning();
  initClientNav();
  mountWidgets();
  initServiceWorker();

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!safeGet(LS.theme)) document.documentElement.removeAttribute('data-theme');
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
