import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');
const errors = [];

const dataSource = await readFile(path.join(src, 'assets/js/portfolio-data.js'), 'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(dataSource, context);
const data = context.window.NEXORA_PORTFOLIO_DATA;

if (!data) errors.push('NEXORA_PORTFOLIO_DATA tidak tersedia.');
const categories = data?.categories || [];
const materials = data?.materials || [];
const finishings = data?.finishings || [];
const items = data?.portfolio_items || [];

const unique = (values, label) => {
  const seen = new Set();
  for (const value of values) {
    if (!value) errors.push(`${label}: nilai kosong.`);
    if (seen.has(value)) errors.push(`${label}: duplikat ${value}.`);
    seen.add(value);
  }
};

unique(categories.map((x) => x.category_id), 'category_id');
unique(categories.map((x) => x.category_slug), 'category_slug');
unique(materials.map((x) => x.material_id), 'material_id');
unique(finishings.map((x) => x.finishing_id), 'finishing_id');
unique(items.map((x) => x.portfolio_id), 'portfolio_id');
unique(items.map((x) => x.slug), 'portfolio slug');

const categoryIds = new Set(categories.map((x) => x.category_id));
const materialIds = new Set(materials.map((x) => x.material_id));
const finishingIds = new Set(finishings.map((x) => x.finishing_id));

for (const item of items) {
  for (const field of ['portfolio_id','title','slug','category_id','cover_image','description','status','display_order','created_at','updated_at']) {
    if (item[field] === undefined || item[field] === null || item[field] === '') errors.push(`${item.portfolio_id || item.title}: field ${field} wajib.`);
  }
  if (!categoryIds.has(item.category_id)) errors.push(`${item.portfolio_id}: category_id tidak terdaftar.`);
  for (const id of item.material_ids || []) if (!materialIds.has(id)) errors.push(`${item.portfolio_id}: material ${id} tidak terdaftar.`);
  for (const id of item.finishing_ids || []) if (!finishingIds.has(id)) errors.push(`${item.portfolio_id}: finishing ${id} tidak terdaftar.`);
  const images = [item.cover_image, ...(item.gallery_images || [])];
  for (const image of images) {
    if (!image?.startsWith('/assets/')) continue;
    const file = path.join(src, image);
    try { if (!(await stat(file)).isFile()) errors.push(`${item.portfolio_id}: gambar tidak ditemukan ${image}`); }
    catch { errors.push(`${item.portfolio_id}: gambar tidak ditemukan ${image}`); }
  }
}

try { await access(path.join(src, 'pages/produk')); errors.push('Folder src/pages/produk masih ada.'); } catch {}

const header = await readFile(path.join(src, 'partials/header.html'), 'utf8');
if (/\bProduk\b/.test(header)) errors.push('Menu Produk masih ada pada header.');
if (!header.includes('class="tabbar"')) errors.push('Bar menu bawah (ponsel) hilang dari header.');

const portfolioHtml = await readFile(path.join(src, 'pages/portofolio.html'), 'utf8');
for (const token of ['data-portfolio-app','data-chips','data-stage','data-spec','portfolio-data.js','a2-portfolio.js']) {
  if (!portfolioHtml.includes(token)) errors.push(`Portofolio HTML kehilangan ${token}.`);
}
const portfolioJs = await readFile(path.join(src, 'assets/js/a2-portfolio.js'), 'utf8');
for (const token of ['category','material','finishing','item']) {
  if (!portfolioJs.includes(`'${token}'`)) errors.push(`Portfolio JS kehilangan parameter URL ${token}.`);
}
const dataJs = await readFile(path.join(src, 'assets/js/a2-data.js'), 'utf8');
for (const token of ['portfolioApiUrl','gallery_images','category_slug']) {
  if (!dataJs.includes(token)) errors.push(`a2-data.js kehilangan dukungan ${token}.`);
}
// Label kategori tidak boleh ditulis manual: harus dibangun dari data sistem.
for (const page of ['index.html', 'portofolio.html']) {
  const html = await readFile(path.join(src, 'pages', page), 'utf8');
  if (/category=(packaging|food-packaging|label|paper-bag)/.test(html)) errors.push(`${page}: tautan kategori tidak boleh ditulis manual.`);
}

if (errors.length) {
  console.error(`Portfolio verification failed (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Portfolio verification PASS: ${items.length} items, ${categories.length} categories, ${materials.length} materials, ${finishings.length} finishings.`);
