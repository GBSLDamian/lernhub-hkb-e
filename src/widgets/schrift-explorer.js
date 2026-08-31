// Schrift-Explorer: Dropdown mit Schriften gruppiert nach Kategorie. Zeigt
// beim Auswählen eine Headline + einen Fliesstext-Absatz live in der
// gewählten Schrift sowie eine kurze Wirkungserklärung.
// config: { headlineDe, headlineFr, textDe, textFr,
//   categories: [{ labelDe, labelFr, fonts: [{ id, family, nameDe, nameFr, explainDe, explainFr }] }] }
export function mount(container, config) {
  const { headlineDe, headlineFr, textDe, textFr, categories } = config || {};
  if (!container || !categories?.length) return;

  container.className = 'schrift-explorer';
  // Native <optgroup>/<option> only support plain text, not the
  // data-lang="de"/"fr" span mechanism — so two full selects (one per
  // language, kept in sync) are used instead, matching the pattern used
  // by other widgets with bilingual form inputs.
  const buildOptions = (lang) =>
    categories
      .map(
        (cat) => `<optgroup label="${lang === 'fr' ? cat.labelFr : cat.labelDe}">
        ${cat.fonts.map((f) => `<option value="${f.id}">${lang === 'fr' ? f.nameFr : f.nameDe}</option>`).join('')}
      </optgroup>`
      )
      .join('');

  container.innerHTML = `
    <label class="schrift-explorer__select-label" data-lang="de">
      <span>Schrift wählen</span>
      <select class="schrift-explorer__select" data-lang-select="de">${buildOptions('de')}</select>
    </label>
    <label class="schrift-explorer__select-label" data-lang="fr">
      <span>Choisir une police</span>
      <select class="schrift-explorer__select" data-lang-select="fr">${buildOptions('fr')}</select>
    </label>
    <div class="schrift-explorer__preview">
      <p class="schrift-explorer__headline" data-role="headline">
        <span data-lang="de">${headlineDe}</span><span data-lang="fr">${headlineFr}</span>
      </p>
      <p class="schrift-explorer__body" data-role="body">
        <span data-lang="de">${textDe}</span><span data-lang="fr">${textFr}</span>
      </p>
    </div>
    <p class="schrift-explorer__explain" data-role="explain"></p>
  `;

  const allFonts = categories.flatMap((cat) => cat.fonts.map((f) => ({ ...f, categoryDe: cat.labelDe, categoryFr: cat.labelFr })));
  const selectDe = container.querySelector('[data-lang-select="de"]');
  const selectFr = container.querySelector('[data-lang-select="fr"]');
  const headline = container.querySelector('[data-role="headline"]');
  const body = container.querySelector('[data-role="body"]');
  const explain = container.querySelector('[data-role="explain"]');

  function apply(id) {
    const font = allFonts.find((f) => f.id === id) || allFonts[0];
    headline.style.fontFamily = font.family;
    body.style.fontFamily = font.family;
    explain.innerHTML = `
      <span data-lang="de"><strong>${font.categoryDe} – ${font.nameDe}:</strong> ${font.explainDe}</span>
      <span data-lang="fr"><strong>${font.categoryFr} – ${font.nameFr} :</strong> ${font.explainFr}</span>
    `;
  }

  selectDe.addEventListener('change', () => { selectFr.value = selectDe.value; apply(selectDe.value); });
  selectFr.addEventListener('change', () => { selectDe.value = selectFr.value; apply(selectFr.value); });
  apply(allFonts[0].id);
}
