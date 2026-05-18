const fs = require('fs');

const filesToFix = [
    'blog-gli-vs-garant.html',
    'blog-louer-sans-garant.html',
    'blog-rassurer-proprietaire.html'
];

const blogHtml = fs.readFileSync('blog.html', 'utf8');

// Extraire la bonne navbar
const navMatch = blogHtml.match(/<!-- Navigation -->[\s\S]*?<\/nav>/);
if (!navMatch) {
    console.error("Impossible de trouver la navbar dans blog.html");
    process.exit(1);
}
const correctNav = navMatch[0];

// Extraire le bon footer
const footerMatch = blogHtml.match(/<!-- Footer basique B2B -->[\s\S]*?<\/footer>/);
if (!footerMatch) {
    console.error("Impossible de trouver le footer dans blog.html");
    process.exit(1);
}
const correctFooter = footerMatch[0];

filesToFix.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Remplacer le <header>
        content = content.replace(/<header class="navbar">[\s\S]*?<\/header>/, correctNav);
        
        // Remplacer le <footer>
        content = content.replace(/<footer[\s\S]*?<\/footer>/, correctFooter);
        
        fs.writeFileSync(file, content);
        console.log(`Fixé : ${file}`);
    } else {
        console.log(`Fichier non trouvé : ${file}`);
    }
});
console.log("Terminé !");
