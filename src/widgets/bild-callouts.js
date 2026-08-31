// Bild-Callouts: legt nummerierte, klickbare Marker über ein Bild (z. B. ein
// Werbeplakat), die auf Klick eine Erklärung darunter einblenden — macht eine
// Bildanalyse (hier: AIDA) direkt im Bild sichtbar statt nur in Fliesstext.
// config: { image, altDe, altFr, creditDe, creditFr,
//           marker: [{ id, xPercent, yPercent, labelDe, labelFr, textDe, textFr }] }
export function mount(container, config) {
  const { image, altDe, creditDe, creditFr, marker } = config || {};
  if (!container || !image || !marker?.length) return;

  container.className = 'bild-callouts';
  container.innerHTML = `
    <div class="bild-callouts__frame">
      <img src="${image}" alt="${altDe || ''}">
      ${marker
        .map(
          (m, i) => `<button type="button" class="bild-callouts__marker" style="left:${m.xPercent}%; top:${m.yPercent}%" data-idx="${i}" aria-label="${m.labelDe}">${i + 1}</button>`
        )
        .join('')}
    </div>
    ${creditDe ? `<p class="text-muted bild-callouts__credit"><span data-lang="de">${creditDe}</span><span data-lang="fr">${creditFr || creditDe}</span></p>` : ''}
    <div class="bild-callouts__caption" data-role="caption">
      <p class="text-muted"><span data-lang="de">Klicke auf einen nummerierten Marker im Bild.</span><span data-lang="fr">Clique sur un marqueur numéroté dans l'image.</span></p>
    </div>
  `;

  const markers = container.querySelectorAll('.bild-callouts__marker');
  const captionEl = container.querySelector('[data-role="caption"]');

  markers.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      markers.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const m = marker[i];
      captionEl.innerHTML = `
        <p>
          <span data-lang="de"><strong>${i + 1}. ${m.labelDe}</strong> — ${m.textDe}</span>
          <span data-lang="fr"><strong>${i + 1}. ${m.labelFr}</strong> — ${m.textFr}</span>
        </p>
      `;
    });
  });
}
