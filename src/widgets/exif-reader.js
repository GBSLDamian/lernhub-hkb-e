// EXIF-Reader: liest die Metadaten einer selbst gewählten Bilddatei komplett
// clientseitig aus (FileReader → ArrayBuffer → eigener JPEG/TIFF-Parser).
// Nichts wird hochgeladen oder gespeichert — reine In-Memory-Verarbeitung im
// Browser, funktioniert offline. Kein npm-Paket, kein Laufzeit-CDN: der
// EXIF/GPS-Parser ist bewusst selbst geschrieben (gleiche Philosophie wie
// der PNG-Icon-Encoder des Projekts).

// ---------- Minimaler JPEG/TIFF-EXIF-Parser ----------
function typeSize(type) {
  return { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8, 11: 4, 12: 8 }[type] || 1;
}

function parseTiff(view, tiffStart) {
  const byteOrderMark = view.getUint16(tiffStart);
  const little = byteOrderMark === 0x4949;
  const u16 = (o) => view.getUint16(o, little);
  const u32 = (o) => view.getUint32(o, little);
  const i32 = (o) => view.getInt32(o, little);

  if (u16(tiffStart + 2) !== 42) return null;
  const ifd0Offset = u32(tiffStart + 4);

  function readValue(type, count, valueFieldOffset) {
    const byteLength = typeSize(type) * count;
    const dataOffset = byteLength <= 4 ? valueFieldOffset : tiffStart + u32(valueFieldOffset);
    if (type === 2) {
      let str = '';
      for (let i = 0; i < count - 1; i++) {
        const c = view.getUint8(dataOffset + i);
        if (c === 0) break;
        str += String.fromCharCode(c);
      }
      return str.trim();
    }
    if (type === 3) {
      const arr = Array.from({ length: count }, (_, i) => u16(dataOffset + i * 2));
      return count === 1 ? arr[0] : arr;
    }
    if (type === 4) {
      const arr = Array.from({ length: count }, (_, i) => u32(dataOffset + i * 4));
      return count === 1 ? arr[0] : arr;
    }
    if (type === 5) {
      const arr = Array.from({ length: count }, (_, i) => {
        const num = u32(dataOffset + i * 8);
        const den = u32(dataOffset + i * 8 + 4);
        return den === 0 ? 0 : num / den;
      });
      return count === 1 ? arr[0] : arr;
    }
    if (type === 10) {
      const arr = Array.from({ length: count }, (_, i) => {
        const num = i32(dataOffset + i * 8);
        const den = i32(dataOffset + i * 8 + 4);
        return den === 0 ? 0 : num / den;
      });
      return count === 1 ? arr[0] : arr;
    }
    if (type === 9) {
      const arr = Array.from({ length: count }, (_, i) => i32(dataOffset + i * 4));
      return count === 1 ? arr[0] : arr;
    }
    // BYTE / UNDEFINED / others: read raw bytes
    const arr = Array.from({ length: count }, (_, i) => view.getUint8(dataOffset + i));
    return count === 1 ? arr[0] : arr;
  }

  function readIfd(ifdOffset) {
    const entries = {};
    if (ifdOffset <= 0 || tiffStart + ifdOffset + 2 > view.byteLength) return entries;
    const count = u16(tiffStart + ifdOffset);
    for (let i = 0; i < count; i++) {
      const entryOffset = tiffStart + ifdOffset + 2 + i * 12;
      if (entryOffset + 12 > view.byteLength) break;
      const tag = u16(entryOffset);
      const type = u16(entryOffset + 2);
      const numValues = u32(entryOffset + 4);
      try {
        entries[tag] = readValue(type, numValues, entryOffset + 8);
      } catch {
        // malformed entry — skip it, keep the rest of the IFD usable
      }
    }
    return entries;
  }

  const ifd0 = readIfd(ifd0Offset);
  const result = { ifd0 };
  if (ifd0[0x8769]) result.exif = readIfd(ifd0[0x8769]);
  if (ifd0[0x8825]) result.gps = readIfd(ifd0[0x8825]);
  return result;
}

function readExif(buffer) {
  const view = new DataView(buffer);
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return null;
  let offset = 2;
  while (offset + 4 <= view.byteLength) {
    const marker = view.getUint16(offset);
    if ((marker & 0xff00) !== 0xff00) break;
    if (marker === 0xffd8 || (marker >= 0xffd0 && marker <= 0xffd9) || marker === 0xff01) {
      offset += 2;
      continue;
    }
    if (marker === 0xffda) break; // start of scan — no more marker segments follow
    const size = view.getUint16(offset + 2);
    if (
      marker === 0xffe1 &&
      offset + 10 <= view.byteLength &&
      view.getUint8(offset + 4) === 0x45 &&
      view.getUint8(offset + 5) === 0x78 &&
      view.getUint8(offset + 6) === 0x69 &&
      view.getUint8(offset + 7) === 0x66 &&
      view.getUint16(offset + 8) === 0
    ) {
      return parseTiff(view, offset + 10);
    }
    offset += 2 + size;
  }
  return null;
}

