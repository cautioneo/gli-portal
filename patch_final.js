const fs = require('fs');
const path = require('path');

const dir = './';

function replaceInFile(file, regex, replacement) {
    const fPath = path.join(dir, file);
    if (fs.existsSync(fPath)) {
        let content = fs.readFileSync(fPath, 'utf8');
        content = content.replace(regex, replacement);
        fs.writeFileSync(fPath, content, 'utf8');
        console.log(`Patched ${file}`);
    }
}

// 1. Simulateurs
replaceInFile(
    'simulateurs.html', 
    />Estimation Prime Mensuelle</g, 
    '>Estimation Prime Mensuelle / Annuelle ou Trimestrielle<'
);

// 2. Checklist Accord
let checklistContent = fs.readFileSync(path.join(dir, 'checklist-bailleur.html'), 'utf8');
const accordRegex = /<div class="checklist-item">\s*<div class="checklist-check"><\/div>\s*<span>Demander l'Accord de Garantie Cautioneo au candidat<\/span>\s*<\/div>/g;
checklistContent = checklistContent.replace(accordRegex, '');

// 3. Checklist CTA
const ctaRegex = /<div class="mt-40 p-24 bg-light border-radius-12 text-center btn-no-print">[\s\S]*?<\/div>/g;
const newCta = `<div class="mt-40 p-32 bg-primary border-radius-20 text-center btn-no-print">
                    <p class="font-600 mb-16 text-white text-lg">Déléguez la sécurisation de vos revenus locatifs à 100%.</p>
                    <a href="https://cautioneo.com/?utm_source=checklist_bailleur&utm_medium=seo" target="_blank" class="btn btn-white text-primary mt-8 border-radius-pill font-600">Découvrir la Protection Cautioneo</a>
                </div>`;
checklistContent = checklistContent.replace(ctaRegex, newCta);
fs.writeFileSync(path.join(dir, 'checklist-bailleur.html'), checklistContent, 'utf8');
console.log('Patched checklist-bailleur.html');

// 4. Guides Banners
const guides = ['guide-regime-reel.html', 'guide-micro-foncier.html'];
guides.forEach(guide => {
    let content = fs.readFileSync(path.join(dir, guide), 'utf8');
    
    content = content.replace(/<div class="cta-banner" data-reveal="fade-up">/g, '<div class="cta-banner bg-primary text-white p-40 border-radius-20" data-reveal="fade-up">');
    content = content.replace(/<div class="badge mb-16">Le saviez-vous \?<\/div>/g, '<div class="badge bg-white text-primary mb-16 font-800" style="background: white; color: var(--primary);">LE SAVIEZ-VOUS ?</div>');
    content = content.replace(/<h3>(.*?)<\/h3>/g, '<h3 class="text-white">$1</h3>');
    content = content.replace(/<p>(.*?)<\/p>/g, '<p class="opacity-90">$1</p>');
    content = content.replace(/class="btn btn-primary"/g, 'class="btn btn-white text-primary font-600 border-radius-pill"');

    fs.writeFileSync(path.join(dir, guide), content, 'utf8');
    console.log(`Patched banner in ${guide}`);
});
