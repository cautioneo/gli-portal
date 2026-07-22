import fs from 'fs';
import path from 'path';

const domain = 'https://cautioneo-gli.com';
const distDir = path.resolve('./dist');
const publicDir = path.resolve('./public');
const today = new Date().toISOString().split('T')[0];

console.log('=== STARTING AUTOMATED SITEMAP GENERATION (B2B) ===');

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

// Exclude non-user facing pages, templates, and search verification files in B2B
const excludePages = [
  '404.html',
  'blog-post.html',
  'BingSiteAuth.xml'
];

const languages = ['fr', 'en', 'es', 'pt', 'it', 'de', 'ar', 'nl'];

for (const file of htmlFiles) {
  const relPath = path.relative(distDir, file).replace(/\\/g, '/');
  const basename = path.basename(file);
  
  if (excludePages.includes(basename) || /^google[a-f0-9]{16}\.html$/i.test(basename) || basename.includes('demo')) {
    continue;
  }

  // Extract true modification date from HTML JSON-LD schema
  const content = fs.readFileSync(file, 'utf-8');
  
  // Skip if page has a noindex directive
  if (/meta\s+[^>]*content=["'][^"']*noindex[^"']*["']/i.test(content) || /meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex[^"']*["']/i.test(content)) {
    console.log(`[EXCLUDE] Skipping noindex page: ${relPath}`);
    continue;
  }

  let urlPath = '';
  let priority = '0.7';
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
  
  // Custom priorities based on pages
  if (urlPath === 'comparatif-gli' || urlPath === 'simulateur-eligibilite-gli' || urlPath === 'procedures') {
    priority = '0.9';
    freq = 'weekly';
  } else if (urlPath.startsWith('guide-') || urlPath.startsWith('mega-')) {
    priority = '0.8';
    freq = 'monthly';
  } else if (urlPath.startsWith('blog-')) {
    priority = '0.7';
    freq = 'monthly';
  } else if (urlPath === 'mentions-legales' || urlPath === 'confidentialite' || urlPath === 'cgs' || urlPath === 'reclamation') {
    priority = '0.3';
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

  // Generate hreflang links for this route
  const cleanPath = urlPath ? `/${urlPath}` : '';
  const hreflangLinks = languages.map(l => {
    const lPath = l === 'fr' ? cleanPath : `/${l}${cleanPath}`;
    return `    <xhtml:link rel="alternate" hreflang="${l}" href="${domain}${lPath}"/>`;
  }).join('\n');

  // Push main / language URL entry
  const fullUrl = `${domain}${cleanPath}` || `${domain}/`;
  urls.push(`  <url>
    <loc>${fullUrl}</loc>
${hreflangLinks}
    <lastmod>${lastmod}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
  count++;

  // Add lang-specific entries to sitemap
  for (const lang of languages) {
    if (lang === 'fr') continue;
    const langUrl = `${domain}/${lang}${cleanPath}`;
    urls.push(`  <url>
    <loc>${langUrl}</loc>
${hreflangLinks}
    <lastmod>${lastmod}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${(parseFloat(priority) * 0.9).toFixed(1)}</priority>
  </url>`);
    count++;
  }
}

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;

// Write to both public/sitemap.xml and dist/sitemap.xml
const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
const distSitemapPath = path.join(distDir, 'sitemap.xml');

fs.writeFileSync(publicSitemapPath, sitemapContent, 'utf-8');
console.log(`[SUCCESS] Wrote sitemap to ${publicSitemapPath} (${count} URLs)`);

fs.writeFileSync(distSitemapPath, sitemapContent, 'utf-8');
console.log(`[SUCCESS] Wrote sitemap to ${distSitemapPath}`);

console.log('=== SITEMAP GENERATION COMPLETED ===');
