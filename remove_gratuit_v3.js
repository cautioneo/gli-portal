const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/OussamaElAmel/.gemini/antigravity/scratch/';

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.html')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const mappings = [
    { regex: /étude incluse/gi, replacement: 'étude personnalisée' },
    { regex: /étude incluse/gi, replacement: 'étude personnalisée' },
    { regex: /simulation incluse/gi, replacement: 'simulation experte' },
    { regex: /simulation incluse/gi, replacement: 'simulation personnalisée' },
    { regex: /Audit Inclus/gi, replacement: 'Audit Expert' },
    { regex: /Audit initial([^<]+)inclus/gi, replacement: 'Audit initial$1inclus' },
    { regex: /"Inclus"/g, replacement: '"Certifié"' },
    { regex: /\(Inclus\)/gi, replacement: '' },
    { regex: /efficacement/g, replacement: 'Directement' },
    { regex: /efficacement/g, replacement: 'efficacement' },
    { regex: />Inclus</g, replacement: '>Certifié<' },
    { regex: />Incluse</g, replacement: '>Incluse<' },
    { regex: /outils inclus/gi, replacement: 'outils experts' },
    { regex: /compte inclus/gi, replacement: 'compte bailleur' },
    { regex: /espace Bailleur inclus/gi, replacement: 'espace Bailleur' },
    { regex: /appel inclus/gi, replacement: 'appel expert' },
    { regex: /recontacté efficacement/gi, replacement: 'recontacté par un expert' },
    { regex: /Outil Inclus/g, replacement: 'Outil Expert' },
    { regex: /Testeur de Solvabilité([^<]+)inclus/gi, replacement: 'Testeur de Solvabilité$1expert' },
    { regex: /c'est inclus/gi, replacement: 'c\'est inclus' },
    { regex: /vraie inclusé/gi, replacement: 'solution' },
    { regex: /entièrement incluse/gi, replacement: 'solution certifiée' },
    { regex: /Totalement incluse/gi, replacement: 'Solution certifiée' },
    { regex: /incluse et sans engagement/gi, replacement: 'expert et sans engagement' },
    { regex: /Inclus et sans engagement/gi, replacement: 'Expert et sans engagement' },
    { regex: /Simulation Incluse/gi, replacement: 'Simulation Experte' }
];

const allHtmlFiles = getAllFiles(rootDir);

allHtmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    mappings.forEach(m => {
        content = content.replace(m.regex, m.replacement);
    });

    // Final catch-all for any missed "inclus" in text nodes or spans
    // This is riskier but necessary given the user's frustration
    // content = content.replace(/\bgratuit(s|e|es)?\b/gi, 'expert$1');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ Fully Patched: ${file}`);
    }
});

console.log('--- GLOBAL COMPLIANCE PATCH COMPLETE ---');
