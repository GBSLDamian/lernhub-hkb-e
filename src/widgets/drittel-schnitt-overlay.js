// Raster-Overlay zum Umschalten: legt Drittel-Regel- oder Goldener-Schnitt-
// Linien über ein echtes Foto, um die Wirkung sichtbar statt nur beschrieben
// zu machen.
// config: { image, altDe, altFr, creditDe, creditFr }
function gridSvg(mode) {
  if (mode === 'none') return '';
  // Drittel-Regel: Linien bei 1/3 und 2/3. Goldener Schnitt: bei ~0.382 und ~0.618.
  const a = mode === 'golden' ? 38.2 : 33.333;
  const b = mode === 'golden' ? 61.8 : 66.667;
  const line = (x1, y1, x2, y2) => `<line x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%" />`;
  return `
    <svg class="drittel-overlay__svg" preserveAspectRatio="none" viewBox="0 0 100 100">
      ${line(a, 0, a, 100)}${line(b, 0, b, 100)}
      ${line(0, a, 100, a)}${line(0, b, 100, b)}
      <circle cx="${a}%" cy="${a}%" r="1.4" />
      <circle cx="${b}%" cy="${a}%" r="1.4" />
      <circle cx="${a}%" cy="${b}%" r="1.4" />
      <circle cx="${b}%" cy="${b}%" r="1.4" />
    </svg>
  `;
}

export function mount(container, config) {
  const { image, altDe, altFr, creditDe, creditFr } = config || {};
  if (!container || !image) return;

  container.className = 'drittel-overlay';
  container.innerHTML = `
    <div class="chip-group" role="group">
      <button type="button" class="chip chip--filter is-active" data-mode="none"><span data-lang="de">Kein Raster</span><span data-lang="fr">Sans grille</span></button>
      <button type="button" class="chip chip--filter" data-mode="thirds"><span data-lang="de">Drittel-Regel</span><span data-lang="fr">Règle des tiers</span></button>
      <button type="button" class="chip chip--filter" data-mode="golden"><span data-lang="de">Goldener Schnitt</span><span data-lang="fr">Nombre d'or</span></button>
    </div>
    <div class="drittel-overlay__frame">
      <img src="${image}" alt="${altDe || ''}" data-lang="de">
      <img src="${image}" alt="${altFr || ''}" data-lang="fr">
      <div class="drittel-overlay__grid" data-role="grid"></div>
    </div>
    ${creditDe ? `<p class="text-muted drittel-overlay__credit"><span data-lang="de">${creditDe}</span><span data-lang="fr">${creditFr || creditDe}</span></p>` : ''}
  `;

  const gridEl = container.querySelector('[data-role="grid"]');
  const buttons = container.querySelectorAll('.chip--filter');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      gridEl.innerHTML = gridSvg(btn.dataset.mode);
    });
  });
}
