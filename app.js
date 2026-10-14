'use strict';
const navigation = document.querySelector('#navigation');
const menuToggle = document.querySelector('.menu-toggle');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});
const shieldToggle = document.querySelector('#shield-toggle');
shieldToggle.addEventListener('click', () => {
  const enabled = shieldToggle.getAttribute('aria-checked') !== 'true';
  shieldToggle.setAttribute('aria-checked', String(enabled));
  document.querySelector('#shield-state').textContent = enabled
    ? 'Védelem bekapcsolva'
    : 'Védelem kikapcsolva';
  document.querySelector('#demo-page').classList.toggle('protected', enabled);
  document.querySelector('#demo-message').textContent = enabled
    ? 'A szemléltetett reklám és követő rejtve.'
    : 'A szemléltetett reklám és követő látható.';
});
const worlds = {
  forest: { image: 'misty-forest.webp', label: 'Ködös erdő · CC0 fotó' },
  canyon: { image: 'azure-canyon.webp', label: 'Azúr szurdok · CC0 illusztráció' },
  peaks: { image: 'silver-peaks.webp', label: 'Ezüst hegyvidék · CC0 illusztráció' },
  city: { image: 'manga-city.webp', label: 'Manga város · CC0 illusztráció' },
};
document.querySelectorAll('[data-world]').forEach((button) =>
  button.addEventListener('click', () => {
    const world = worlds[button.dataset.world];
    document
      .querySelector('#world-preview')
      .style.setProperty('--world-image', `url("assets/${world.image}")`);
    document.querySelector('#world-caption').textContent = world.label;
    document.querySelectorAll('[data-world]').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
  }),
);
const privacyDialog = document.querySelector('#privacy-dialog');
const documentDialog = document.querySelector('#document-dialog');
const dialogOpeners = new WeakMap();
function openDialog(dialog, opener) {
  if (dialog.open) return;
  dialogOpeners.set(dialog, opener || document.activeElement);
  dialog.showModal();
}
function setupDialog(dialog, closeButton) {
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  });
  dialog.addEventListener('close', () => {
    const opener = dialogOpeners.get(dialog);
    const activeDialog = document.querySelector('dialog[open]');
    if (opener?.isConnected && (!activeDialog || activeDialog.contains(opener)))
      opener.focus({ preventScroll: true });
  });
}
setupDialog(privacyDialog, document.querySelector('#privacy-close'));
setupDialog(documentDialog, document.querySelector('#document-close'));
document
  .querySelector('#privacy-open')
  .addEventListener('click', (event) => openDialog(privacyDialog, event.currentTarget));

const documentRoot = new URL('docs/', document.baseURI);
const documentCache = new Map();
const documentContent = document.querySelector('#document-content');
const documentTitle = document.querySelector('#document-dialog-title');
const documentLoading = document.querySelector('#document-loading');
const documentError = document.querySelector('#document-error');
const documentTitles = {
  LICENSE: 'A Tracer licence',
  'THIRD_PARTY_NOTICES.md': 'Források és licencek',
  'LICENSES.md': 'Háttérképek: források és licencek',
  'CHROME_COMPATIBILITY.md': 'Bővítmények kompatibilitása',
  'sources.json': 'Forrásjegyzék',
  'catalog.json': 'Háttérképek katalógusa',
};
let currentDocumentUrl;
let documentRequest;
let documentLoadId = 0;

function localDocumentUrl(value, base = document.baseURI) {
  try {
    const url = new URL(value, base);
    if (
      url.origin === documentRoot.origin &&
      url.pathname.startsWith(documentRoot.pathname) &&
      !url.search &&
      !url.username &&
      !url.password &&
      /(?:\.(?:md|json|txt)|\/LICENSE)$/i.test(url.pathname)
    )
      return url;
  } catch {}
  return null;
}

