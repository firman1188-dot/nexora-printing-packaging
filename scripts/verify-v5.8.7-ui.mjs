import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagesDir = path.join(root, 'src', 'pages');
const pages = fs.readdirSync(pagesDir).filter((name) => name.endsWith('.html'));
const stale = [];
for (const name of pages) {
  const text = fs.readFileSync(path.join(pagesDir, name), 'utf8');
  const versions = [...text.matchAll(/\?v=(5\.8\.\d+)/g)].map((m) => m[1]);
  if (versions.some((v) => v !== '5.8.7')) stale.push(`${name}: ${versions.join(', ')}`);
}
if (stale.length) throw new Error(`Stale asset version:\n${stale.join('\n')}`);
const js = fs.readFileSync(path.join(root, 'src/assets/js/material-finishing.js'), 'utf8');
for (const token of ['ensureRenderableData', 'isItemActive', 'state.data = ensureRenderableData(data)']) {
  if (!js.includes(token)) throw new Error(`Missing v5.8.7 guard: ${token}`);
}
const css = fs.readFileSync(path.join(root, 'src/assets/css/styles.css'), 'utf8');
if (!css.includes('.mf-mode-switch button.active') || !css.includes('background: var(--orange)')) {
  throw new Error('Orange active Material/Finishing tab contract missing.');
}
console.log('v5.8.7 UI verification PASS');
