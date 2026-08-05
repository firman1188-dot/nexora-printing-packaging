import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const css = read('src/assets/css/styles.css');
const mfPage = read('src/pages/material-finishing.html');

const home = read('src/pages/index.html');
const mfScript = read('src/assets/js/material-finishing.js');
const mfData = read('src/assets/js/material-finishing-data.js');
const portfolio = read('src/assets/js/portfolio.js');
if (home.includes('CREATIVE PRINT LAB')) throw new Error('Homepage eyebrow must remain removed.');
for (const token of [
  "elements.status.textContent = 'Memuat sampel…';",
  'state.data = await loadData();',
  'state.portfolios = await loadPortfolio();',
  'render();'
]) {
  if (!mfScript.includes(token)) throw new Error(`Production MF runtime token missing: ${token}`);
}
if (!mfData.includes("material_id: 'MAT-IVORY-300'") || !mfData.includes("finishing_id: 'FIN-LAM-DOFF'")) {
  throw new Error('Approved production Material/Finishing catalogue is missing.');
}
if (!/\.mf-mode-switch button\.active\s*\{[\s\S]*?background:\s*var\(--orange\)/.test(css)) {
  throw new Error('Orange active Material/Finishing mode is missing.');
}
for (const token of ['minimumLoaderDuration = 420', 'nexora-data-loader', 'wait(minimumLoaderDuration)']) {
  if (!portfolio.includes(token)) throw new Error(`Portfolio database loader contract missing: ${token}`);
}

for (const page of fs.readdirSync(path.join(root, 'src/pages')).filter((n) => n.endsWith('.html'))) {
  const text = read(`src/pages/${page}`);
  const versions = [...text.matchAll(/\?v=(5\.8\.\d+)/g)].map((m) => m[1]);
  if (versions.some((v) => v !== '5.8.9')) throw new Error(`Stale asset version in ${page}: ${versions.join(', ')}`);
}

for (const token of [
  '.material-finishing-page .mf-page-heading { grid-row: 1; }',
  '.material-finishing-page .mf-filter-bar { grid-row: 2; }',
  '.material-finishing-page .mf-load-status { grid-row: 3; }',
  '.material-finishing-page .mf-workspace { grid-row: 4; }',
  '.material-finishing-page .mf-trust-strip { grid-row: 5; }',
  '.material-finishing-page .mf-load-status:empty'
]) {
  if (!css.includes(token)) throw new Error(`MF grid row lock missing: ${token}`);
}
if (!mfPage.includes('/assets/css/styles.css?v=5.8.9')) throw new Error('MF CSS cache-busting v5.8.9 missing.');
if (!/\.material-finishing-page \.mf-load-status:empty\s*\{[\s\S]*?display:\s*block;[\s\S]*?visibility:\s*hidden;/.test(css)) {
  throw new Error('Empty MF status must remain in grid flow.');
}
console.log('v5.8.9 UI verification PASS');
console.log('Material/Finishing workspace and trust strip rows remain stable after async status clears');
