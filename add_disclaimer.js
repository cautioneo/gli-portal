const fs = require('fs');
const path = require('path');

const directory = './'; // Current Dir
const htmlFiles = fs.readdirSync(directory).filter(f => f.endsWith('.html'));

const disclaimerHTML = `
            <div class="footer-disclaimer text-sm opacity-70 mb-16 mt-32 text-center" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
                ⚠️ Avertissement : Les informations, modèles et simulateurs présents sur ce site sont mis à disposition à titre indicatif pour accompagner les bailleurs, mais ne remplacent en aucun cas l'avis personnalisé d'un expert juridique, d'un avocat ou d'un notaire.
            </div>
            `;

let count = 0;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(path.join(directory, file), 'utf8');
    
    // We target the `<div class="footer-bottom">` tag
    const targetString = '<div class="footer-bottom">';
    
    // Check if the file has footer-bottom and doesn't already have the disclaimer
    if (content.includes(targetString) && !content.includes('footer-disclaimer')) {
        content = content.replace(targetString, disclaimerHTML + targetString);
        fs.writeFileSync(path.join(directory, file), content);
        count++;
    }
});

console.log(`Disclaimer added to ${count} HTML files.`);

// Also update it in build-glossary.js so future generations include it!
const buildGlossaryPath = path.join(directory, 'build-glossary.js');
const targetString = '<div class="footer-bottom">';
if (fs.existsSync(buildGlossaryPath)) {
    let bgContent = fs.readFileSync(buildGlossaryPath, 'utf8');
    if (bgContent.includes(targetString) && !bgContent.includes('footer-disclaimer')) {
        bgContent = bgContent.replace(targetString, disclaimerHTML + targetString);
        fs.writeFileSync(buildGlossaryPath, bgContent);
        console.log('Disclaimer added to build-glossary.js template.');
    }
}