function appendInline(parent, value, baseUrl) {
  // Build DOM nodes instead of interpreting documentation as HTML.
  const pattern = /`([^`]+)`|\[([^\]]+)\]\(([^\s)]+)\)|\*\*([^*]+)\*\*/g;
  let cursor = 0;
  for (const match of value.matchAll(pattern)) {
    parent.append(document.createTextNode(value.slice(cursor, match.index)));
    if (match[1] !== undefined) {
      const code = document.createElement('code');
      code.textContent = match[1];
      parent.append(code);
    } else if (match[2] !== undefined) {
      let target;
      try {
        target = new URL(match[3], baseUrl);
      } catch {}
      const local = target && localDocumentUrl(target.href);
      if (
        local ||
        (target && /^https?:$/.test(target.protocol) && target.origin !== documentRoot.origin)
      ) {
        const link = document.createElement('a');
        link.textContent = match[2];
        link.href = target.href;
        if (local) {
          link.dataset.document = local.href;
          link.setAttribute('aria-haspopup', 'dialog');
          link.setAttribute('aria-controls', 'document-dialog');
        } else {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        parent.append(link);
      } else parent.append(document.createTextNode(match[2]));
    } else {
      const strong = document.createElement('strong');
      strong.textContent = match[4];
      parent.append(strong);
    }
    cursor = match.index + match[0].length;
  }
  parent.append(document.createTextNode(value.slice(cursor)));
}

function headingAnchor(value) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}
function tableCells(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}
function isTableDivider(line) {
  const cells = tableCells(line);
  return line.includes('|') && cells.length > 1 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

const propertyLabels = {
  verifiedAt: 'Ellenőrzés dátuma',
  images: 'Képek',
  wallpapers: 'Háttérképek',
  lists: 'Szűrőlisták',
  id: 'Azonosító',
  name: 'Név',
  author: 'Alkotó',
  sourceURL: 'Eredeti forrás',
  url: 'Forrás',
  downloadURL: 'Letöltési forrás',
  licenseURL: 'Licenc szövege',
  license: 'Licenc',
  sourceFile: 'Eredeti fájl',
  sourceSize: 'Eredeti felbontás',
  sourceSHA256: 'Eredeti SHA-256',
  file: 'Fájl',
  thumbnail: 'Előnézet',
  sha256: 'SHA-256',
  width: 'Szélesség',
  height: 'Magasság',
  category: 'Kategória',
  archiveFile: 'Archívum',
  archiveMember: 'Fájl az archívumban',
  archiveSHA256: 'Archívum SHA-256',
  version: 'Verzió',
  commit: 'Forrásverzió',
  retrieved: 'Letöltés dátuma',
  bytes: 'Méret bájtban',
  attribution: 'Forrásmegjelölés',
  modified: 'Módosítva',
};
function appendProperties(parent, value, label = 'Forrás') {
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === 'number')) {
      parent.textContent = value.join(' × ');
      return;
    }
    const list = document.createElement('ul');
    list.className = 'document-records';
    value.forEach((item) => {
      const entry = document.createElement('li');
      if (item?.name) {
        const heading = document.createElement('h3');
        heading.className = 'document-record-title';
        heading.textContent = item.name;
        entry.append(heading);
      }
      appendProperties(entry, item, label);
      list.append(entry);
    });
    parent.append(list);
  } else if (value && typeof value === 'object') {
    const properties = document.createElement('dl');
    properties.className = 'document-properties';
    for (const [key, item] of Object.entries(value)) {
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = propertyLabels[key] || key;
      appendProperties(description, item, term.textContent);
      properties.append(term, description);
    }
    parent.append(properties);
  } else if (typeof value === 'string' && /^https?:\/\//i.test(value)) {
    const link = document.createElement('a');
    link.textContent = `${label} ↗`;
    link.href = value;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    parent.append(link);
  } else
    parent.append(
      document.createTextNode(
        typeof value === 'boolean' ? (value ? 'Igen' : 'Nem') : String(value ?? '–'),
      ),
    );
}

function renderDocument(value, url) {
  const fragment = document.createDocumentFragment();
  if (!/\.md$/i.test(url.pathname)) {
    if (/\.json$/i.test(url.pathname)) {
      appendProperties(fragment, JSON.parse(value));
      return fragment;
    }
    const pre = document.createElement('pre');
    pre.className = 'document-license';
    pre.textContent = value;
    fragment.append(pre);
    return fragment;
  }
  const lines = value.replace(/\r\n?/g, '\n').split('\n');
  const anchors = new Map();
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index++;
      continue;
    }
    if (/^```/.test(line)) {
      const codeLines = [];
      index++;
      while (index < lines.length && !/^```/.test(lines[index])) codeLines.push(lines[index++]);
      index++;
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = codeLines.join('\n');
      pre.append(code);
      fragment.append(pre);
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const node = document.createElement(`h${Math.min(6, heading[1].length + 1)}`);
      appendInline(node, heading[2], url);
      const slug = headingAnchor(node.textContent);
      const count = anchors.get(slug) || 0;
      anchors.set(slug, count + 1);
      node.id = `document-heading-${slug}${count ? `-${count}` : ''}`;
      fragment.append(node);
      index++;
      continue;
    }
    if (index + 1 < lines.length && isTableDivider(lines[index + 1])) {
      const wrap = document.createElement('div');
      wrap.className = 'document-table-wrap';
      wrap.tabIndex = 0;
      wrap.setAttribute('role', 'region');
      wrap.setAttribute('aria-label', 'Dokumentum táblázata');
      const table = document.createElement('table');
      const head = document.createElement('thead');
      const row = document.createElement('tr');
      for (const cell of tableCells(line)) {
        const th = document.createElement('th');
        th.scope = 'col';
        appendInline(th, cell, url);
        row.append(th);
      }
      head.append(row);
      table.append(head);
      index += 2;
      const body = document.createElement('tbody');
      while (index < lines.length && lines[index].trim() && lines[index].includes('|')) {
        const row = document.createElement('tr');
        for (const cell of tableCells(lines[index++])) {
          const td = document.createElement('td');
          appendInline(td, cell, url);
          row.append(td);
        }
        body.append(row);
      }
      table.append(body);
      wrap.append(table);
      fragment.append(wrap);
      continue;
    }
    const listItem = line.match(/^\s*(?:[-*]|\d+\.)\s+(.+)$/);
    if (listItem) {
      const ordered = /^\s*\d+\./.test(line);
      const list = document.createElement(ordered ? 'ol' : 'ul');
      const itemPattern = ordered ? /^\s*\d+\.\s+(.+)$/ : /^\s*[-*]\s+(.+)$/;
      while (index < lines.length) {
        const item = lines[index].match(itemPattern);
        if (!item) break;
        index++;
        const continuation = [item[1]];
        while (
          index < lines.length &&
          /^\s{2,}\S/.test(lines[index]) &&
          !/^\s*[-*]\s/.test(lines[index])
        )
          continuation.push(lines[index++].trim());
        const li = document.createElement('li');
        appendInline(li, continuation.join(' '), url);
        list.append(li);
      }
      fragment.append(list);
      continue;
    }
    const paragraph = [line.trim()];
    index++;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(?:#{1,6}\s|```|\s*[-*]\s|\s*\d+\.\s)/.test(lines[index]) &&
      !(index + 1 < lines.length && isTableDivider(lines[index + 1]))
    )
      paragraph.push(lines[index++].trim());
    const p = document.createElement('p');
    appendInline(p, paragraph.join(' '), url);
    fragment.append(p);
  }
  return fragment;
}

