// Kompressions-Demo: echtes Foto wird per Canvas live neu als JPEG kodiert
// (canvas.toBlob), Qualitäts-Slider zeigt Grösse/Schärfe-Trade-off in
// Echtzeit — keine Simulation, sondern echte Browser-Kompression.
// config: { image, altDe, altFr, creditDe, creditFr }
export function mount(container, config) {
  const { image, altDe, altFr, creditDe, creditFr } = config || {};
  if (!container || !image) return;

  container.className = 'kompression-demo';
  container.innerHTML = `
    <div class="kompression-demo__preview">
      <img data-role="preview" alt="${altDe || ''}">
    </div>
    <label class="kompression-demo__slider-row">
      <span data-lang="de">JPEG-Qualität</span><span data-lang="fr">Qualité JPEG</span>
      <input type="range" min="2" max="100" value="80" data-role="quality">
      <span class="chip chip--mono" data-role="quality-value">80%</span>
    </label>
    <p class="kompression-demo__size" data-role="size"></p>
    ${creditDe ? `<p class="text-muted kompression-demo__credit"><span data-lang="de">${creditDe}</span><span data-lang="fr">${creditFr || creditDe}</span></p>` : ''}
  `;

  const previewEl = container.querySelector('[data-role="preview"]');
  const sliderEl = container.querySelector('[data-role="quality"]');
  const valueEl = container.querySelector('[data-role="quality-value"]');
  const sizeEl = container.querySelector('[data-role="size"]');

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const maxWidth = 480;
    const scale = Math.min(1, maxWidth / img.naturalWidth);
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let originalKb = null;
    canvas.toBlob((blob) => { originalKb = blob ? blob.size / 1024 : null; update(); }, 'image/png');

    function update() {
      const quality = Number(sliderEl.value);
      valueEl.textContent = quality + '%';
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          previewEl.src = url;
          const kb = blob.size / 1024;
          sizeEl.innerHTML = `
            <span data-lang="de"><strong>${kb.toFixed(0)} KB</strong> als JPEG bei ${quality}% Qualität${originalKb ? ` (unkomprimiertes PNG: ${originalKb.toFixed(0)} KB)` : ''}.</span>
            <span data-lang="fr"><strong>${kb.toFixed(0)} Ko</strong> en JPEG à ${quality}% de qualité${originalKb ? ` (PNG non compressé : ${originalKb.toFixed(0)} Ko)` : ''}.</span>
          `;
        },
        'image/jpeg',
        quality / 100
      );
    }
    sliderEl.addEventListener('input', update);
    update();
  };
  img.src = image;
}
