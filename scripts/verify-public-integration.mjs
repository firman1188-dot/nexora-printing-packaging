import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'api/_lib/public-api.js',
  'api/public/portfolio.js',
  'api/public/portfolio/[slug].js',
  'api/public/categories.js',
  'api/public/materials.js',
  'api/public/materials/[slug].js',
  'api/public/finishings.js',
  'api/public/finishings/[slug].js',
  'api/public/material-finishing.js',
  'src/assets/images/material-finishing/sample-fallback.svg'
];

for (const file of required) await access(path.join(root, file));

const config = await readFile(path.join(root, 'src/assets/js/site-config.js'), 'utf8');
if (!config.includes("portfolioApiUrl: '/api/public/portfolio'")) throw new Error('portfolioApiUrl belum memakai same-origin public API.');
if (!config.includes("materialFinishingApiUrl: '/api/public/material-finishing'")) throw new Error('materialFinishingApiUrl belum memakai same-origin public API.');

const helper = await readFile(path.join(root, 'api/_lib/public-api.js'), 'utf8');
for (const secret of ['GAS_WEB_APP_URL', 'GAS_SHARED_SECRET', 'NEXORA_CLIENT_ID']) {
  if (!helper.includes(`process.env[${JSON.stringify(secret)}]`) && !helper.includes(`getEnv('${secret}'`)) {
    throw new Error(`Environment ${secret} belum dibaca server-side.`);
  }
}
if (helper.includes('window.') || helper.includes('localStorage')) throw new Error('Server adapter tidak boleh bergantung pada browser storage.');
if (!helper.includes("new Set(['GET_PORTFOLIO_MASTERS', 'LIST_PORTFOLIOS_PAGE', 'GET_PORTFOLIO'])")) throw new Error('Allowlist action publik belum terkunci.');

console.log('Public integration verification PASS');
console.log(`Verified ${required.length} integration files`);
