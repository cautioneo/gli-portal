const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/OussamaElAmel/.gemini/antigravity/scratch/cautioneo seo/portail-bailleurs';

const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const logoTemplate = `<div class="logo-wrapper mb-16" style="flex: none; gap: 8px; display: flex; align-items: center;">
                    <img src="logo.png" alt="Cautioneo" class="header-logo" style="height: 32px; width: auto; filter: drop-shadow(0 0 1px white);">
                    <span class="logo-text" style="color: white; font-size: 1.6rem; font-weight: 700;">Bailleurs</span>
                </div>`;

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the text logo in the footer
    // Look for <div class="logo" style="color: white; margin-bottom: 16px;">Cautioneo <span>Bailleurs</span></div>
    const oldLogoRegex = /<div class="logo" style="color: white; margin-bottom: 16px;">Cautioneo <span>Bailleurs<\/span><\/div>/g;
    
    if (content.match(oldLogoRegex)) {
        content = content.replace(oldLogoRegex, logoTemplate);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated footer logo: ${file}`);
    }
});

console.log('--- FOOTER LOGO UPDATE COMPLETE ---');
