import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const js = fs.readFileSync(path.join(root, 'src/assets/js/material-finishing.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/assets/css/styles.css'), 'utf8');
const page = fs.readFileSync(path.join(root, 'src/pages/material-finishing.html'), 'utf8');

const checks = [
  ['material API empty fallback', /const materials = hasItems\(apiMaterials\)[\s\S]*?: local\.materials;/],
  ['finishing API empty fallback', /const finishings = hasItems\(apiFinishings\)[\s\S]*?: local\.finishings;/],
  ['orange active mode', /\.mf-mode-switch button\.active\s*\{[\s\S]*?background:\s*var\(--orange\)/],
  ['v5.8.6 asset version', /material-finishing\.js\?v=5\.8\.6/]
];

for (const [label, pattern] of checks) {
  const source = label.includes('orange') ? css : label.includes('asset') ? page : js;
  if (!pattern.test(source)) {
    console.error(`FAIL: ${label}`);
    process.exit(1);
  }
}

console.log('v5.8.6 UI verification PASS');