function gpsToDecimal(dms, ref) {
  if (!Array.isArray(dms) || dms.length < 3) return null;
  const [deg, min, sec] = dms;
  let value = deg + min / 60 + sec / 3600;
  if (ref === 'S' || ref === 'W') value = -value;
  return value;
}

// ---------- Anzeige ----------
function row(labelDe, labelFr, value) {
  return `<div class="datenspur-demo__row">
    <span class="datenspur-demo__label"><span data-lang="de">${labelDe}</span><span data-lang="fr">${labelFr}</span></span>
    <span class="datenspur-demo__value">${value}</span>
  </div>`;
}

const FLASH_MODES = {
  de: { fired: 'Ausgelöst', notFired: 'Nicht ausgelöst' },
  fr: { fired: "S'est déclenché", notFired: "Ne s'est pas déclenché" },
};

function renderResult(resultEl, exif, fileName) {
  if (!exif || (!Object.keys(exif.ifd0 || {}).length && !exif.exif && !exif.gps)) {
    resultEl.innerHTML = `
      <div class="exercise-feedback is-visible is-neutral">
        <span data-lang="de"><strong>Keine Metadaten gefunden.</strong> Bei Web-/Messenger-Bildern werden EXIF-Daten oft automatisch entfernt (z. B. von WhatsApp, Instagram) — ein bewusster Datenschutz-Nebeneffekt, den viele Plattformen inzwischen einbauen.</span>
        <span data-lang="fr"><strong>Aucune métadonnée trouvée.</strong> Pour les images du web/de messageries, les données EXIF sont souvent supprimées automatiquement (p. ex. par WhatsApp, Instagram) — un effet secondaire de protection des données que de nombreuses plateformes intègrent désormais.</span>
      </div>`;
    return;
  }

  const { ifd0 = {}, exif: sub = {}, gps } = exif;
  const rows = [];

  const make = ifd0[0x010f];
  const model = ifd0[0x0110];
  if (make || model) rows.push(row('Kamera', 'Appareil', [make, model].filter(Boolean).join(' ')));
  if (ifd0[0x0131]) rows.push(row('Software', 'Logiciel', ifd0[0x0131]));

  const dateTime = sub[0x9003] || ifd0[0x0132];
  if (dateTime) rows.push(row('Aufnahmedatum/-zeit', 'Date/heure de prise de vue', dateTime));

  const width = sub[0xa002];
  const height = sub[0xa003];
  if (width && height) rows.push(row('Abmessung', 'Dimensions', `${width}×${height}px`));

  const orientationMap = { 1: 'Normal', 3: '180°', 6: '90° CW', 8: '90° CCW' };
  if (ifd0[0x0112]) rows.push(row('Orientierung', 'Orientation', orientationMap[ifd0[0x0112]] || String(ifd0[0x0112])));

  if (sub[0x829d]) rows.push(row('Blende', 'Ouverture', `f/${sub[0x829d].toFixed(1)}`));
  if (sub[0x829a]) {
    const t = sub[0x829a];
    rows.push(row('Belichtungszeit', "Temps d'exposition", t < 1 ? `1/${Math.round(1 / t)} s` : `${t} s`));
  }
  if (sub[0x8827]) rows.push(row('ISO', 'ISO', Array.isArray(sub[0x8827]) ? sub[0x8827].join(', ') : sub[0x8827]));
  if (sub[0x920a]) rows.push(row('Brennweite', 'Focale', `${sub[0x920a]} mm`));
  if (typeof sub[0x9209] === 'number') {
    const fired = (sub[0x9209] & 1) === 1;
    rows.push(
      row(
        'Blitz',
        'Flash',
        `<span data-lang="de">${FLASH_MODES.de[fired ? 'fired' : 'notFired']}</span><span data-lang="fr">${FLASH_MODES.fr[fired ? 'fired' : 'notFired']}</span>`
      )
    );
  }
  if (typeof sub[0xa403] === 'number') {
    const auto = sub[0xa403] === 0;
    rows.push(
      row(
        'Weissabgleich',
        'Balance des blancs',
        `<span data-lang="de">${auto ? 'Automatisch' : 'Manuell'}</span><span data-lang="fr">${auto ? 'Automatique' : 'Manuelle'}</span>`
      )
    );
  }

  let gpsHtml = '';
  if (gps && gps[0x0002] && gps[0x0004]) {
    const lat = gpsToDecimal(gps[0x0002], gps[0x0001]);
    const lon = gpsToDecimal(gps[0x0004], gps[0x0003]);
    if (lat !== null && lon !== null) {
      gpsHtml = `
        <div class="exif-reader__gps">
          <p class="exif-reader__gps-title">
            <span data-lang="de">📍 Geodaten gefunden</span><span data-lang="fr">📍 Données de géolocalisation trouvées</span>
          </p>
          <p class="exif-reader__gps-coords">${lat.toFixed(5)}, ${lon.toFixed(5)}</p>
          <p class="text-muted">
            <span data-lang="de">Diese Koordinaten verraten, wo genau das Foto aufgenommen wurde. Offline zeigen wir hier bewusst nur die Zahlen, keine Karte (kein externer Kartendienst nötig) — trotzdem reichen sie, um den Ort exakt zu bestimmen. Genau deshalb ist Vorsicht beim Teilen eigener Fotos wichtig (siehe auch Datenspur-Demo und Recht, Ethik & Sicherheit → Datenschutz & Lizenzen).</span>
            <span data-lang="fr">Ces coordonnées révèlent exactement où la photo a été prise. Hors ligne, nous affichons volontairement seulement les chiffres, sans carte (aucun service cartographique externe nécessaire) — cela suffit pourtant à localiser l'endroit avec précision. C'est justement pour cela qu'il faut être prudent·e en partageant ses propres photos (voir aussi la démo Datenspur et Droit, éthique & sécurité → Protection des données & licences).</span>
          </p>
        </div>`;
    }
  }

  resultEl.innerHTML = `
    <p class="text-muted exif-reader__filename"><span data-lang="de">Datei: </span><span data-lang="fr">Fichier : </span>${fileName}</p>
    ${rows.length ? `<div class="datenspur-demo__rows">${rows.join('')}</div>` : ''}
    ${gpsHtml}
    ${!rows.length && !gpsHtml
      ? `<div class="exercise-feedback is-visible is-neutral">
          <span data-lang="de">Die Datei enthält einen EXIF-Block, aber keine der hier ausgewerteten Angaben.</span>
          <span data-lang="fr">Le fichier contient un bloc EXIF, mais aucune des informations analysées ici.</span>
        </div>`
      : ''}
  `;
}

