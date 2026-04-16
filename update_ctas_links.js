const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const PBI_LINK = 'https://www.cautioneo.com/r/?referral_id=1b7fa16f-a353-4ff5-b28a-7b6886318826&kind=lessor&returnUrl=https%3A%2F%2Fpro.cautioneo.com%2Fpbi%2Fstart%2F';
const GLI_LINK = 'https://www.cautioneo.com/r/?referral_id=1b7fa16f-a353-4ff5-b28a-7b6886318826&kind=lessor&returnUrl=https%3A%2F%2Fwww.cautioneo.com%2Fproprietaire%2Fassurance-loyer%2F';

// Espace Client, Sécuriser un loyer, Simulation -> PBI
// Assurance, GLI -> GLI

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');

    // Mettre à jour caut.io/Ffr6hkV en général (ça pointait vers Espace Client ou PBI)
    content = content.replace(/https:\/\/caut\.io\/Ffr6hkV/g, PBI_LINK);

    // Assurance (remplacer les anciens liens si trouvés ou mettre le bon lien PBI/GLI)
    // Au point 3 de patch_final on avait mis : <a href="https://cautioneo.com/?utm_source=checklist_bailleur&utm_medium=seo"...
    content = content.replace(/https:\/\/cautioneo\.com\/\?utm_source=checklist_bailleur&utm_medium=seo/g, GLI_LINK);

    // Mettez à jour les boutons qui disaient "Découvrir l'Assurance Cautioneo" pointant vers comparatif-gli pour qu'ils pointent vers la vraie assurance ? 
    // l'utilisateur a dit "tu mets les liens que je vais te donner [..] le lien tracké qui mène vers la page Assurance Loyers impayés (si besoin)" 
    // Je vais laisser comparatif-gli tel quel, car c'est une page d'A/B test ou du portal interne. Sauf si le href est "comparatif-gli" et le texte est "Découvrir l'Assurance Cautioneo"? "Lien tracké" implies external.

    // Guide anti-fraude: Enlever simulateur et mettre bouton unique.
    if (file === 'guide-anti-fraude.html') {
        const simulatorRegex = /<!-- Innovation : Scanner d'Authenticité -->[\s\S]*?<a href="scanner-demo"[^>]*>Tester le Scanner interactif<\/a>[\s\S]*?<\/div>/;
        const replaceAntiFraude = `<!-- Délégation Certification -->
            <div class="mt-48 p-40 bg-dark text-white border-radius-20 text-center" data-reveal="fade-up">
                <div class="badge badge-accent mb-16">Délégation Garantie</div>
                <h2 class="text-3xl mb-16">Ne prenez plus ce risque seul</h2>
                <p class="text-lg opacity-80 mb-32 max-w-700 mx-auto">Notre technologie certifie automatiquement l'authenticité des dossiers locataires. Protégez-vous des documents falsifiés en 1 seul clic.</p>
                <a href="${PBI_LINK}" target="_blank" class="btn btn-primary">Je délègue la certification du dossier locataire à Cautioneo</a>
            </div>`;
        content = content.replace(simulatorRegex, replaceAntiFraude);
        // Aussi l'autre lien "Découvrir l'Assurance Cautioneo"
        content = content.replace(/href="comparatif-gli" class="btn btn-white">Découvrir l'Assurance Cautioneo/g, `href="${GLI_LINK}" target="_blank" class="btn btn-white">Découvrir l'Assurance Cautioneo`);
    }

    fs.writeFileSync(path.join(dir, file), content, 'utf8');
});

// Update build-glossary.js as well
const jsPath = path.join(dir, 'build-glossary.js');
let jsContent = fs.readFileSync(jsPath, 'utf8');
jsContent = jsContent.replace(/https:\/\/caut\.io\/Ffr6hkV/g, PBI_LINK);
fs.writeFileSync(jsPath, jsContent, 'utf8');

console.log("Global CTAs updated.");
