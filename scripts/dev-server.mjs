import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const port = Number(process.env.PORT || 3000);
spawnSync(process.execPath, [path.join(root, 'scripts/build.mjs')], { stdio: 'inherit' });

const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.xml':'application/xml', '.txt':'text/plain; charset=utf-8', '.webmanifest':'application/manifest+json' };

function safePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  if (clean.includes('..')) return null;
  if (clean === '/') return path.join(dist, 'index.html');
  const direct = path.join(dist, clean);
  return direct;
}

async function resolveFile(urlPath) {
  let candidate = safePath(urlPath);
  if (!candidate) return null;
  try { if ((await stat(candidate)).isFile()) return candidate; } catch {}
  if (!path.extname(candidate)) {
    try { if ((await stat(`${candidate}.html`)).isFile()) return `${candidate}.html`; } catch {}
    try { if ((await stat(path.join(candidate, 'index.html'))).isFile()) return path.join(candidate, 'index.html'); } catch {}
  }
  return null;
}

createServer(async (req, res) => {
  const file = await resolveFile(req.url || '/');
  const target = file || path.join(dist, '404.html');
  try {
    const data = await readFile(target);
    res.writeHead(file ? 200 : 404, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(String(error));
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`NEXORA running at http://localhost:${port}`);
});
