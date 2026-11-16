import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');
const errors = [];

const context = { window: {} };
vm.createContext(context);
vm.runInContext(await readFile(path.join(src, 'assets/js/material-finishing-data.js'), 'utf8'), context);
vm.runInContext(await readFile(path.join(src, 'assets/js/portfolio-data.js'), 'utf8'), context);

const master = context.window.NEXORA_MATERIAL_FINISHING_DATA;
const portfolio = context.window.NEXORA_PORTFOLIO_DATA;
if (!master) errors.push('NEXORA_MATERIAL_FINISHING_DATA tidak tersedia.');

const unique = (values, label) => {
  const seen = new Set();
  for (const value of values) {
    if (!value) errors.push(`${label}: nilai kosong.`);
    if (seen.has(value)) errors.push(`${label}: duplikat ${value}.`);
    seen.add(value);
  }
};

const materials = master?.materials || [];
const finishings = master?.finishings || [];
unique(materials.map((item) => item.material_id), 'material_id');
unique(materials.map((item) => item.material_slug), 'material_slug');
unique(finishings.map((item) => item.finishing_id), 'finishing_id');
unique(finishings.map((item) => item.finishing_slug), 'finishing_slug');

const portfolioMaterialIds = new Set((portfolio?.materials || []).map((item) => item.material_id));
const portfolioFinishingIds = new Set((portfolio?.finishings || []).map((item) => item.finishing_id));

for (const item of materials) {
  for (const field of ['material_id','material_name','material_slug','material_group','preview_image','short_description','notes','status','display_order']) {
    if (item[field] === undefined || item[field] === null || item[field] === '') errors.push(`${item.material_id || 'material'}: field ${field} wajib.`);
  }
  if (!portfolioMaterialIds.has(item.material_id)) errors.push(`${item.material_id}: belum terdaftar pada master material portofolio.`);
  if (!Array.isArray(item.characteristics) || !item.characteristics.length) errors.push(`${item.material_id}: characteristics kosong.`);
  if (!Array.isArray(item.recommended_uses) || !item.recommended_uses.length) errors.push(`${item.material_id}: recommended_uses kosong.`);
  try { if (!(await stat(path.join(src, item.preview_image))).isFile()) errors.push(`${item.material_id}: preview_image tidak ditemukan.`); }
  catch { errors.push(`${item.material_id}: preview_image tidak ditemukan ${item.preview_image}.`); }
}

for (const item of finishings) {
  for (const field of ['finishing_id','finishing_name','finishing_slug','finishing_group','preview_image','effect','notes','status','display_order']) {
    if (item[field] === undefined || item[field] === null || item[field] === '') errors.push(`${item.finishing_id || 'finishing'}: field ${field} wajib.`);
  }
  if (!portfolioFinishingIds.has(item.finishing_id)) errors.push(`${item.finishing_id}: belum terdaftar pada master finishing portofolio.`);
  if (!Array.isArray(item.characteristics) || !item.characteristics.length) errors.push(`${item.finishing_id}: characteristics kosong.`);
  if (!Array.isArray(item.recommended_uses) || !item.recommended_uses.length) errors.push(`${item.finishing_id}: recommended_uses kosong.`);
  try { if (!(await stat(path.join(src, item.preview_image))).isFile()) errors.push(`${item.finishing_id}: preview_image tidak ditemukan.`); }
  catch { errors.push(`${item.finishing_id}: preview_image tidak ditemukan ${item.preview_image}.`); }
}

const html = await readFile(path.join(src, 'pages/material-finishing.html'), 'utf8');
for (const token of ['data-mf-app','data-mode','data-chips','data-stage','material-finishing-data.js','a2-material.js']) {
  if (!html.includes(token)) errors.push(`Material & Finishing HTML kehilangan ${token}.`);
}
const js = await readFile(path.join(src, 'assets/js/a2-material.js'), 'utf8');
for (const token of ["'type'", "'group'", "'id'"]) {
  if (!js.includes(token)) errors.push(`Material & Finishing JS kehilangan parameter URL ${token}.`);
}
const dataJs = await readFile(path.join(src, 'assets/js/a2-data.js'), 'utf8');
for (const token of ['materialFinishingApiUrl','material_ids','finishing_ids']) {
  if (!dataJs.includes(token)) errors.push(`a2-data.js kehilangan dukungan ${token}.`);
}

if (errors.length) {
  console.error(`Material & Finishing verification failed (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Material & Finishing verification PASS: ${materials.length} materials, ${finishings.length} finishings.`);
