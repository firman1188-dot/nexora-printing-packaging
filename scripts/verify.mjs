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
  if (/three\.js|webgl|\.glb/i.test(html)) errors.push(`${file}: forbidden legacy 3D reference`);
}

for (const ref of assetRefs) {
  const target = path.join(dist, ref);
  try { if (!(await stat(target)).isFile()) errors.push(`Missing asset: ${ref}`); } catch { errors.push(`Missing asset: ${ref}`); }
}

const css = await readFile(path.join(dist, 'assets/css/styles.css'), 'utf8');
if (!css.includes('height: 100dvh')) errors.push('Homepage viewport lock missing');
if (/threeProduct|glbPilot|WebGL/i.test(css)) errors.push('Legacy 3D CSS remains');
const js = await readFile(path.join(dist, 'assets/js/main.js'), 'utf8');
if (/THREE|GLTFLoader|WebGLRenderer/.test(js)) errors.push('Legacy 3D JavaScript remains');

if (errors.length) {
  console.error(`Verification failed (${errors.length}):`);
  errors.forEach((e) => console.error(`- ${e}`));
  process.exit(1);
}
console.log(`Verification PASS: ${htmlFiles.length} HTML files, ${assetRefs.size} referenced assets.`);
