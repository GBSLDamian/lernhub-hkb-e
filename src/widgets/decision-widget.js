// Entscheidungs-Widget: zwei/mehr Auswahl-Buttons, Live-Ergebnis mit
// Begründung. Lernende treffen eine Entscheidung und sehen sofort die
// Wirkung. config: { options: [{ de: { label, result }, fr: { label, result } }] }
export function mount(container, config) {
  const options = config?.options;
  if (!container || !options || !options.length) return;

  container.className = 'decision-widget';
  container.innerHTML = `
    <div class="decision-widget__choices">
      ${options
        .map(
          (opt, i) => `<button type="button" class="decision-widget__choice" data-idx="${i}">
            <span data-lang="de">${opt.de.label}</span><span data-lang="fr">${opt.fr.label}</span>
          </button>`
        )
        .join('')}
    </div>
    <div class="decision-widget__result" hidden>
      ${options
        .map(
          (opt, i) => `<span class="decision-widget__result-text" data-idx="${i}" hidden>
            <span data-lang="de">${opt.de.result}</span><span data-lang="fr">${opt.fr.result}</span>
          </span>`
        )
        .join('')}
    </div>
  `;

  const buttons = [...container.querySelectorAll('.decision-widget__choice')];
  const resultEl = container.querySelector('.decision-widget__result');
  const resultTexts = [...container.querySelectorAll('.decision-widget__result-text')];

  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      resultEl.hidden = false;
      resultTexts.forEach((t) => (t.hidden = t.dataset.idx !== String(i)));
    });
  });
}
