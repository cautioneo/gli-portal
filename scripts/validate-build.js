import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');

function getFilesRecursively(dir, extension, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.astro') {
        getFilesRecursively(filePath, extension, filesList);
      }
    } else if (file.endsWith(extension)) {
      filesList.push(filePath);
    }
  }
  return filesList;
}

function checkLocalLink(currentFilePath, linkUrl) {
  // 1. Clean query params and hash anchors
  const urlWithoutHash = linkUrl.split('#')[0].split('?')[0].trim();
  if (!urlWithoutHash) return true; // It was just an anchor like "#" or "#section"

  // 2. Ignore external or non-http links
  if (/^(https?:|mailto:|tel:|javascript:|sms:|data:)/i.test(urlWithoutHash)) {
    return true;
  }

  // 3. Resolve absolute vs relative
  let targetPath;
  if (urlWithoutHash.startsWith('/')) {
    // Relative to distDir
    targetPath = path.join(distDir, urlWithoutHash.substring(1));
  } else {
    // Relative to the current HTML file's folder
    const currentDir = path.dirname(currentFilePath);
    targetPath = path.join(currentDir, urlWithoutHash);
  }

  // Normalize targetPath
  targetPath = path.normalize(targetPath);

  // 4. Check if the path exists in any of the common formats:
  // a) The exact file path exists (e.g. for images, CSS, JS, or direct html files)
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
    return true;
  }
  // b) It's a directory containing index.html (clean URL /blog-post -> /blog-post/index.html)
  const indexPath = path.join(targetPath, 'index.html');
  if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
    return true;
  }
  // c) The path + ".html" exists (another clean URL style, or direct file reference without extension)
  const htmlPath = targetPath + '.html';
  if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
    return true;
  }

  return false;
}

function checkHtmlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(distDir, filePath);
  const errors = [];
  const warnings = [];

  // Exclude 404 page from some strict rules
  const is404 = relativePath.includes('404.html');

  // Rule 1: Single h1 tag
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  if (!is404) {
    if (!h1Matches) {
      errors.push(`Missing <h1> tag.`);
    } else if (h1Matches.length > 1) {
      errors.push(`Multiple <h1> tags found (${h1Matches.length}).`);
    }
  }

  // Rule 2: Title tag presence and length
  const titleMatch = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!titleMatch) {
    errors.push(`Missing <title> tag.`);
  } else {
    const titleText = titleMatch[1].trim();
    if (titleText.length < 10 || titleText.length > 80) {
      warnings.push(`Title length is sub-optimal (${titleText.length} chars: "${titleText}"). Recommend 10-75 chars.`);
    }
  }

  // Rule 3: Meta description presence and length
  const metaTags = content.match(/<meta\s+[^>]*>/gi) || [];
  let descText = null;
  for (const tag of metaTags) {
    const nameMatch = tag.match(/name=["']description["']/i);
    if (nameMatch) {
      const contentAttrMatch = tag.match(/content=(?:"([^"]*)"|'([^']*)')/i);
      if (contentAttrMatch) {
        descText = contentAttrMatch[1] || contentAttrMatch[2] || "";
        break;
      }
    }
  }

  if (descText === null) {
    errors.push(`Missing <meta name="description"> tag.`);
  } else {
    descText = descText.trim();
    if (descText.length < 40 || descText.length > 170) {
      warnings.push(`Description length is sub-optimal (${descText.length} chars). Recommend 50-160 chars.`);
    }
  }

  // Rule 4: Canonical tag presence and count
  const canonicalMatches = content.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi);
  if (!canonicalMatches) {
    errors.push(`Missing <link rel="canonical"> tag.`);
  } else if (canonicalMatches.length > 1) {
    errors.push(`Multiple <link rel="canonical"> tags found.`);
  }

  // Rule 5: Images alt attributes and Core Web Vitals checks
  const imgMatches = content.match(/<img\s+[^>]*>/gi) || [];
  for (const img of imgMatches) {
    // 5a. Check Alt attribute
    if (!/alt=["']/i.test(img)) {
      warnings.push(`Image missing alt attribute: ${img.substring(0, 80)}...`);
    }
    // 5b. Check explicit dimensions (CLS prevention)
    const hasWidth = /width=["']/i.test(img);
    const hasHeight = /height=["']/i.test(img);
    if (!hasWidth || !hasHeight) {
      warnings.push(`Image missing explicit dimensions (width/height) to prevent CLS: ${img.substring(0, 80)}...`);
    }
    // 5c. Check loading="lazy" (LCP/Speed)
    const hasLazy = /loading=["']lazy["']/i.test(img);
    if (!hasLazy && !img.includes('logo') && !img.includes('hero') && !img.includes('favicon')) {
      warnings.push(`Image missing loading="lazy" attribute for performance: ${img.substring(0, 80)}...`);
    }
  }

  // Rule 6: JSON-LD structured data presence and syntax validation
  const jsonLdBlocks = content.match(/<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  if (!is404 && jsonLdBlocks.length === 0) {
    warnings.push(`No JSON-LD structured data script found on this page.`);
  }
  for (const block of jsonLdBlocks) {
    const jsonMatch = block.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    if (jsonMatch) {
      const jsonText = jsonMatch[1].trim();
      try {
        const parsed = JSON.parse(jsonText);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (!item['@context']) {
              warnings.push(`JSON-LD item missing '@context' attribute.`);
            }
            if (!item['@type']) {
              warnings.push(`JSON-LD item missing '@type' attribute.`);
            }
          }
        } else {
          if (!parsed['@context']) {
            warnings.push(`JSON-LD structured data missing '@context' attribute.`);
          }
          if (!parsed['@type']) {
            warnings.push(`JSON-LD structured data missing '@type' attribute.`);
          }
        }
      } catch (err) {
        errors.push(`Invalid JSON-LD syntax: ${err.message}`);
      }
    }
  }

  // Rule 7: Specific B2B contrast regression check on `.article-meta` on white background
  // If we find style elements or styles setting the text-muted/meta color to white without a dark wrapper
  if (relativePath.startsWith('blog-') && !relativePath.includes('404.html')) {
    if (content.includes('.article-meta') && /color\s*:\s*rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.7\s*\)\s*!important/gi.test(content)) {
      // White contrast regression detected
      errors.push(`.article-meta style overrides text color to low-contrast white.`);
    }
  }

  // Rule 8: Local Link & Asset Integrity Linter (Broken Link check)
  // 8a. Check all anchor hrefs
  const aMatches = content.matchAll(/<a\s+[^>]*href=["']([^"']*)["']/gi);
  for (const match of aMatches) {
    const href = match[1].trim();
    if (href && !checkLocalLink(filePath, href)) {
      errors.push(`Broken link found: href="${href}"`);
    }
  }

  // 8b. Check all image src attributes
  const imgMatchesAttr = content.matchAll(/<img\s+[^>]*src=["']([^"']*)["']/gi);
  for (const match of imgMatchesAttr) {
    const src = match[1].trim();
    if (src && !checkLocalLink(filePath, src)) {
      errors.push(`Broken image source found: src="${src}"`);
    }
  }

  // 8c. Check all script src attributes
  const scriptMatchesAttr = content.matchAll(/<script\s+[^>]*src=["']([^"']*)["']/gi);
  for (const match of scriptMatchesAttr) {
    const src = match[1].trim();
    if (src && !checkLocalLink(filePath, src)) {
      errors.push(`Broken script source found: src="${src}"`);
    }
  }

  // 8d. Check all link href attributes
  const linkMatchesAttr = content.matchAll(/<link\s+[^>]*href=["']([^"']*)["']/gi);
  for (const match of linkMatchesAttr) {
    const href = match[1].trim();
    if (href && !href.startsWith('//') && !checkLocalLink(filePath, href)) {
      errors.push(`Broken link asset found: href="${href}"`);
    }
  }

  return { errors, warnings };
}

function checkCssFiles(cssFiles) {
  const errors = [];
  const warnings = [];

  for (const file of cssFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(distDir, file);

    // Rule: Accessibility contrast variables check
    if (content.includes('--text-muted') && /--text-muted\s*:\s*#6b7280/i.test(content)) {
      errors.push(`[${relativePath}] --text-muted uses old contrast color #6b7280 instead of WCAG AA compliant #555b66.`);
    }
  }

  return { errors, warnings };
}

function runValidation() {
  console.log(`Starting SEO and Accessibility validation on build directory: ${distDir}`);
  
  if (!fs.existsSync(distDir)) {
    console.error(`Error: Build directory "${distDir}" does not exist. Please run "npm run build" first.`);
    process.exit(1);
  }

  const htmlFiles = getFilesRecursively(distDir, '.html');
  const cssFiles = getFilesRecursively(distDir, '.css');

  console.log(`Found ${htmlFiles.length} HTML files and ${cssFiles.length} CSS files.`);

  let totalErrors = 0;
  let totalWarnings = 0;

  // Validate CSS files
  const cssResult = checkCssFiles(cssFiles);
  if (cssResult.errors.length > 0 || cssResult.warnings.length > 0) {
    console.log(`\n--- CSS Validation ---`);
    for (const err of cssResult.errors) {
      console.error(`❌ ERROR: ${err}`);
      totalErrors++;
    }
    for (const warn of cssResult.warnings) {
      console.warn(`⚠️ WARNING: ${warn}`);
      totalWarnings++;
    }
  }

  // Validate HTML files
  for (const file of htmlFiles) {
    const relativePath = path.relative(distDir, file);
    const { errors, warnings } = checkHtmlFile(file);

    if (errors.length > 0 || warnings.length > 0) {
      console.log(`\n--- ${relativePath} ---`);
      for (const err of errors) {
        console.error(`  ❌ ERROR: ${err}`);
        totalErrors++;
      }
      for (const warn of warnings) {
        console.warn(`  ⚠️ WARNING: ${warn}`);
        totalWarnings++;
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Validation finished: ${totalErrors} errors, ${totalWarnings} warnings.`);
  console.log(`========================================`);

  if (totalErrors > 0) {
    console.error(`❌ Build validation failed due to ${totalErrors} errors.`);
    process.exit(1);
  } else {
    console.log(`✅ Build validation succeeded! Quality requirements satisfied.`);
    process.exit(0);
  }
}

runValidation();
