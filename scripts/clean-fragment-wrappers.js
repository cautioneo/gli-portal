import fs from 'fs';
import path from 'path';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('<Fragment set:html=')) return;

  // Remove <Fragment set:html={`
  let updated = content.replace(/<Fragment set:html=\{\`\s*/g, '');
  // Remove trailing `} /> right before </Layout> or at end
  updated = updated.replace(/\`\}\s*\/>\s*<\/Layout>/g, '</Layout>');

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('[CLEANED]', filePath);
  }
}

function scan(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) scan(p);
    else if (f.endsWith('.astro')) processFile(p);
  });
}

scan('./src/pages');
console.log('Finished cleaning Fragment wrappers across all pages.');
