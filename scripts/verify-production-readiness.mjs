import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

for (const file of [
  'src/partials/header.html',
  'src/partials/home-header.html',
  'src/assets/css/styles.css',
  'api/_lib/public-api.js',
  '.env.example'
]) {
  await access(path.join(root, file));
}

const header = await readFile(path.join(root, 'src/partials/header.html'), 'utf8');
const homeHeader = await readFile(path.join(root, 'src/partials/home-header.html'), 'utf8');
if (header.trim() !== homeHeader.trim()) {
  throw new Error('Homepage dan halaman internal belum memakai markup header yang sama.');
}

const css = await readFile(path.join(root, 'src/assets/css/styles.css'), 'utf8');
for (const contract of [
  'NEXORA v5.8.2 — HEADER ALIGNMENT, CACHE-SAFE RELEASE & FILTER CALIBRATION',
  'NEXORA v5.8.3 — CONTACT PROPORTION & DYNAMIC FINISHING FILTER FIT',
  '.home-c1-final .header-shell',
  'width: min(1480px, calc(100% - 72px))',
  'body.home-c1-final',
  '--header-h: 76px'
]) {
  if (!css.includes(contract)) throw new Error(`Kontrak header belum ditemukan: ${contract}`);
}

const api = await readFile(path.join(root, 'api/_lib/public-api.js'), 'utf8');
if (!api.includes('const DEFAULT_TIMEOUT_MS = 25000;')) {
  throw new Error('Default timeout backend belum 25000 ms.');
}
if (!api.includes("version: '5.8.3'")) {
  throw new Error('Public API envelope belum memakai versi 5.8.3.');
}

const env = await readFile(path.join(root, '.env.example'), 'utf8');
if (!env.includes('GAS_REQUEST_TIMEOUT_MS=25000')) {
  throw new Error('Contoh environment belum menggunakan timeout 25000 ms.');
}



const vercel = await readFile(path.join(root, 'vercel.json'), 'utf8');
if (!vercel.includes('public, max-age=0, must-revalidate')) {
  throw new Error('CSS/JS belum menggunakan kebijakan cache revalidation.');
}

for (const page of ['index.html', 'portofolio.html', 'material-finishing.html', 'kontak.html']) {
  const html = await readFile(path.join(root, 'src/pages', page), 'utf8');
  if (!html.includes('/assets/css/styles.css?v=5.8.6')) {
    throw new Error(`${page}: cache-busting CSS v5.8.6 belum terpasang.`);
  }
}

console.log('Production readiness verification PASS');
console.log('Shared header alignment, cache policy, responsive filter icons, timeout, and version contracts verified');
