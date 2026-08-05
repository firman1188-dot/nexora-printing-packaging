import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = await readFile(path.join(root, 'src/assets/css/styles.css'), 'utf8');
const home = await readFile(path.join(root, 'src/pages/index.html'), 'utf8');
const portfolio = await readFile(path.join(root, 'src/assets/js/portfolio.js'), 'utf8');
const material = await readFile(path.join(root, 'src/assets/js/material-finishing.js'), 'utf8');

if (home.includes('CREATIVE PRINT LAB')) {
  throw new Error('Label CREATIVE PRINT LAB masih ada pada homepage.');
}

for (const contract of [
  '/assets/css/styles.css?v=5.8.6',
  'class="home-page home-c1-final"'
]) {
  if (!home.includes(contract)) throw new Error(`Homepage belum memenuhi kontrak: ${contract}`);
}

for (const contract of [
  'NEXORA v5.8.4 — DATABASE LOADER & SINGLE-VIEWPORT MOBILE HOMEPAGE',
  '@keyframes nexora-clockwise-square',
  '.nexora-data-loader i:nth-child(3)',
  'grid-area: 2 / 2',
  'height: 100dvh',
  'overflow: hidden !important',
  'grid-template-rows: minmax(0, 1fr) auto',
  '.home-c1-final .home-category',
  'min-height: clamp(52px, 7.7vh, 66px)'
]) {
  if (!css.includes(contract)) throw new Error(`Kontrak UI v5.8.4 belum ditemukan: ${contract}`);
}

for (const [name, source] of [['portfolio', portfolio], ['material-finishing', material]]) {
  for (const contract of [
    'const minimumLoaderDuration = 420;',
    'nexora-data-loader',
    "root.setAttribute('aria-busy', String(loading))",
    'wait(minimumLoaderDuration)'
  ]) {
    if (!source.includes(contract)) throw new Error(`Loader ${name} belum memenuhi kontrak: ${contract}`);
  }
}

console.log('v5.8.4 UI verification PASS');
console.log('Clockwise four-square loader and single-viewport mobile homepage verified');
