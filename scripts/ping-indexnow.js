import fs from 'fs';

const host = process.argv[2];
const key = process.argv[3];
const keyLocation = process.argv[4];

if (!host || !key || !keyLocation) {
  console.error("Usage: node ping-indexnow.js <host> <key> <keyLocation>");
  process.exit(1);
}

try {
  const sitemapPath = 'dist/sitemap.xml';
  if (!fs.existsSync(sitemapPath)) {
    console.error(`Sitemap not found at ${sitemapPath}`);
    process.exit(1);
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
    console.error(`Failed to ping IndexNow. Status: ${response.status}. Response: ${text}`);
    process.exit(1);
  }
} catch (err) {
  console.error("Error pinging IndexNow:", err);
  process.exit(1);
}
