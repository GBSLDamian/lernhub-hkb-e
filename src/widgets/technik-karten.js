// Technik-Karten mit optionalen iPhone-/Android-Tabs und einer kurzen
// Verständnisfrage je Karte. Eine Karte gilt erst als erledigt, wenn die
// Frage beantwortet wurde.
// config: { items: [{ id, titleDe, titleFr, whyDe, whyFr, universalDe?, universalFr?,
//   iphoneDe?, iphoneFr?, androidDe?, androidFr?,
//   check: { frageDe, frageFr, optionenDe, optionenFr, loesung, erklaerungDe, erklaerungFr } }] }
export function mount(container, config) {
  const items = config?.items;
  if (!container || !items?.length) return;
  container.className = 'technik-karten';
  container.innerHTML = '';

  items.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'tech-card';

    const platformHtml = item.universalDe
      ? `<div class="tech-card__universal"><span data-lang="de">${item.universalDe}</span><span data-lang="fr">${item.universalFr}</span></div>`
      : `
        <div class="tech-card__tabs" role="tablist">
          <button type="button" class="tech-card__tab is-active" data-platform="iphone">📱 iPhone</button>
          <button type="button" class="tech-card__tab" data-platform="android">🤖 Android</button>
        </div>
        <div class="tech-card__platform" data-platform-content="iphone"><span data-lang="de">${item.iphoneDe}</span><span data-lang="fr">${item.iphoneFr}</span></div>
        <div class="tech-card__platform" data-platform-content="android" hidden><span data-lang="de">${item.androidDe}</span><span data-lang="fr">${item.androidFr}</span></div>
      `;

    card.innerHTML = `
      <div class="tech-card__header">
        <span class="tech-card__num">${idx + 1}</span>
        <h3><span data-lang="de">${item.titleDe}</span><span data-lang="fr">${item.titleFr}</span></h3>
        <span class="tech-card__status" data-role="status">○</span>
      </div>
      <p class="text-muted"><span data-lang="de">${item.whyDe}</span><span data-lang="fr">${item.whyFr}</span></p>
      ${platformHtml}
      <div class="tech-card__check">
        <p><strong><span data-lang="de">${item.check.frageDe}</span><span data-lang="fr">${item.check.frageFr}</span></strong></p>
        <div class="tech-card__options">
          ${item.check.optionenDe.map((optDe, i) => `<button type="button" class="chip chip--filter" data-idx="${i}"><span data-lang="de">${optDe}</span><span data-lang="fr">${item.check.optionenFr[i]}</span></button>`).join('')}
        </div>
        <div class="exercise-feedback" data-role="feedback"></div>
      </div>
    `;
    container.appendChild(card);

    if (!item.universalDe) {
      const tabs = card.querySelectorAll('.tech-card__tab');
      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach((t) => t.classList.remove('is-active'));
          tab.classList.add('is-active');
          card.querySelectorAll('[data-platform-content]').forEach((el) => {
            el.hidden = el.dataset.platformContent !== tab.dataset.platform;
          });
        });
      });
    }

    const buttons = card.querySelectorAll('.tech-card__check [data-idx]');
    const feedback = card.querySelector('[data-role="feedback"]');
    const status = card.querySelector('[data-role="status"]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        buttons.forEach((b) => (b.disabled = true));
        const correct = Number(btn.dataset.idx) === item.check.loesung;
        feedback.className = 'exercise-feedback is-visible ' + (correct ? 'is-correct' : 'is-incorrect');
        feedback.innerHTML = `<span data-lang="de"><strong>${correct ? 'Genau!' : 'Nicht ganz.'}</strong> ${item.check.erklaerungDe}</span><span data-lang="fr"><strong>${correct ? 'Exactement !' : 'Pas tout à fait.'}</strong> ${item.check.erklaerungFr}</span>`;
        card.classList.add('is-done');
        status.textContent = '✅';
      });
    });
  });
}
