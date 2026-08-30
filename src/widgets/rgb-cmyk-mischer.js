// RGB↔CMYK-Mischer: two synced slider groups sharing one color state, so
// learners can see both models describe the same color from two directions.
function rgbToCmyk(r, g, b) {
  const rp = r / 255, gp = g / 255, bp = b / 255;
  const k = 1 - Math.max(rp, gp, bp);
  if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = (1 - rp - k) / (1 - k);
  const m = (1 - gp - k) / (1 - k);
  const y = (1 - bp - k) / (1 - k);
  return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) };
}
function cmykToRgb(c, m, y, k) {
  const cp = c / 100, mp = m / 100, yp = y / 100, kp = k / 100;
  return {
    r: Math.round(255 * (1 - cp) * (1 - kp)),
    g: Math.round(255 * (1 - mp) * (1 - kp)),
    b: Math.round(255 * (1 - yp) * (1 - kp)),
  };
}
function toHex({ r, g, b }) {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

function slider(id, label_de, label_fr, max) {
  return `<label class="widget-mischer__slider">
    <span><span data-lang="de">${label_de}</span><span data-lang="fr">${label_fr}</span></span>
    <input type="range" class="js-${id}" min="0" max="${max}" value="0">
    <output class="js-${id}-out">0</output>
  </label>`;
}

function render(mount) {
  mount.innerHTML = `
    <div class="widget-mischer">
      <div class="widget-mischer__swatch js-swatch"></div>
      <div class="widget-mischer__groups">
        <fieldset class="widget-mischer__group">
          <legend>RGB</legend>
          ${slider('r', 'Rot', 'Rouge', 255)}
          ${slider('g', 'Grün', 'Vert', 255)}
          ${slider('b', 'Blau', 'Bleu', 255)}
        </fieldset>
        <fieldset class="widget-mischer__group">
          <legend>CMYK</legend>
          ${slider('c', 'Cyan', 'Cyan', 100)}
          ${slider('m', 'Magenta', 'Magenta', 100)}
          ${slider('y', 'Gelb', 'Jaune', 100)}
          ${slider('k', 'Schwarz (Key)', 'Noir (Key)', 100)}
        </fieldset>
      </div>
    </div>
  `;
  const el = (sel) => mount.querySelector(sel);
  const rgbInputs = ['r', 'g', 'b'].map((k) => el(`.js-${k}`));
  const cmykInputs = ['c', 'm', 'y', 'k'].map((k) => el(`.js-${k}`));
  const outputs = {};
  ['r', 'g', 'b', 'c', 'm', 'y', 'k'].forEach((k) => (outputs[k] = el(`.js-${k}-out`)));
  const swatch = el('.js-swatch');

  const paint = (rgb) => {
    swatch.style.background = toHex(rgb);
  };

  const setFromRgb = (r, g, b) => {
    const cmyk = rgbToCmyk(r, g, b);
    cmykInputs[0].value = cmyk.c; cmykInputs[1].value = cmyk.m; cmykInputs[2].value = cmyk.y; cmykInputs[3].value = cmyk.k;
    outputs.c.textContent = cmyk.c; outputs.m.textContent = cmyk.m; outputs.y.textContent = cmyk.y; outputs.k.textContent = cmyk.k;
    outputs.r.textContent = r; outputs.g.textContent = g; outputs.b.textContent = b;
    paint({ r, g, b });
  };
  const setFromCmyk = (c, m, y, k) => {
    const rgb = cmykToRgb(c, m, y, k);
    rgbInputs[0].value = rgb.r; rgbInputs[1].value = rgb.g; rgbInputs[2].value = rgb.b;
    outputs.r.textContent = rgb.r; outputs.g.textContent = rgb.g; outputs.b.textContent = rgb.b;
    outputs.c.textContent = c; outputs.m.textContent = m; outputs.y.textContent = y; outputs.k.textContent = k;
    paint(rgb);
  };

  rgbInputs.forEach((input) => input.addEventListener('input', () => {
    setFromRgb(Number(rgbInputs[0].value), Number(rgbInputs[1].value), Number(rgbInputs[2].value));
  }));
  cmykInputs.forEach((input) => input.addEventListener('input', () => {
    setFromCmyk(Number(cmykInputs[0].value), Number(cmykInputs[1].value), Number(cmykInputs[2].value), Number(cmykInputs[3].value));
  }));

  rgbInputs[0].value = 27; rgbInputs[1].value = 73; rgbInputs[2].value = 214;
  setFromRgb(27, 73, 214);
}

export function initAll() {
  document.querySelectorAll('[data-widget-mount="rgb-cmyk-mischer"]:not([data-initialized])').forEach((mount) => {
    mount.dataset.initialized = 'true';
    render(mount);
  });
}

initAll();
