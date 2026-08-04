import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');

const header = await readFile(path.join(src, 'partials/header.html'), 'utf8');
const homeHeader = await readFile(path.join(src, 'partials/home-header.html'), 'utf8');
const footer = await readFile(path.join(src, 'partials/footer.html'), 'utf8');
const consultation = await readFile(path.join(src, 'partials/consultation.html'), 'utf8');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(path.join(src, 'assets'), path.join(dist, 'assets'), { recursive: true });

async function buildDirectory(sourceDir, outputDir) {
  await mkdir(outputDir, { recursive: true });
  const entries = await readdir(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const outputPath = path.join(outputDir, entry.name);
    if (entry.isDirectory()) {
      await buildDirectory(sourcePath, outputPath);
      continue;
    }
    let content = await readFile(sourcePath, 'utf8');
    content = content
      .replaceAll('{{HOME_HEADER}}', homeHeader)
      .replaceAll('{{HEADER}}', header)
      .replaceAll('{{FOOTER}}', footer)
      .replaceAll('{{CONSULTATION}}', consultation);
    await writeFile(outputPath, content);
  }
}

await buildDirectory(path.join(src, 'pages'), dist);

const sitemapPages = [
  '/', '/portofolio.html', '/material-finishing.html', '/kontak.html'
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPages.map((url) => `  <url><loc>https://example.com${url}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);
await writeFile(path.join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml\n');
await writeFile(path.join(dist, 'site.webmanifest'), JSON.stringify({
  name: 'NEXORA Printing & Packaging',
  short_name: 'NEXORA',
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#071b3f',
  icons: []
}, null, 2));

console.log(`Build complete: ${dist}`);
