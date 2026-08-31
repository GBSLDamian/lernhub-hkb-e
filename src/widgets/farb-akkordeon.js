// Farb-Akkordeon: pro Farbe eine aufklappbare Zeile (button[aria-expanded]),
// zeigt beim Öffnen ein reales, lokal eingebettetes Werbebeispiel in dieser
// Farbe plus 1-2 moderne Markenbeispiele. Nur eine Zeile gleichzeitig offen.
// config: { items: [{ id, swatch, farbeDe, farbeFr, wirkungDe, wirkungFr,
//           bild, bildAltDe, bildCreditDe, bildCreditFr, markenDe, markenFr }] }
export function mount(container, config) {
  const items = config?.items;
  if (!container || !items?.length) return;

  container.className = 'farb-akkordeon';
  container.innerHTML = items
    .map(
      (item, i) => `
    <div class="farb-akkordeon__row">
      <h3 class="farb-akkordeon__heading">
        <button type="button" class="farb-akkordeon__trigger" id="fa-trigger-${i}" aria-expanded="false" aria-controls="fa-panel-${i}">
          <span class="farb-akkordeon__swatch" style="background:${item.swatch}" aria-hidden="true"></span>
          <span data-lang="de">${item.farbeDe}</span><span data-lang="fr">${item.farbeFr}</span>
          <span class="farb-akkordeon__chevron" aria-hidden="true">▾</span>
        </button>
      </h3>
      <div class="farb-akkordeon__panel" id="fa-panel-${i}" role="region" aria-labelledby="fa-trigger-${i}" hidden>
        <p><span data-lang="de">${item.wirkungDe}</span><span data-lang="fr">${item.wirkungFr}</span></p>
        <img class="farb-akkordeon__img" src="${item.bild}" alt="${item.bildAltDe || ''}" loading="lazy">
        <p class="text-muted farb-akkordeon__credit"><span data-lang="de">${item.bildCreditDe}</span><span data-lang="fr">${item.bildCreditFr || item.bildCreditDe}</span></p>
        <p class="farb-akkordeon__marken"><span data-lang="de"><strong>Heutige Markenbeispiele:</strong> ${item.markenDe}</span><span data-lang="fr"><strong>Exemples de marques actuelles :</strong> ${item.markenFr}</span></p>
      </div>
    </div>`
    )
    .join('');

  const triggers = container.querySelectorAll('.farb-akkordeon__trigger');
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
      triggers.forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
        document.getElementById(t.getAttribute('aria-controls')).hidden = true;
      });
      if (willOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });
  });
}
