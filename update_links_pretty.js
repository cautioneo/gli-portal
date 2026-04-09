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

const allHtmlFiles = getAllFiles(rootDir);

allHtmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Replace index.html with ./ (when it's a stand-alone link)
    // Avoid double slashes or breaking anchors
    content = content.replace(/href="index\.html(#.*?)?"/g, 'href="./$1"');
    
    // 2. Replace other .html links with extension-less versions
    // We match href="page.html" or href="sub/page.html"
    // Regex explanation: href=" followed by characters that aren't a quote or space, ending in .html, followed by optional anchor
    content = content.replace(/href="([^" ]+?)\.html(#.*?)?"/g, (match, p1, p2) => {
        // Skip external links (starting with http)
        if (p1.startsWith('http')) return match;
        
        const anchor = p2 || '';
        return `href="${p1}${anchor}"`;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ Pretty URLs: ${file}`);
    }
});

console.log('--- PRETTY URL MIGRATION COMPLETE ---');
