const fs = require('fs');
const path = require('path');

const baseUrl = 'https://www.cautioneo.com/bailleurs/';
const directory = './'; // Current Directory (portail-bailleurs)

const htmlFiles = fs.readdirSync(directory).filter(f => f.endsWith('.html'));

const today = new Date().toISOString().split('T')[0];

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add pages
htmlFiles.forEach(file => {
    // Determine priority and frequency based on file type
    let priority = '0.7';
    let changefreq = 'monthly';
    
    if (file === 'index.html') {
        priority = '1.0';
        changefreq = 'weekly';
    } else if (file.startsWith('comparatif') || file.startsWith('simulateurs')) {
        priority = '0.9';
        changefreq = 'weekly';
    } else if (file.startsWith('guide')) {
        priority = '0.8';
    } else if (file.includes('demo')) {
        priority = '0.6';
    } else if (file === '404.html' || file.includes('mentions')) {
        priority = '0.3';
        changefreq = 'yearly';
    }

    sitemapXml += `  <url>\n`;
    sitemapXml += `    <loc>${baseUrl}${file.replace('.html', '')}</loc>\n`;
    sitemapXml += `    <lastmod>${today}</lastmod>\n`;
    sitemapXml += `    <changefreq>${changefreq}</changefreq>\n`;
    sitemapXml += `    <priority>${priority}</priority>\n`;
    sitemapXml += `  </url>\n`;
});

sitemapXml += `</urlset>`;

// Write the sitemap.xml file
fs.writeFileSync('sitemap.xml', sitemapXml);
console.log('Sitemap.xml generated successfully for ' + htmlFiles.length + ' pages.');
