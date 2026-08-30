// Font-Umschalter: Live-Vorschau + kurze Wirkungserklärung pro Schriftart.
// config: { fonts: [{ family, labelShort, explainDe, explainFr }], sampleDe, sampleFr }
export function mount(container, config) {
  const { fonts, sampleDe, sampleFr } = config || {};
  if (!container || !fonts || !fonts.length) return;

  container.className = 'font-switcher';
  container.innerHTML = `
    <div class="font-switcher__preview" id="fs-preview">
      <span data-lang="de">${sampleDe || ''}</span><span data-lang="fr">${sampleFr || ''}</span>
    </div>
    <div class="font-switcher__buttons">
      ${fonts.map((f, i) => `<button type="button" class="font-switcher__btn" data-idx="${i}" style="font-family:${f.family};">${f.labelShort}</button>`).join('')}
    </div>
    <div class="font-switcher__explain" id="fs-explain">
      ${fonts.map((f, i) => `<span class="font-switcher__explain-text" data-idx="${i}" hidden><span data-lang="de">${f.explainDe}</span><span data-lang="fr">${f.explainFr}</span></span>`).join('')}
    </div>
  `;

  const preview = container.querySelector('#fs-preview');
  const buttons = [...container.querySelectorAll('.font-switcher__btn')];
  const explains = [...container.querySelectorAll('.font-switcher__explain-text')];

  function select(i) {
    buttons.forEach((b) => b.classList.remove('is-active'));
    buttons[i].classList.add('is-active');
    preview.style.fontFamily = fonts[i].family;
    explains.forEach((e) => (e.hidden = e.dataset.idx !== String(i)));
  }

  buttons.forEach((b, i) => b.addEventListener('click', () => select(i)));
  select(0);
}
