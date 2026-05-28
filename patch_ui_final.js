const fs = require('fs');
const path = require('path');

const dir = './';

function replaceInFile(file, regex, replacement) {
    const fPath = path.join(dir, file);
    if (fs.existsSync(fPath)) {
        let content = fs.readFileSync(fPath, 'utf8');
        content = content.replace(regex, replacement);
        fs.writeFileSync(fPath, content, 'utf8');
        console.log(`✅ Patched ${file}`);
    }
}

// 1. Update Guide Banners
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const guideFiles = htmlFiles.filter(f => f.startsWith('guide-'));

guideFiles.forEach(guide => {
    let content = fs.readFileSync(path.join(dir, guide), 'utf8');
    
    // Skip if already patched (look for bg-primary in cta-banner)
    if (content.includes('cta-banner bg-primary')) {
        console.log(`ℹ️ ${guide} already has premium banner, skipping.`);
        return;
    }

    // Pattern for the old cta-banner
    // <div class="cta-banner" data-reveal="fade-up">
    //    <h3>...</h3>
    //    <p>...</p>
    //    <a href="..." class="btn btn-primary">...</a>
    // </div>
    
    // Replacement:
    // <div class="cta-banner bg-primary text-white p-40 border-radius-20" data-reveal="fade-up">
    //    <h3 class="text-white">...</h3>
    //    <p class="opacity-90">...</p>
    //    <a href="..." class="btn btn-white text-primary font-600 border-radius-pill">...</a>
    // </div>

    content = content.replace(/<div class="cta-banner" data-reveal="fade-up">/g, '<div class="cta-banner bg-primary text-white p-40 border-radius-20" data-reveal="fade-up">');
    
    // We need to be careful with nested tags. Using a simpler approach:
    // This assumes the <h3> and <p> are immediate children as seen in guide-lmnp.html
    const ctaSectionRegex = /<div class="cta-banner bg-primary text-white p-40 border-radius-20" data-reveal="fade-up">([\s\S]*?)<\/div>/g;
    
    content = content.replace(ctaSectionRegex, (match, p1) => {
        let inner = p1;
        inner = inner.replace(/<h3>/g, '<h3 class="text-white">');
        inner = inner.replace(/<p>/g, '<p class="opacity-90">');
        inner = inner.replace(/class="btn btn-primary"/g, 'class="btn btn-white text-primary font-600 border-radius-pill"');
        return `<div class="cta-banner bg-primary text-white p-40 border-radius-20" data-reveal="fade-up">${inner}</div>`;
    });

    fs.writeFileSync(path.join(dir, guide), content, 'utf8');
    console.log(`✅ Patched premium UI in ${guide}`);
});

// 2. Update boite-a-outils.html (Cards UI)
// We already added the Smartloc tool, let's make it look premium.
let toolsContent = fs.readFileSync(path.join(dir, 'boite-a-outils.html'), 'utf8');
// Update all buttons in cards to be pill-shaped
toolsContent = toolsContent.replace(/class="btn btn-outline w-full"/g, 'class="btn btn-outline w-full border-radius-pill"');
toolsContent = toolsContent.replace(/class="btn btn-primary w-full"/g, 'class="btn btn-primary w-full shadow-lg border-radius-pill"');
// Update the header style if needed (already looks okay but let's check spacing)
fs.writeFileSync(path.join(dir, 'boite-a-outils.html'), toolsContent, 'utf8');
console.log('✅ Polished boite-a-outils.html buttons');

// 3. Update CTA boxes in other pages
const otherPages = ['fiscalite.html', 'comparatif-gli.html', 'comparatif-visale.html', 'comparatif-garantme.html', 'glossaire.html'];
otherPages.forEach(page => {
    let content = fs.readFileSync(path.join(dir, page), 'utf8');
    
    // Replace <div class="cta-box" data-reveal="fade-up"> 
    // or <div class="cta-box mt-64" data-reveal="fade-up">
    // with premium style
    content = content.replace(/<div class="cta-box([^"]*)" data-reveal="fade-up">/g, '<div class="cta-box$1 bg-primary text-white p-40 border-radius-20 shadow-lg" data-reveal="fade-up">');
    
    const ctaBoxRegex = /<div class="cta-box([^"]*) bg-primary text-white p-40 border-radius-20 shadow-lg" data-reveal="fade-up">([\s\S]*?)<\/div>/g;
    
    content = content.replace(ctaBoxRegex, (match, extra, p1) => {
        let inner = p1;
        inner = inner.replace(/<h3([^>]*)>/g, '<h3$1 class="text-white">');
        inner = inner.replace(/<p([^>]*)>/g, '<p$1 class="text-white opacity-90">');
        inner = inner.replace(/class="btn btn-white"/g, 'class="btn btn-white text-primary font-600 border-radius-pill"');
        inner = inner.replace(/class="btn btn-primary"/g, 'class="btn btn-white text-primary font-600 border-radius-pill"');
        return `<div class="cta-box${extra} bg-primary text-white p-40 border-radius-20 shadow-lg" data-reveal="fade-up">${inner}</div>`;
    });

    fs.writeFileSync(path.join(dir, page), content, 'utf8');
    console.log(`✅ Patched premium UI in ${page}`);
});

console.log('--- UI/UX Final Patch Complete ---');