async function openDocument(url, opener) {
  currentDocumentUrl = url;
  const loadId = ++documentLoadId;
  documentRequest?.abort();
  const request = new AbortController();
  documentRequest = request;
  const filename = decodeURIComponent(url.pathname.split('/').pop());
  documentTitle.textContent = documentTitles[filename] || filename;
  documentContent.replaceChildren();
  documentContent.setAttribute('aria-busy', 'true');
  documentLoading.hidden = false;
  documentError.hidden = true;
  openDialog(documentDialog, opener);
  document.querySelector('#document-close').focus({ preventScroll: true });
  documentDialog.scrollTop = 0;
  try {
    const fetchUrl = new URL(url);
    fetchUrl.hash = '';
    let value = documentCache.get(fetchUrl.href);
    if (value === undefined) {
      const response = await fetch(fetchUrl, {
        credentials: 'same-origin',
        signal: request.signal,
      });
      if (!response.ok) throw new Error('Document unavailable');
      value = await response.text();
      documentCache.set(fetchUrl.href, value);
    }
    if (loadId !== documentLoadId || !documentDialog.open) return;
    documentContent.replaceChildren(renderDocument(value, url));
    if (!documentTitles[filename]) {
      const heading = documentContent.querySelector('h2');
      if (heading) documentTitle.textContent = heading.textContent;
    }
    if (url.hash) {
      const anchor = document.getElementById(
        `document-heading-${decodeURIComponent(url.hash.slice(1))}`,
      );
      anchor?.scrollIntoView({ block: 'start' });
    }
  } catch (error) {
    if (loadId === documentLoadId && documentDialog.open && error.name !== 'AbortError')
      documentError.hidden = false;
  } finally {
    if (loadId === documentLoadId) {
      documentLoading.hidden = true;
      documentContent.removeAttribute('aria-busy');
    }
  }
}
documentDialog.addEventListener('close', () => {
  documentLoadId++;
  documentRequest?.abort();
});
document.querySelector('#document-retry').addEventListener('click', () => {
  if (currentDocumentUrl) openDocument(currentDocumentUrl);
});
document.addEventListener('click', (event) => {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
    return;
  const link = event.target.closest('[data-document], a[href]');
  if (!link || link.hasAttribute('download')) return;
  const url = localDocumentUrl(link.dataset.document || link.getAttribute('href'));
  if (!url) return;
  event.preventDefault();
  openDocument(url, link);
});

