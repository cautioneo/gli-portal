const fs = require('fs');
const path = require('path');

const baseUrl = 'https://www.cautioneo-gli.com/';
const directory = './'; // Current Directory (portail-bailleurs)

const htmlFiles = fs.readdirSync(directory).filter(f => f.endsWith('.html'));

const today = new Date().toISOString().split('T')[0];

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add pages
htmlFiles.forEach(file => {
    // Ne pas indexer la page d'erreur
    if (file === '404.html') return;

    // Determine priority and frequency based on file type
    let priority = '0.7';
    let changefreq = 'monthly';
    let urlSlug = file.replace('.html', '');
    
    if (file === 'index.html') {
        priority = '1.0';
        changefreq = 'weekly';
        urlSlug = ''; // L'index pointe vers la racine du domaine pure
    } else if (file.startsWith('comparatif') || file.startsWith('simulateurs')) {
        priority = '0.9';
        changefreq = 'weekly';
    } else if (file.startsWith('guide')) {
        priority = '0.8';
    } else if (file.includes('demo')) {
        priority = '0.6';
    } else if (file.includes('mentions')) {
        priority = '0.3';
        changefreq = 'yearly';
    }

    // Retirer le slash final inutile si urlSlug est vide, sinon on le garde
    const locUrl = urlSlug === '' ? baseUrl.replace(/\/$/, '') : `${baseUrl}${urlSlug}`;

    sitemapXml += `  <url>\n`;
    sitemapXml += `    <loc>${locUrl}</loc>\n`;
    sitemapXml += `    <lastmod>${today}</lastmod>\n`;
    sitemapXml += `    <changefreq>${changefreq}</changefreq>\n`;
    sitemapXml += `    <priority>${priority}</priority>\n`;
    sitemapXml += `  </url>\n`;
});

sitemapXml += `</urlset>`;

// Write the sitemap.xml file
fs.writeFileSync('sitemap.xml', sitemapXml);
console.log('Sitemap.xml generated successfully for ' + htmlFiles.length + ' pages.');
