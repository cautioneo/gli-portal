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

function getFilesRecursively(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFilesRecursively(filePath, filesList);
    } else if (file.endsWith('.html')) {
      filesList.push(filePath);
    }
  }
  return filesList;
}

const htmlFiles = getFilesRecursively(distDir);
console.log(`Found ${htmlFiles.length} HTML files in dist/`);

const urls = [];
let count = 0;

// Exclude non-user facing pages, templates, and search verification files in B2B
const excludePages = [
  '404.html',
  'blog-post.html',
  'BingSiteAuth.xml'
];

for (const file of htmlFiles) {
  const relPath = path.relative(distDir, file).replace(/\\/g, '/');
  const basename = path.basename(file);
  
  if (excludePages.includes(basename) || /^google[a-f0-9]{16}\.html$/i.test(basename) || basename.includes('demo')) {
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
    urlPath = relPath.substring(0, relPath.length - 11); // strip /index.html
  } else {
    urlPath = relPath.substring(0, relPath.length - 5); // strip .html
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
  
  const fullUrl = `${domain}/${urlPath}`.replace(/\/$/, ''); // strip trailing slash except for home page
  const finalUrl = fullUrl === domain ? `${domain}/` : fullUrl;
  
  urls.push(`  <url>
    <loc>${finalUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
  count++;
}

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
