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

// 1. Index margins
replaceInFile(
    'index.html', 
    /class="flex items-center justify-center gap-16 mt-32 mix-flex-wrap"/g, 
    'class="flex items-center justify-center gap-16 mix-flex-wrap" style="margin-top: 80px;"'
);

// 2. Procedures spacing
replaceInFile(
    'procedures.html', 
    /class="badge mb-12">Étape 2 : Sélection<\/div>/g, 
    'class="badge mb-12" style="margin-top: 64px;">Étape 2 : Sélection</div>'
);
replaceInFile(
    'procedures.html', 
    /class="badge mb-12">Étape 3 : Contractualisation<\/div>/g, 
    'class="badge mb-12" style="margin-top: 64px;">Étape 3 : Contractualisation</div>'
);
replaceInFile(
    'procedures.html', 
    /class="badge badge-primary mb-12">Étape 4 : Gestion & Sécurisation<\/div>/g, 
    'class="badge badge-primary mb-12" style="margin-top: 64px;">Étape 4 : Gestion & Sécurisation</div>'
);
