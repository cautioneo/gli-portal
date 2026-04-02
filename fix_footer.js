const fs = require('fs');
const path = require('path');

const directory = './'; // Current Dir
const htmlFiles = fs.readdirSync(directory).filter(f => f.endsWith('.html'));

const oldFooterLogoRegex = /<div class="logo footer-logo">Cautioneo <span>Bailleurs<\/span><\/div>/g;
const newFooterLogo = `<div class="logo-wrapper mb-16" style="flex: none; gap: 8px;">
                        <img src="logo.png" alt="Cautioneo" class="header-logo" style="filter: brightness(0) invert(1);">
                        <span class="logo-text" style="color: white; font-size: 1.6rem;">Bailleurs</span>
                    </div>`;

let count = 0;
htmlFiles.forEach(file => {
    let content = fs.readFileSync(path.join(directory, file), 'utf8');
    if (oldFooterLogoRegex.test(content)) {
        content = content.replace(oldFooterLogoRegex, newFooterLogo);
        fs.writeFileSync(path.join(directory, file), content);
        count++;
    }
});

console.log("Global Footer Logo Update Completed on " + count + " files.");
