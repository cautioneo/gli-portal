const fs = require('fs');
const path = require('path');
const directory = './';
const files = fs.readdirSync(directory).filter(f => f.endsWith('.html'));

let linksTo = {}; // linksTo[target] = [sources]
files.forEach(f => {
    linksTo[f] = [];
});

files.forEach(file => {
    const content = fs.readFileSync(path.join(directory, file), 'utf-8');
    const regex = /href=['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        let href = match[1];
        // Ignore external links, mailto, tel, anchors
        if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
            continue;
        }
        // Normalize href
        href = href.split('#')[0].split('?')[0];
        if (href === '' || href === './') href = 'index.html';
        if (!href.endsWith('.html')) href += '.html';
        
        if (linksTo[href] && !linksTo[href].includes(file) && href !== file) {
            linksTo[href].push(file);
        }
    }
});

let orphans = [];
for (let target in linksTo) {
    if (linksTo[target].length === 0 && target !== 'index.html' && target !== '404.html') {
        orphans.push(target);
    }
}

console.log('--- Orphan Pages ---');
console.log(orphans.join('\n'));
