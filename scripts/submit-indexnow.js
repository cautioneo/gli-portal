import fs from 'fs';
import path from 'path';
import https from 'https';
import crypto from 'crypto';

const domain = 'cautioneo-gli.com';
const key = '0a9cc6ed73475430ea32c09c7171765f';
const sitemapPath = path.resolve('./dist/sitemap.xml');
const cachePath = path.resolve('./scripts/.sitemap-cache.json');

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

function getFileHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

function urlToFilePath(url, domain, distDir) {
  let relUrl = url.replace(`https://${domain}`, '').trim();
  if (relUrl.startsWith('/')) {
    relUrl = relUrl.substring(1);
  }
  
  let targetPath = path.join(distDir, relUrl);
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
    return targetPath;
  }
  
  const indexPath = path.join(distDir, relUrl, 'index.html');
  if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
    return indexPath;
  }

  const directHtmlPath = path.join(distDir, relUrl + '.html');
  if (fs.existsSync(directHtmlPath) && fs.statSync(directHtmlPath).isFile()) {
    return directHtmlPath;
  }

  if (relUrl === '') {
    const rootIndex = path.join(distDir, 'index.html');
    if (fs.existsSync(rootIndex) && fs.statSync(rootIndex).isFile()) {
      return rootIndex;
    }
  }

  return null;
}

try {
  const xmlContent = fs.readFileSync(sitemapPath, 'utf-8');
  const allUrls = extractUrlsFromSitemap(xmlContent);
  
  if (allUrls.length === 0) {
    console.log('[SKIP] No URLs found in sitemap.xml.');
    process.exit(0);
  }

  // Load previous cache
  let cache = {};
  if (fs.existsSync(cachePath)) {
    try {
      cache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
    } catch (e) {
      cache = {};
    }
  }

  const newCache = {};
  const urlsToSubmit = [];
  const distDir = path.resolve('./dist');

  allUrls.forEach(url => {
    const filePath = urlToFilePath(url, domain, distDir);
    let hash = null;
    if (filePath) {
      hash = getFileHash(filePath);
    }

    if (hash) {
      newCache[url] = hash;
      const cachedHash = cache[url];
      
      // If not cached, or hash differs, it's new/modified
      if (!cachedHash || cachedHash !== hash) {
        urlsToSubmit.push(url);
      }
    } else {
      // Fallback: if we can't map it, assume it is changed/new
      urlsToSubmit.push(url);
    }
  });

  // Save updated cache
  fs.writeFileSync(cachePath, JSON.stringify(newCache, null, 2), 'utf-8');

  // Check if force parameter is provided
  const forceSubmit = process.argv.includes('--force');

  const finalUrls = forceSubmit ? allUrls : urlsToSubmit;

  if (finalUrls.length === 0) {
    console.log('[SKIP] 0 pages modified since last build. Bypassing IndexNow.');
    process.exit(0);
  }

  console.log(`Submitting ${finalUrls.length} new/modified URLs to IndexNow (out of ${allUrls.length} total)...`);
  if (forceSubmit) {
    console.log('(Forced submission of all URLs)');
  } else {
    finalUrls.forEach(u => console.log(`  -> ${u}`));
  }

  const payload = {
    host: domain,
    key: key,
    keyLocation: `https://${domain}/${key}.txt`,
    urlList: finalUrls
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
