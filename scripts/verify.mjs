import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
let errors = [];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(p)); else out.push(p);
  }
  return out;
}

const files = await walk(dist);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const assetRefs = new Set();

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  if (html.includes('{{HEADER}}') || html.includes('{{FOOTER}}')) errors.push(`${file}: unreplaced template token`);
  if (!html.includes('<meta name="viewport"')) errors.push(`${file}: missing viewport`);
  for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"#?]+)"/g)) assetRefs.add(match[1]);
  if (/three\.js|webgl|\.glb/i.test(html)) errors.push(`${file}: 3D library must be loaded only from assets/js/samudra.js`);
  if (!html.includes('/assets/css/a2.css')) errors.push(`${file}: a2.css belum dipasang`);
  if (/\bexample\.com\b/.test(html)) errors.push(`${file}: placeholder example.com`);
}

for (const ref of assetRefs) {
  const target = path.join(dist, ref);
  try { if (!(await stat(target)).isFile()) errors.push(`Missing asset: ${ref}`); } catch { errors.push(`Missing asset: ${ref}`); }
}

const css = await readFile(path.join(dist, 'assets/css/a2.css'), 'utf8');
for (const token of ['.tabbar', '.stage', '.chips', '@media(max-width:860px)']) {
  if (!css.includes(token)) errors.push(`a2.css kehilangan ${token}`);
}
for (const name of ['a2-core.js', 'a2-data.js', 'a2-stack.js', 'a2-home.js', 'a2-portfolio.js', 'a2-material.js', 'a2-contact.js']) {
  const js = await readFile(path.join(dist, 'assets/js', name), 'utf8');
  if (/THREE|GLTFLoader|WebGLRenderer/.test(js)) errors.push(`${name}: kode 3D hanya boleh ada di samudra.js`);
}
const sky = await readFile(path.join(dist, 'assets/js/samudra.js'), 'utf8');
if (!sky.includes('three@0.160.0')) errors.push('samudra.js: versi Three.js harus dikunci (0.160.0)');
if (!sky.includes('catch')) errors.push('samudra.js: harus aman bila WebGL gagal');

if (errors.length) {
  console.error(`Verification failed (${errors.length}):`);
  errors.forEach((e) => console.error(`- ${e}`));
  process.exit(1);
}
console.log(`Verification PASS: ${htmlFiles.length} HTML files, ${assetRefs.size} referenced assets.`);
