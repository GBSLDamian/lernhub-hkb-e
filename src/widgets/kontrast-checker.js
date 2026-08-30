// Kontrast-Checker: computes the WCAG contrast ratio between two colors and
// rates it against AA/AAA thresholds for normal and large text.
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
function relativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
function contrastRatio(hexA, hexB) {
  const la = relativeLuminance(hexToRgb(hexA));
  const lb = relativeLuminance(hexToRgb(hexB));
  const [lighter, darker] = la > lb ? [la, lb] : [lb, la];
  return (lighter + 0.05) / (darker + 0.05);
}

function rating(ratio) {
  if (ratio >= 7) return { de: 'AAA (Fliesstext)', fr: 'AAA (texte courant)', ok: true };
  if (ratio >= 4.5) return { de: 'AA (Fliesstext)', fr: 'AA (texte courant)', ok: true };
  if (ratio >= 3) return { de: 'AA (nur Grosstext)', fr: 'AA (grand texte seulement)', ok: false };
  return { de: 'Ungenügend', fr: 'Insuffisant', ok: false };
}

function render(mount) {
  mount.innerHTML = `
    <div class="widget-kontrast">
      <div class="widget-kontrast__controls">
        <label>
          <span data-lang="de">Textfarbe</span><span data-lang="fr">Couleur du texte</span>
          <input type="color" class="js-fg" value="#1c1f26">
        </label>
        <label>
          <span data-lang="de">Hintergrundfarbe</span><span data-lang="fr">Couleur de fond</span>
          <input type="color" class="js-bg" value="#f6f7fb">
        </label>
      </div>
      <div class="widget-kontrast__preview js-preview">
        <span data-lang="de">Beispieltext zum Prüfen</span><span data-lang="fr">Exemple de texte à vérifier</span>
      </div>
      <p class="widget-kontrast__result js-result"></p>
    </div>
  `;
  const fg = mount.querySelector('.js-fg');
  const bg = mount.querySelector('.js-bg');
  const preview = mount.querySelector('.js-preview');
  const result = mount.querySelector('.js-result');

  const update = () => {
    preview.style.color = fg.value;
    preview.style.background = bg.value;
    const ratio = contrastRatio(fg.value, bg.value);
    const r = rating(ratio);
    result.innerHTML = `
      <strong>${ratio.toFixed(2)}:1</strong> —
      <span data-lang="de">${r.de}</span><span data-lang="fr">${r.fr}</span>
    `;
    result.classList.toggle('is-fail', !r.ok);
  };
  fg.addEventListener('input', update);
  bg.addEventListener('input', update);
  update();
}

export function mount(container) {
  render(container);
}
