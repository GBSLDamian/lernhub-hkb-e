// Content-as-data: parses lesson Markdown (YAML-ish frontmatter + custom
// bilingual directives) into a small AST, then renders that AST to HTML
// (both languages side by side, switched at runtime via CSS) or to plain
// text (for the search index).
//
// Directive syntax (documented in README.md):
//   :::de ... :::                    language block (also: :::fr)
//   :::h2 de="…" fr="…":::           bilingual heading (also: :::h3)
//   :::konzept attr="v" ...          concept box (title/metaphor attrs + :::de/:::fr body)
//   :::merksatz ... :::              key-takeaway box (wraps :::de/:::fr)
//   :::ressourcen ... :::            resource list (wraps :::de/:::fr)
//   :::widget slug:::                widget mount point, no config
//   :::widget slug \n {json} \n :::  widget mount point with JSON config
//   :::video attr="v":::             single-line video facade
//   {{glossar:id}} / {{glossar:id|Anzeigetext}}   inline glossary term (in prose)

export function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const [, yamlBlock, body] = match;
  const data = {};
  const lines = yamlBlock.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    const [, key, rest] = m;
    if (rest === '') {
      const items = [];
      while (i + 1 < lines.length && /^\s*-\s+/.test(lines[i + 1])) {
        i++;
        items.push(lines[i].replace(/^\s*-\s+/, '').trim());
      }
      data[key] = items;
    } else if (rest.startsWith('[') && rest.endsWith(']')) {
      data[key] = rest
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      const unquoted = rest.replace(/^["']|["']$/g, '');
      data[key] = /^\d+$/.test(unquoted) ? Number(unquoted) : unquoted;
    }
  }
  return { data, body: body || '' };
}

function parseAttrs(str) {
  const attrs = {};
  const re = /(\w+)="([^"]*)"/g;
  let m;
  while ((m = re.exec(str))) attrs[m[1]] = m[2];
  return attrs;
}

export function parseBody(markdown) {
  const lines = markdown.split('\n');
  const root = { type: 'root', children: [] };
  const stack = [root];
  let textBuffer = [];

  const flushText = () => {
    if (textBuffer.length) {
      stack[stack.length - 1].children.push({ type: 'text', raw: textBuffer.join('\n') });
      textBuffer = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === ':::') {
      flushText();
      const closed = stack.pop();
      if (stack.length) stack[stack.length - 1].children.push(closed);
      continue;
    }
    if (trimmed.startsWith(':::')) {
      const inner = trimmed.slice(3);
      if (inner.endsWith(':::') && inner.length > 3) {
        flushText();
        const content = inner.slice(0, -3).trim();
        const spaceIdx = content.indexOf(' ');
        const name = spaceIdx === -1 ? content : content.slice(0, spaceIdx);
        const rest = spaceIdx === -1 ? '' : content.slice(spaceIdx + 1).trim();
        if (name === 'widget') {
          stack[stack.length - 1].children.push({ type: 'widget', slug: rest, config: null });
        } else if (name === 'video') {
          stack[stack.length - 1].children.push({ type: 'video', attrs: parseAttrs(rest) });
        } else if (name === 'h2' || name === 'h3') {
          stack[stack.length - 1].children.push({ type: 'heading', level: Number(name[1]), attrs: parseAttrs(rest) });
        }
        continue;
      }
      flushText();
      const spaceIdx = inner.indexOf(' ');
      const name = spaceIdx === -1 ? inner : inner.slice(0, spaceIdx);
      const attrsStr = spaceIdx === -1 ? '' : inner.slice(spaceIdx + 1);
      const node = { type: name === 'de' || name === 'fr' ? 'lang' : name, children: [] };
      if (node.type === 'lang') node.lang = name;
      if (name === 'konzept') node.attrs = parseAttrs(attrsStr);
      if (name === 'widget') node.slug = attrsStr.trim();
      stack.push(node);
      continue;
    }
    textBuffer.push(line);
  }
  flushText();
  return root;
}

