import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = await readFile(path.join(root, 'src/assets/css/styles.css'), 'utf8');
const page = await readFile(path.join(root, 'src/pages/material-finishing.html'), 'utf8');
const script = await readFile(path.join(root, 'src/assets/js/material-finishing.js'), 'utf8');

for (const contract of [
  '/assets/css/styles.css?v=5.8.6',
  '/assets/js/material-finishing.js?v=5.8.6'
]) {
  if (!page.includes(contract)) throw new Error(`Cache-busting v5.8.6 belum terpasang: ${contract}`);
}

for (const contract of [
  'NEXORA v5.8.6 — RESTORED MATERIAL/FINISHING VIEW + ORANGE ACTIVE MODE',
  '.mf-mode-switch button.active',
  'background: var(--orange)',
  '.mf-load-status.is-loading',
  'position: absolute'
]) {
  if (!css.includes(contract)) throw new Error(`Kontrak CSS v5.8.6 belum ditemukan: ${contract}`);
}

for (const contract of [
  'state.data = localMasterData();',
  'state.portfolios = normalizePortfolio(window.NEXORA_PORTFOLIO_DATA || {});',
  'render();',
  "setLoadingState(true, 'Menyinkronkan material dan finishing')"
]) {
  if (!script.includes(contract)) throw new Error(`Kontrak render-first v5.8.6 belum ditemukan: ${contract}`);
}

const firstRender = script.indexOf('    render();\n    setLoadingState(true');
if (firstRender < 0) {
  throw new Error('Material & Finishing belum dirender sebelum sinkronisasi database.');
}

console.log('v5.8.6 UI verification PASS');
console.log('Material/Finishing view restored during sync and active mode is orange');
