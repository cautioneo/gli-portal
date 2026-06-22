import { readFileSync, writeFileSync } from 'fs';
const css = readFileSync('public/styles-b2b.src.css', 'utf8');
const minified = css
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\r\n|\r|\n/g, ' ')
  .replace(/\s{2,}/g, ' ')
  .replace(/\s*\{\s*/g, '{')
  .replace(/\s*\}\s*/g, '}')
  .replace(/\s*;\s*/g, ';')
  .replace(/\s*,\s*/g, ',')
  .trim();
writeFileSync('public/styles-b2b.css', minified, 'utf8');
console.log('Done. Size: ' + (minified.length / 1024).toFixed(1) + ' KB');