// --- minimal markdown -> HTML (headings, bold/italic/code, links, images,
// lists, blockquote, paragraphs) — intentionally small, covers the subset
// content authors actually use in HKB-E lessons.
export function mdLite(raw, ctx) {
  const blocks = raw.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks
    .map((block) => {
      const lines = block.split('\n');
      if (isTableBlock(lines)) {
        return renderTable(lines, ctx);
      }
      if (lines.every((l) => /^\s*-\s+/.test(l))) {
        const items = lines.map((l) => `<li>${inline(l.replace(/^\s*-\s+/, ''), ctx)}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
        const items = lines.map((l) => `<li>${inline(l.replace(/^\s*\d+\.\s+/, ''), ctx)}</li>`).join('');
        return `<ol>${items}</ol>`;
      }
      if (lines[0].startsWith('>')) {
        const text = lines.map((l) => l.replace(/^>\s?/, '')).join(' ');
        return `<blockquote><p>${inline(text, ctx)}</p></blockquote>`;
      }
      return `<p>${inline(lines.join(' '), ctx)}</p>`;
    })
    .join('\n');
}

function isTableBlock(lines) {
  if (lines.length < 2) return false;
  if (!/^\s*\|.*\|\s*$/.test(lines[0])) return false;
  return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(lines[1]);
}

function parseTableRow(line) {
  let trimmed = line.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
  return trimmed.split('|').map((c) => c.trim());
}

function renderTable(lines, ctx) {
  const header = parseTableRow(lines[0]);
  const rows = lines.slice(2).map(parseTableRow);
  const thead = `<tr>${header.map((h) => `<th>${inline(h, ctx)}</th>`).join('')}</tr>`;
  const tbody = rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c, ctx)}</td>`).join('')}</tr>`).join('');
  return `<div class="table-wrap"><table><thead>${thead}</thead><tbody>${tbody}</tbody></table></div>`;
}

let GLOSSARY = new Map();
export function setGlossary(entries) {
  GLOSSARY = new Map(entries.map((e) => [e.id, e]));
}

function inline(text, ctx) {
  const lang = ctx?.lang || 'de';
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\{\{glossar:([a-z0-9-]+)(?:\|([^}]+))?\}\}/g, (_m, id, label) => {
      const entry = GLOSSARY.get(id);
      if (!entry) return label || id;
      const text = label || (lang === 'fr' ? entry.begriff_fr : entry.begriff_de) || id;
      return `<button type="button" class="glossary-term" data-term="${id}">${text}</button>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Renders the whole body AST into an HTML string containing BOTH languages
// side by side (each wrapped in [data-lang]); CSS shows only the active one.
// `ctx` accumulates state across the walk: { headings: [], lang, widgetIndex }
export function renderBody(node, ctx = { headings: [], lang: null, widgetIndex: 0 }) {
  switch (node.type) {
    case 'root':
      return node.children.map((c) => renderBody(c, ctx)).join('\n');
    case 'text':
      return mdLite(node.raw, ctx);
    case 'heading': {
      const { level, attrs } = node;
      const id = slugify(attrs.de || attrs.fr || '');
      ctx.headings?.push({ level, text: attrs.de || '', textFr: attrs.fr || '', id });
      const de = attrs.de ? `<h${level} id="${id}" data-lang="de">${inline(attrs.de, { ...ctx, lang: 'de' })}</h${level}>` : '';
      const fr = attrs.fr ? `<h${level} id="${id}" data-lang="fr">${inline(attrs.fr, { ...ctx, lang: 'fr' })}</h${level}>` : '';
      return de + fr;
    }
    case 'lang':
      return `<div data-lang="${node.lang}">${node.children.map((c) => renderBody(c, { ...ctx, lang: node.lang })).join('\n')}</div>`;
    case 'konzept': {
      const titleDe = node.attrs?.titel_de || '';
      const titleFr = node.attrs?.titel_fr || '';
      return `<aside class="konzept-box" aria-label="Konzept">
  <p class="konzept-box__label" data-lang="de">Konzept</p>
  <p class="konzept-box__label" data-lang="fr">Concept</p>
  ${titleDe ? `<h3 class="konzept-box__title" data-lang="de">${titleDe}</h3>` : ''}
  ${titleFr ? `<h3 class="konzept-box__title" data-lang="fr">${titleFr}</h3>` : ''}
  <div class="konzept-box__body">${node.children.map((c) => renderBody(c, ctx)).join('\n')}</div>
</aside>`;
    }
    case 'merksatz':
      return `<aside class="merksatz-box" role="note">
  <p class="merksatz-box__label" data-lang="de">Merksatz</p>
  <p class="merksatz-box__label" data-lang="fr">À retenir</p>
  <div class="merksatz-box__body">${node.children.map((c) => renderBody(c, ctx)).join('\n')}</div>
</aside>`;
    case 'ressourcen':
      return `<section class="ressourcen-box">
  <p class="ressourcen-box__label" data-lang="de">Ressourcen</p>
  <p class="ressourcen-box__label" data-lang="fr">Ressources</p>
  <div class="ressourcen-box__body">${node.children.map((c) => renderBody(c, ctx)).join('\n')}</div>
</section>`;
    case 'widget': {
      let config = node.config;
      if (config === undefined || config === null) {
        if (node.children && node.children.length) {
          const raw = node.children.map((c) => c.raw || '').join('\n').trim();
          if (raw) {
            try {
              config = JSON.parse(raw);
            } catch (e) {
              throw new Error(`Widget "${node.slug}": ungültiges JSON in Konfiguration – ${e.message}`);
            }
          }
        }
      }
      const idx = ctx.widgetIndex = (ctx.widgetIndex ?? 0) + 1;
      const configAttr = config ? ` data-widget-config="${escapeAttr(JSON.stringify(config))}"` : '';
      return `<div class="widget-shell" data-widget="${node.slug}">
  <div class="widget-shell__mount" id="widget-${node.slug}-${idx}" data-widget-mount="${node.slug}"${configAttr}></div>
  <noscript><p data-lang="de">Dieses interaktive Element benötigt JavaScript.</p><p data-lang="fr">Cet élément interactif nécessite JavaScript.</p></noscript>
</div>`;
    }
    case 'video':
      return `<div class="video-facade" data-video-id="${node.attrs?.youtube || ''}"></div>`;
    default:
      return '';
  }
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

// Plain-text extraction per language, for the search index.
export function extractText(node, lang) {
  switch (node.type) {
    case 'root':
      return node.children.map((c) => extractText(c, lang)).join(' ');
    case 'text':
      return node.raw
        .replace(/\{\{glossar:[a-z0-9-]+(?:\|([^}]+))?\}\}/g, '$1')
        .replace(/[#>*`_-]/g, ' ')
        .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    case 'heading':
      return lang === 'fr' ? node.attrs.fr || '' : node.attrs.de || '';
    case 'lang':
      return node.lang === lang ? node.children.map((c) => extractText(c, lang)).join(' ') : '';
    case 'konzept':
    case 'merksatz':
    case 'ressourcen':
      return node.children.map((c) => extractText(c, lang)).join(' ');
    default:
      return '';
  }
}

export function collectWidgets(node, out = new Set()) {
  if (node.type === 'widget') out.add(node.slug);
  if (node.children) node.children.forEach((c) => collectWidgets(c, out));
  return out;
}
