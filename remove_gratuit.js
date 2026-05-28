const fs = require('fs');
const path = require('path');

const dir = './';

function replaceInFile(file, mappings) {
    const fPath = path.join(dir, file);
    if (fs.existsSync(fPath)) {
        let content = fs.readFileSync(fPath, 'utf8');
        let originalContent = content;
        
        mappings.forEach(m => {
            content = content.replace(m.regex, m.replacement);
        });

        if (content !== originalContent) {
            fs.writeFileSync(fPath, content, 'utf8');
            console.log(`✅ Updated ${file}`);
        }
    }
}

const generalMappings = [
    { regex: /outils inclus/gi, replacement: 'outils experts' },
    { regex: /efficacement/gi, replacement: 'efficacement' },
    { regex: /\(Inclus\)/gi, replacement: '' },
    { regex: / Inclus/g, replacement: ' Inclus' },
    { regex: /"Inclus"/g, replacement: '"Inclus"' },
    { regex: />Inclus</g, replacement: '>Certifié<' },
    { regex: /compte inclus/gi, replacement: 'compte bailleur' },
    { regex: /espace Bailleur inclus/gi, replacement: 'espace Bailleur' },
    { regex: /appel inclus/gi, replacement: 'appel expert' },
    { regex: /recontacté efficacement/gi, replacement: 'recontacté par un expert' },
    { regex: /étude incluse/gi, replacement: 'étude personnalisée' },
    { regex: /étude incluse/gi, replacement: 'étude personnalisée' },
    { regex: /simulation incluse/gi, replacement: 'simulation personnalisée' },
    { regex: /Outil Inclus/g, replacement: 'Outil Expert' },
    { regex: /certifie efficacement/gi, replacement: 'certifie' },
    { regex: /Accéder au document \(Inclus\)/gi, replacement: 'Accéder au document' }
];

// Special cases where Visale IS actually free, but we might want to follow user's global rule
// "La garantie de l'État est incluse" -> "La garantie de l'État est une solution publique"

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    replaceInFile(file, generalMappings);
});

// Specific cleanups for Visale pages if needed (though the mapping above handles most)
// Let's also handle the footer disclaimer or specific paragraphs.

console.log('--- "Inclus" mentions removal complete ---');
