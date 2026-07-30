import fs from 'fs';

const host = process.argv[2];
const key = process.argv[3];
const keyLocation = process.argv[4];

if (!host || !key || !keyLocation) {
  console.warn("Usage: node ping-indexnow.js <host> <key> <keyLocation>");
  process.exit(0);
}

try {
  const sitemapPath = 'dist/sitemap.xml';
  if (!fs.existsSync(sitemapPath)) {
    console.warn(`Sitemap not found at ${sitemapPath}`);
    process.exit(0);
  }

  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const urls = [...sitemap.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map(m => m[1]);

  if (urls.length === 0) {
    console.warn("No URLs found in sitemap.");
    process.exit(0);
  }

  console.log(`Extracted ${urls.length} URLs from sitemap. Pinging IndexNow...`);

  const payload = {
    host,
    key,
    keyLocation,
    urlList: urls
  };

  const response = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    console.log(`Successfully pinged IndexNow for ${host}. Status: ${response.status}`);
  } else {
    const text = await response.text();
    console.warn(`[NON-BLOCKING WARNING] IndexNow returned status: ${response.status}. Response: ${text}`);
  }
} catch (err) {
  console.warn("[NON-BLOCKING WARNING] Error pinging IndexNow:", err.message);
}
