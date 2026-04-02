const fs = require('fs');
const path = require('path');

const directory = './'; // Current Dir
const htmlFiles = fs.readdirSync(directory).filter(f => f.endsWith('.html'));

const standardHeader = `    <nav class="navbar">
        <div class="container nav-container">
            <a href="index.html" class="logo-wrapper">
                <img src="logo.png" alt="Cautioneo" class="header-logo">
                <span class="logo-text">Bailleurs</span>
            </a>
            
            <button class="nav-toggle" aria-label="Ouvrir le menu">
                <i class="fas fa-bars"></i>
            </button>

            <ul class="nav-links">
                <li><a href="procedures.html">Procédures</a></li>
                <li><a href="fiscalite.html">Fiscalité</a></li>
                <li><a href="comparatif-gli.html">Comparatif GLI</a></li>
                <li><a href="simulateurs.html">Simulateurs</a></li>
                <li><a href="boite-a-outils.html">Outils</a></li>
            </ul>
            <div class="nav-actions">
                <a href="https://app.cautioneo.com" class="btn btn-outline nav-btn-client">Espace Client</a>
                <a href="comparatif-gli.html" class="btn btn-primary">Sécuriser un loyer</a>
            </div>
        </div>
    </nav>`;

let count = 0;
htmlFiles.forEach(file => {
    let content = fs.readFileSync(path.join(directory, file), 'utf8');
    const headerRegex = /<nav class="navbar">[\s\S]*?<\/nav>/;
    if (headerRegex.test(content)) {
        content = content.replace(headerRegex, standardHeader);
        fs.writeFileSync(path.join(directory, file), content);
        count++;
    }
});

console.log("Global Header Update Completed on " + count + " files.");