export function mount(container) {
  if (!container) return;
  container.className = 'exif-reader';
  container.innerHTML = `
    <p class="datenspur-demo__privacy-note">
      <span data-lang="de">🔒 Das Bild bleibt auf deinem Gerät — es wird nichts hochgeladen oder gespeichert.</span>
      <span data-lang="fr">🔒 L'image reste sur ton appareil — rien n'est envoyé ni enregistré.</span>
    </p>
    <label class="exif-reader__dropzone" tabindex="0">
      <input type="file" accept="image/jpeg,image/jpg,image/*" class="exif-reader__input">
      <span data-lang="de">📁 Bild hierher ziehen oder klicken zum Auswählen</span>
      <span data-lang="fr">📁 Glisser une image ici ou cliquer pour en choisir une</span>
    </label>
    <div class="exif-reader__preview" data-role="preview" hidden>
      <img data-role="preview-img" alt="">
    </div>
    <div class="exif-reader__result" data-role="result"></div>
  `;

  const dropzone = container.querySelector('.exif-reader__dropzone');
  const input = container.querySelector('.exif-reader__input');
  const previewWrap = container.querySelector('[data-role="preview"]');
  const previewImg = container.querySelector('[data-role="preview-img"]');
  const resultEl = container.querySelector('[data-role="result"]');

  function handleFile(file) {
    if (!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewWrap.hidden = false;
    resultEl.innerHTML = `<p class="text-muted"><span data-lang="de">Lese Metadaten …</span><span data-lang="fr">Lecture des métadonnées …</span></p>`;
    const reader = new FileReader();
    reader.onload = () => {
      let exif = null;
      try {
        exif = readExif(reader.result);
      } catch {
        exif = null;
      }
      renderResult(resultEl, exif, file.name);
    };
    reader.onerror = () => {
      resultEl.innerHTML = `<div class="exercise-feedback is-visible is-incorrect"><span data-lang="de">Die Datei konnte nicht gelesen werden.</span><span data-lang="fr">Le fichier n'a pas pu être lu.</span></div>`;
    };
    reader.readAsArrayBuffer(file);
  }

  input.addEventListener('change', () => handleFile(input.files?.[0]));
  dropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      input.click();
    }
  });
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('is-dragover');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('is-dragover');
    handleFile(e.dataTransfer?.files?.[0]);
  });
}
