import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const hash = (relative) => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, relative))).digest('hex');

const home = read('src/pages/index.html');
const mfPage = read('src/pages/material-finishing.html');
const mfScript = read('src/assets/js/material-finishing.js');
const mfData = read('src/assets/js/material-finishing-data.js');
const css = read('src/assets/css/styles.css');
const portfolio = read('src/assets/js/portfolio.js');

if (home.includes('CREATIVE PRINT LAB')) throw new Error('Homepage eyebrow must remain removed.');
for (const page of fs.readdirSync(path.join(root, 'src/pages')).filter((n) => n.endsWith('.html'))) {
  const text = read(`src/pages/${page}`);
  const versions = [...text.matchAll(/\?v=(5\.8\.\d+)/g)].map((m) => m[1]);
  if (versions.some((v) => v !== '5.8.8')) throw new Error(`Stale asset version in ${page}: ${versions.join(', ')}`);
}

for (const token of [
  "elements.status.textContent = 'Memuat sampel…';",
  'state.data = await loadData();',
  'state.portfolios = await loadPortfolio();',
  'render();'
]) {
  if (!mfScript.includes(token)) throw new Error(`Production MF runtime token missing: ${token}`);
}
for (const forbidden of ['setLoadingState(', 'minimumLoaderDuration', 'ensureRenderableData']) {
  if (mfScript.includes(forbidden)) throw new Error(`Experimental MF runtime still present: ${forbidden}`);
}
if (!mfData.includes("material_id: 'MAT-IVORY-300'") || !mfData.includes("finishing_id: 'FIN-LAM-DOFF'")) {
  throw new Error('Approved production Material/Finishing catalogue is missing.');
}
if (!/\.mf-mode-switch button\.active\s*\{[\s\S]*?background:\s*var\(--orange\)/.test(css)) {
  throw new Error('Orange active Material/Finishing mode is missing.');
}
if (!css.includes('NEXORA v5.8.4 — DATABASE LOADER & SINGLE-VIEWPORT MOBILE HOMEPAGE')) {
  throw new Error('Homepage single-viewport contract is missing.');
}
for (const token of ['minimumLoaderDuration = 420', 'nexora-data-loader', 'wait(minimumLoaderDuration)']) {
  if (!portfolio.includes(token)) throw new Error(`Portfolio database loader contract missing: ${token}`);
}
if (!mfPage.includes('/assets/js/material-finishing.js?v=5.8.8')) {
  throw new Error('Material/Finishing cache-busting version is missing.');
}

console.log('v5.8.8 UI verification PASS');
console.log('Material/Finishing runtime restored from Production v5.8.3; active mode orange');
console.log(`MF runtime SHA256: ${hash('src/assets/js/material-finishing.js')}`);
console.log(`MF catalogue SHA256: ${hash('src/assets/js/material-finishing-data.js')}`);
