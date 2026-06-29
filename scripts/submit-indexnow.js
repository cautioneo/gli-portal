import fs from 'fs';
import path from 'path';
import https from 'https';

const domain = 'cautioneo-gli.com';
const key = '0a9cc6ed73475430ea32c09c7171765f';
const sitemapPath = path.resolve('./dist/sitemap.xml');

console.log(`=== STARTING INDEXNOW SUBMISSION FOR ${domain} ===`);

if (!fs.existsSync(sitemapPath)) {
  console.warn(`[WARNING] Sitemap not found at ${sitemapPath}. Skipping IndexNow submission!`);
  process.exit(0);
}

// Simple XML parser to extract <loc> tags without heavy dependencies
function extractUrlsFromSitemap(xmlContent) {
  const urls = [];
  const regex = /<loc>(https:\/\/[^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(xmlContent)) !== null) {
    urls.push(match[1].trim());
  }
  return urls;
}

try {
  const xmlContent = fs.readFileSync(sitemapPath, 'utf-8');
  const urls = extractUrlsFromSitemap(xmlContent);
  
  if (urls.length === 0) {
    console.log('[SKIP] No URLs found in sitemap.xml.');
    process.exit(0);
  }
  
  console.log(`Parsed ${urls.length} URLs from sitemap.`);
  
  const payload = {
    host: domain,
    key: key,
    keyLocation: `https://${domain}/${key}.txt`,
    urlList: urls
  };
  
  const postData = JSON.stringify(payload);
  
  const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  const req = https.request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => {
      responseBody += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 202) {
        console.log(`[SUCCESS] IndexNow submission received by API. Status: ${res.statusCode}`);
      } else {
        console.error(`[ERROR] IndexNow API returned status code ${res.statusCode}: ${responseBody}`);
      }
    });
  });
  
  req.on('error', (e) => {
    console.error(`[ERROR] IndexNow request failed: ${e.message}`);
  });
  
  req.write(postData);
  req.end();
  
} catch (err) {
  console.error(`[ERROR] Failed to execute IndexNow submission: ${err.message}`);
}
