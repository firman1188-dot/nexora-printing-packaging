import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

for (const file of [
  'src/partials/header.html',
  'src/assets/css/a2.css',
  'api/_lib/public-api.js',
  '.env.example'
]) {
  await access(path.join(root, file));
}

const css = await readFile(path.join(root, 'src/assets/css/a2.css'), 'utf8');
for (const contract of ['--bar:62px', '.tabbar', 'env(safe-area-inset-bottom)', '@media(max-width:860px)', 'prefers-reduced-motion']) {
  if (!css.includes(contract)) throw new Error(`Kontrak tampilan ponsel belum ditemukan: ${contract}`);
}
const build = await readFile(path.join(root, 'scripts/build.mjs'), 'utf8');
if (build.includes('example.com')) throw new Error('build.mjs masih memuat placeholder example.com.');

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
  if (!html.includes('/assets/css/a2.css?v=6.0.0')) {
    throw new Error(`${page}: cache-busting CSS v6.0.0 belum terpasang.`);
  }
  if (!html.includes('rel="canonical"') || !html.includes('og:title')) {
    throw new Error(`${page}: canonical / Open Graph belum ada.`);
  }
}

console.log('Production readiness verification PASS');
console.log('Mobile tab bar, cache policy, SEO tags, timeout, and version contracts verified');
