// Content-as-data: parses lesson Markdown (YAML-ish frontmatter + custom
// bilingual directives) into a small AST, then renders that AST to HTML
// (both languages side by side, switched at runtime via CSS) or to plain
// text (for the search index).
//
// Directive syntax (documented in README.md):
//   :::de ... :::            language block (also: :::fr)
//   :::konzept attr="v" ...  concept box (title/metaphor attrs + :::de/:::fr body)
//   :::merksatz ... :::      key-takeaway box (wraps :::de/:::fr)
//   :::ressourcen ... :::    resource list (wraps :::de/:::fr)
//   :::widget slug:::        single-line widget mount point
//   :::video attr="v":::     single-line video facade (future use)

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
          stack[stack.length - 1].children.push({ type: 'widget', slug: rest });
        } else if (name === 'video') {
          stack[stack.length - 1].children.push({ type: 'video', attrs: parseAttrs(rest) });
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
export function mdLite(raw, headings) {
  const blocks = raw.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks
    .map((block) => {
      const lines = block.split('\n');
      const headingMatch = lines[0].match(/^(#{2,4})\s+(.*)$/);
      if (headingMatch && lines.length === 1) {
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const id = slugify(text);
        if (headings) headings.push({ level, text, id });
        return `<h${level} id="${id}">${inline(text)}</h${level}>`;
      }
      if (lines.every((l) => /^\s*-\s+/.test(l))) {
        const items = lines.map((l) => `<li>${inline(l.replace(/^\s*-\s+/, ''))}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
        const items = lines.map((l) => `<li>${inline(l.replace(/^\s*\d+\.\s+/, ''))}</li>`).join('');
        return `<ol>${items}</ol>`;
      }
      if (lines[0].startsWith('>')) {
        const text = lines.map((l) => l.replace(/^>\s?/, '')).join(' ');
        return `<blockquote><p>${inline(text)}</p></blockquote>`;
      }
      return `<p>${inline(lines.join(' '))}</p>`;
    })
    .join('\n');
}

function inline(text) {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
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
export function renderBody(node, headings) {
  switch (node.type) {
    case 'root':
      return node.children.map((c) => renderBody(c, headings)).join('\n');
    case 'text':
      return mdLite(node.raw, headings);
    case 'lang':
      return `<div data-lang="${node.lang}">${node.children.map((c) => renderBody(c, headings)).join('\n')}</div>`;
    case 'konzept': {
      const titleDe = node.attrs?.titel_de || '';
      const titleFr = node.attrs?.titel_fr || '';
      return `<aside class="konzept-box" aria-label="Konzept">
  <p class="konzept-box__label" data-lang="de">Konzept</p>
  <p class="konzept-box__label" data-lang="fr">Concept</p>
  ${titleDe ? `<h3 class="konzept-box__title" data-lang="de">${titleDe}</h3>` : ''}
  ${titleFr ? `<h3 class="konzept-box__title" data-lang="fr">${titleFr}</h3>` : ''}
  <div class="konzept-box__body">${node.children.map((c) => renderBody(c, headings)).join('\n')}</div>
</aside>`;
    }
    case 'merksatz':
      return `<aside class="merksatz-box" role="note">
  <p class="merksatz-box__label" data-lang="de">Merksatz</p>
  <p class="merksatz-box__label" data-lang="fr">À retenir</p>
  <div class="merksatz-box__body">${node.children.map((c) => renderBody(c, headings)).join('\n')}</div>
</aside>`;
    case 'ressourcen':
      return `<section class="ressourcen-box">
  <p class="ressourcen-box__label" data-lang="de">Ressourcen</p>
  <p class="ressourcen-box__label" data-lang="fr">Ressources</p>
  <div class="ressourcen-box__body">${node.children.map((c) => renderBody(c, headings)).join('\n')}</div>
</section>`;
    case 'widget':
      return `<div class="widget-shell" data-widget="${node.slug}">
  <div class="widget-shell__mount" id="widget-${node.slug}" data-widget-mount="${node.slug}"></div>
  <noscript><p data-lang="de">Dieses interaktive Element benötigt JavaScript.</p><p data-lang="fr">Cet élément interactif nécessite JavaScript.</p></noscript>
</div>`;
    case 'video':
      return `<div class="video-facade" data-video-id="${node.attrs?.youtube || ''}"></div>`;
    default:
      return '';
  }
}

// Plain-text extraction per language, for the search index.
export function extractText(node, lang) {
  switch (node.type) {
    case 'root':
      return node.children.map((c) => extractText(c, lang)).join(' ');
    case 'text':
      return node.raw.replace(/[#>*`_-]/g, ' ').replace(/\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
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
