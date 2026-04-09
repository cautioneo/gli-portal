const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/OussamaElAmel/.gemini/antigravity/scratch/cautioneo seo/portail-bailleurs';

const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const disclaimer = `            <div class="footer-disclaimer text-sm opacity-70 mb-16 mt-32 text-center" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
                ⚠️ Avertissement : Les informations, modèles et simulateurs présents sur ce site sont mis à disposition à titre indicatif pour accompagner les bailleurs, mais ne remplacent en aucun cas l'avis personnalisé d'un expert juridique, d'un avocat ou d'un notaire.
            </div>`;

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // If disclaimer already exists, skip
    if (content.includes('Avertissement :')) return;

    // Insert before footer-bottom
    if (content.includes('<div class="footer-bottom">')) {
        content = content.replace('<div class="footer-bottom">', disclaimer + '\n            <div class="footer-bottom">');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Restored disclaimer: ${file}`);
    }
});

console.log('--- DISCLAIMER RESTORATION COMPLETE ---');
