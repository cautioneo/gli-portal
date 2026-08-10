import fs from 'fs';
import path from 'path';

const domain = 'https://cautioneo-gli.com';
const distDir = path.resolve('./dist');
const publicDir = path.resolve('./public');
const today = new Date().toISOString().split('T')[0];

console.log('=== STARTING AUTOMATED SITEMAP GENERATION ===');

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
      filesList.push(filePath);
    }
  }
  return filesList;
}

const htmlFiles = getRootHtmlFiles(distDir);
console.log(`Found ${htmlFiles.length} root HTML files in dist/`);

const urls = [];
let count = 0;

const languages = ['fr', 'en', 'es', 'pt', 'it', 'de', 'ar', 'nl'];

for (const file of htmlFiles) {
  const relPath = path.relative(distDir, file).replace(/\\/g, '/');
  const basename = path.basename(file);
  
  if (basename === '404.html' || /^google[a-f0-9]{16}\html$/i.test(basename) || basename === 'BingSiteAuth.xml') {
    continue;
  }

  const content = fs.readFileSync(file, 'utf-8');
  
  if (/meta\s+[^>]*content=["'][^"']*noindex[^"']*["']/i.test(content) || /meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex[^"']*["']/i.test(content)) {
    console.log(`[EXCLUDE] Skipping noindex page: ${relPath}`);
    continue;
  }

  let urlPath = '';
  let priority = '0.8';
  let freq = 'monthly';
  
  if (relPath === 'index.html') {
    urlPath = '';
    priority = '1.0';
    freq = 'weekly';
  } else if (relPath.endsWith('/index.html')) {
    urlPath = relPath.substring(0, relPath.length - 11);
  } else {
    urlPath = relPath.substring(0, relPath.length - 5);
  }
  
  if (urlPath === 'simulateur-tarif' || urlPath === 'comparateur-garanties' || urlPath === 'comparateur-economies') {
    priority = '0.9';
    freq = 'weekly';
  } else if (urlPath.startsWith('guide-') || urlPath.startsWith('mega-')) {
    priority = '0.9';
    freq = 'monthly';
  } else if (urlPath.startsWith('blog-')) {
    priority = '0.8';
    freq = 'monthly';
  }
  
  let lastmod = today;
  const dateModifiedMatch = content.match(/"dateModified"\s*:\s*"([^"]+)"/i);
  const datePublishedMatch = content.match(/"datePublished"\s*:\s*"([^"]+)"/i);
  if (dateModifiedMatch) {
    lastmod = dateModifiedMatch[1].split('T')[0];
  } else if (datePublishedMatch) {
    lastmod = datePublishedMatch[1].split('T')[0];
  }

  const cleanPath = urlPath ? `/${urlPath}` : '';
  const hreflangList = languages.map(l => {
    const lPath = l === 'fr' ? cleanPath : `/${l}${cleanPath}`;
    return `    <xhtml:link rel="alternate" hreflang="${l}" href="${domain}${lPath}"/>`;
  });
  hreflangList.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${domain}${cleanPath}"/>`);
  const hreflangLinks = hreflangList.join('\n');

  const fullUrl = `${domain}${cleanPath}` || `${domain}/`;
  urls.push(`  <url>
    <loc>${fullUrl}</loc>
${hreflangLinks}
    <lastmod>${lastmod}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
  count++;
}

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;

const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
const distSitemapPath = path.join(distDir, 'sitemap.xml');

fs.writeFileSync(publicSitemapPath, sitemapContent, 'utf-8');
console.log(`[SUCCESS] Wrote sitemap to ${publicSitemapPath} (${count} URLs)`);

fs.writeFileSync(distSitemapPath, sitemapContent, 'utf-8');
console.log(`[SUCCESS] Wrote sitemap to ${distSitemapPath}`);

console.log('=== SITEMAP GENERATION COMPLETED ===');
