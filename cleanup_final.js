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
            if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const allFiles = getAllFiles(rootDir);

allFiles.forEach(file => {
    // Skip the script itself
    if (file.includes('cleanup_final.js')) return;

    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Aggressive brute-force replacements
    // Handle the (Gratuit) and (Gratuite) case
    content = content.replace(/\(Gratuit(e|s|es)?\)/gi, '');
    
    // Handle "gratuitement"
    content = content.replace(/gratuitement/gi, 'efficacement');
    content = content.replace(/Gratuitement/g, 'Directement');

    // Handle "gratuit", "gratuite", etc.
    // We try to be smart about what we replace it with
    content = content.replace(/\bgratuit(s)?\b/gi, (match) => match[0] === 'G' ? 'Inclus' : 'inclus');
    content = content.replace(/\bgratuite(s)?\b/gi, (match) => match[0] === 'G' ? 'Incluse' : 'incluse');
    
    // Handle "offert", "offerte"
    content = content.replace(/\boffert(s)?\b/gi, (match) => match[0] === 'O' ? 'Inclus' : 'inclus');
    content = content.replace(/\bofferte(s)?\b/gi, (match) => match[0] === 'O' ? 'Incluse' : 'incluse');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ Cleaned: ${file}`);
    }
});

console.log('--- BRUTE FORCE CLEANUP COMPLETE ---');