async function loadReleases() {
  const response = await fetch('./releases.json', {
    cache: 'no-store',
    credentials: 'same-origin',
  });
  if (!response.ok) throw new Error('Release manifest unavailable');
  const releases = await response.json();
  if (!TracerRelease.validManifest(releases)) throw new Error('Invalid release manifest');
  document.querySelectorAll('[data-version]').forEach((item) => {
    item.textContent = releases.version;
  });
  let availableCount = 0;
  for (const platform of ['windows', 'android', 'ios']) {
    const card = document.querySelector(`[data-platform="${platform}"]`);
    const release = releases.platforms[platform];
    const available = TracerRelease.download(releases, platform);
    const badge = card.querySelector('[data-status]');
    const link = card.querySelector('[data-download]');
    if (available) {
      availableCount++;
      badge.textContent = platform === 'android' ? 'Android előzetes' : 'Letölthető';
      card.querySelector('[data-meta]').textContent =
        `v${available.version} · ${(available.sizeBytes / 1048576).toLocaleString('hu-HU', { maximumFractionDigits: 1 })} MB · ${platform === 'windows' ? 'Windows x64' : 'Android 9+'}`;
      link.href = available.url;
      if (available.external) link.removeAttribute('download');
      else link.setAttribute('download', available.filename);
      link.removeAttribute('aria-disabled');
      link.querySelector('span').textContent =
        platform === 'windows' ? 'Letöltés Windowsra' : 'Android APK letöltése';
      const checksumLink = card.querySelector('[data-checksum]');
      checksumLink.href = available.checksumUrl;
      checksumLink.hidden = false;
      if (available.external) checksumLink.removeAttribute('download');
      else checksumLink.setAttribute('download', '');
    } else {
      badge.textContent = 'Fejlesztés alatt';
      if (link) {
        link.removeAttribute('href');
        link.setAttribute('aria-disabled', 'true');
        link.classList.add('button-unavailable');
        link.classList.remove('button-primary', 'button-secondary');
        link.querySelector('span').textContent = 'Még nem érhető el';
        link.querySelectorAll('svg').forEach((svg) => svg.remove());
      }
    }
    card.querySelector('[data-note]').textContent =
      release?.note || 'Telepíthető kiadás még nem érhető el.';
  }
  const agent = navigator.userAgent;
  const platform = /Android/i.test(agent) ? 'android' : /Windows/i.test(agent) ? 'windows' : null;
  const own = platform && TracerRelease.download(releases, platform);
  if (own) {
    const heroLink = document.querySelector('#hero-download');
    heroLink.href = own.url;
    if (own.external) heroLink.removeAttribute('download');
    else heroLink.setAttribute('download', own.filename);
    heroLink.querySelector('span').textContent =
      platform === 'windows' ? 'Letöltés Windowsra' : 'Android APK letöltése';
  }
  document.querySelector('#release-status').textContent =
    `Aktuális kiadás: ${releases.version} · ${availableCount} letölthető platform · A csomagokhoz SHA-256 ellenőrzőösszeg tartozik.`;
}
loadReleases().catch(() => {
  document.querySelector('#release-status').textContent =
    'A kiadási adatok most nem tölthetők be. A weboldalt HTTP-kiszolgálón keresztül nyisd meg, vagy próbáld újra később.';
  document.querySelectorAll('[data-download]').forEach((link) => {
    link.removeAttribute('href');
    link.setAttribute('aria-disabled', 'true');
    link.querySelector('span').textContent = 'Letöltés nem elérhető';
    link.classList.add('button-unavailable');
  });
  document.querySelectorAll('[data-status]').forEach((badge) => {
    badge.textContent = 'Nem elérhető';
  });
});
