// Selbstcheck-Liste mit Begründung beim Antippen.
// config: { items: [{ id, textDe, textFr, whyDe, whyFr }] }
export function mount(container, config) {
  const items = config?.items;
  if (!container || !items?.length) return;

  container.className = 'checkliste';
  container.innerHTML = `<ul class="checkliste__list"></ul>`;
  const list = container.querySelector('.checkliste__list');

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'checkliste__item';
    li.innerHTML = `
      <input type="checkbox" id="chk-${item.id}" aria-describedby="why-${item.id}">
      <span class="checkliste__text">
        <label for="chk-${item.id}"><span data-lang="de">${item.textDe}</span><span data-lang="fr">${item.textFr}</span></label>
        ${item.whyDe ? `<div class="checkliste__explain" id="why-${item.id}">💡 <span data-lang="de">${item.whyDe}</span><span data-lang="fr">${item.whyFr || ''}</span></div>` : ''}
      </span>
    `;
    list.appendChild(li);

    const checkbox = li.querySelector('input[type=checkbox]');
    const explain = li.querySelector('.checkliste__explain');
    function apply() {
      li.classList.toggle('is-checked', checkbox.checked);
      if (explain) explain.classList.add('is-visible');
    }
    checkbox.addEventListener('click', (e) => { e.stopPropagation(); apply(); });
    li.addEventListener('click', (e) => {
      if (e.target === checkbox) return;
      checkbox.checked = !checkbox.checked;
      apply();
    });
  });
}
