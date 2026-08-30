// Ausfüllbare, druckbare Vorlage (Marken-Steckbrief, Persona, SWOT, Business
// Model Canvas, Skript/Storyboard, …). Felder werden aus der Konfiguration
// gerendert; Eingaben landen in localStorage (Präfix lh_, wie der Rest der
// App) und lassen sich drucken/als PDF speichern.
// config: { storageKey, fields: [{ key, labelDe, labelFr, type: 'text'|'textarea', placeholderDe, placeholderFr }] }
export function mount(container, config) {
  const { storageKey, fields } = config || {};
  if (!container || !storageKey || !fields?.length) return;

  container.className = 'vorlage-canvas';
  container.innerHTML = `
    <div class="vorlage-canvas__grid">
      ${fields
        .map((f) => {
          const tag = f.type === 'textarea' ? 'textarea' : 'input';
          const attrs = tag === 'textarea' ? 'rows="4"' : 'type="text"';
          return `<label class="vorlage-canvas__field">
            <span data-lang="de">${f.labelDe}</span><span data-lang="fr">${f.labelFr}</span>
            <${tag} ${attrs} data-vorlage-field="${f.key}" placeholder="${(f.placeholderDe || '').replace(/"/g, '&quot;')}"></${tag}>
          </label>`;
        })
        .join('')}
    </div>
    <div class="vorlage-canvas__actions">
      <button type="button" class="btn-secondary" data-action="save">
        <span data-lang="de">Speichern</span><span data-lang="fr">Enregistrer</span>
      </button>
      <button type="button" class="btn-secondary" data-action="print">
        <span data-lang="de">Drucken / als PDF</span><span data-lang="fr">Imprimer / en PDF</span>
      </button>
    </div>
  `;

  const inputs = [...container.querySelectorAll('[data-vorlage-field]')];
  const saveBtn = container.querySelector('[data-action="save"]');
  const printBtn = container.querySelector('[data-action="print"]');

  function load() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { /* ignore */ }
    inputs.forEach((el) => {
      const key = el.dataset.vorlageField;
      if (saved[key] !== undefined) el.value = saved[key];
    });
  }
  function save() {
    const data = {};
    inputs.forEach((el) => { data[el.dataset.vorlageField] = el.value; });
    try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch { /* ignore */ }
  }

  load();
  inputs.forEach((el) => el.addEventListener('input', save));

  saveBtn.addEventListener('click', () => {
    save();
    const original = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span data-lang="de">✓ Gespeichert</span><span data-lang="fr">✓ Enregistré</span>';
    setTimeout(() => { saveBtn.innerHTML = original; }, 1500);
  });
  printBtn.addEventListener('click', () => {
    save();
    container.classList.add('is-printing');
    document.body.classList.add('print-vorlage-only');
    window.print();
  });
  window.addEventListener('afterprint', () => {
    document.body.classList.remove('print-vorlage-only');
    container.classList.remove('is-printing');
  });
}
