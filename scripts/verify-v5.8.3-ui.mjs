import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = await readFile(path.join(root, 'src/assets/css/styles.css'), 'utf8');
const contact = await readFile(path.join(root, 'src/pages/kontak.html'), 'utf8');
const mfJs = await readFile(path.join(root, 'src/assets/js/material-finishing.js'), 'utf8');

for (const contract of [
  'class="contact-page"',
  '/assets/css/styles.css?v=5.8.3'
]) {
  if (!contact.includes(contract)) throw new Error(`Kontak belum memenuhi kontrak: ${contract}`);
}

for (const contract of [
  'NEXORA v5.8.3 — CONTACT PROPORTION & DYNAMIC FINISHING FILTER FIT',
  '.contact-page .inner-hero',
  'width: min(1480px, calc(100% - 72px))',
  'grid-template-columns: repeat(var(--mf-filter-count, 6), minmax(0, 1fr))',
  '.mf-filter-bar[data-mf-mode="finishing"] .mf-filter-icon',
  'width: clamp(17px, 1.12vw, 21px)'
]) {
  if (!css.includes(contract)) throw new Error(`Kontrak UI v5.8.3 belum ditemukan: ${contract}`);
}

for (const contract of [
  "elements.filters.dataset.mfMode = state.mode;",
  "elements.filters.style.setProperty('--mf-filter-count'"
]) {
  if (!mfJs.includes(contract)) throw new Error(`Filter dinamis belum ditemukan: ${contract}`);
}

console.log('v5.8.3 UI verification PASS');
console.log('Contact proportion, page class, seven-column finishing filters, and responsive icons verified');
