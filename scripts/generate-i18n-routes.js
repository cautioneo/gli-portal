import fs from 'fs';
import path from 'path';

const domain = 'https://cautioneo-gli.com';
const distDir = path.resolve('./dist');
const languages = ['en', 'es', 'pt', 'it', 'de', 'ar', 'nl'];

console.log('=== STARTING MULTILINGUAL STATIC ROUTES GENERATION (B2B) ===');

if (!fs.existsSync(distDir)) {
  console.error(`[ERROR] dist/ directory not found at ${distDir}. Run build first!`);
  process.exit(1);
}

function getRootHtmlFiles(dir) {
  const filesList = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (!stat.isDirectory() && file.endsWith('.html')) {
      if (file === '404.html' || /^google[a-f0-9]{16}\.html$/i.test(file)) {
        continue;
      }
      filesList.push(file);
    }
  }
  return filesList;
}

/**
 * Rewrites root-relative <a href="/page"> links to <a href="/{lang}/page">
 * while safely skipping all <script>...</script> tag content to avoid
 * corrupting JSON-LD structured data or inline JavaScript.
 */
function rewriteAnchorLinks(html, lang) {
  // Split the HTML into script and non-script segments
  // We only rewrite links in non-script portions
  const parts = [];
  let lastIndex = 0;
  const scriptTagRegex = /<script[\s\S]*?<\/script>/gi;
  let match;

  while ((match = scriptTagRegex.exec(html)) !== null) {
    // Push the non-script portion before this script block
    parts.push({ type: 'html', content: html.slice(lastIndex, match.index) });
    // Push the script block verbatim (no rewriting)
    parts.push({ type: 'script', content: match[0] });
    lastIndex = match.index + match[0].length;
  }
  // Push any remaining HTML after the last script block
  parts.push({ type: 'html', content: html.slice(lastIndex) });

  // Only process 'html' parts for anchor link rewriting
  const anchorLinkRegex = /<a\s+([^>]*\s+)?href=["']\/([a-zA-Z0-9_-]+(?:\.html)?)["']([^>]*)>/gi;

  const rewritten = parts.map(part => {
    if (part.type === 'script') return part.content;
    return part.content.replace(anchorLinkRegex, (m, p1, p2, p3) => {
      const target = p2 || '';
      // Skip asset files
      if (
        target.startsWith('script') ||
        target.startsWith('styles') ||
        target.startsWith('images') ||
        target.startsWith('favicon') ||
        target === 'sitemap.xml'
      ) {
        return m;
      }
      const prefix = p1 || '';
      const suffix = p3 || '';
      return `<a ${prefix}href="/${lang}/${target}"${suffix}>`;
    });
  });

  return rewritten.join('');
}

const htmlFiles = getRootHtmlFiles(distDir);
console.log(`Found ${htmlFiles.length} root HTML files to replicate across ${languages.length} target languages...`);

let generatedCount = 0;

for (const lang of languages) {
  const langDir = path.join(distDir, lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }

  for (const file of htmlFiles) {
    const srcPath = path.join(distDir, file);
    let content = fs.readFileSync(srcPath, 'utf-8');

    const cleanName = file === 'index.html' ? '' : file.replace(/\.html$/, '');
    const canonicalLangUrl = cleanName ? `${domain}/${lang}/${cleanName}` : `${domain}/${lang}`;

    // 1. Update html lang & dir
    const isRtl = lang === 'ar';
    content = content.replace(/<html\s+lang=["']fr["']/i, `<html lang="${lang}"${isRtl ? ' dir="rtl"' : ''}`);

    // 2. Update Canonical link
    content = content.replace(/<link\s+rel=["']canonical["']\s+href=["'][^"']+["']\s*\/?>/i, `<link rel="canonical" href="${canonicalLangUrl}" />`);

    // 3. Inject instant language initialization script in head
    const langInitScript = `
    <script>
      try {
        localStorage.setItem('preferred-lang', '${lang}');
        document.cookie = "googtrans=/fr/${lang}; path=/;";
        document.cookie = "googtrans=/fr/${lang}; path=/; domain=" + window.location.hostname;
      } catch(e) {}
    </script>
    `;
    content = content.replace('</head>', `${langInitScript}</head>`);

    // 4. Safely rewrite <a href="/..."> links (skipping <script> blocks)
    content = rewriteAnchorLinks(content, lang);

    // Write to dist/{lang}/{file}
    const destPath = path.join(langDir, file);
    fs.writeFileSync(destPath, content, 'utf-8');
    generatedCount++;
  }

  console.log(`[${lang.toUpperCase()}] Generated ${htmlFiles.length} pages in dist/${lang}/`);
}

console.log(`\n[SUCCESS] Generated ${generatedCount} static multilingual HTML routes in dist/ (${languages.join(', ')})`);
console.log('=== MULTILINGUAL ROUTE GENERATION COMPLETED ===');
