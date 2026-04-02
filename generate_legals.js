const fs = require('fs');
const path = require('path');
// Simple Markdown parser
function parseMarkdown(md) {
    let html = md;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold & Italics
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/_(.*?)_/gim, '<em>$1</em>');
    
    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/<\/li>\n<li>/gim, '</li>\n<li>');
    // Wrap consecutive li tags in ul
    html = html.replace(/(<li>(?:.*?)<\/li>\n?)+/gim, '<ul>$&</ul>');

    // Paragraphs: Any block of text separated by double newlines that isn't already a tag
    let blocks = html.split(/\n\n+/);
    html = blocks.map(block => {
        block = block.trim();
        if (block.startsWith('<') && block.endsWith('>')) return block;
        return '<p>' + block.replace(/\n/g, '<br>') + '</p>';
    }).join('\n');
    
    return html;
}

const filesToProcess = [
    { md: 'terms.md', html: 'cgs.html', title: 'CGS / CGU', desc: "Conditions Générales d'Utilisation" },
    { md: 'concierge.md', html: 'conciergerie.html', title: 'Conciergerie', desc: "Le service Premium de Conciergerie Bailleurs" },
    { md: 'dataprotect.md', html: 'confidentialite.html', title: 'Protection des données', desc: "Politique de confidentialité et protection de vos données personnelles" },
    { md: 'legals.md', html: 'mentions-legales.html', title: 'Mentions Légales', desc: "Informations légales sur l'éditeur du site Cautioneo" },
    { md: 'reclamation.md', html: 'reclamation.html', title: 'Réclamations', desc: "Procédure de traitement de vos réclamations" }
];

function generatePage(title, desc, bodyHtml) {
    const template = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Cautioneo Bailleurs</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
    <style>
        .legal-doc h1, .legal-doc h2, .legal-doc h3, .legal-doc h4 {
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: var(--dark);
        }
        .legal-doc p {
            margin-bottom: 1.2rem;
        }
        .legal-doc ul {
            list-style-type: disc;
            margin-left: 2rem;
            margin-bottom: 1.5rem;
        }
        .legal-doc li {
            margin-bottom: 0.5rem;
        }
        .legal-doc strong {
            font-weight: 600;
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="container nav-container">
            <a href="index.html" class="logo">Cautioneo <span>Bailleurs</span></a>
            <ul class="nav-links">
                <li><a href="procedures.html">Procédures</a></li>
                <li><a href="fiscalite.html">Fiscalité</a></li>
                <li><a href="comparatif-gli.html">Comparatif GLI</a></li>
                <li><a href="simulateurs.html">Simulateurs</a></li>
            </ul>
            <div class="nav-actions">
                <a href="https://caut.io/Ffr6hkV" target="_blank" class="btn btn-outline nav-btn-client">Espace Client</a>
                <a href="comparatif-gli.html" class="btn btn-primary">Sécuriser un loyer</a>
            </div>
        </div>
    </nav>

    <header class="page-hero" data-reveal="fade-up">
        <div class="container">
            <h1>${title}</h1>
            <p>${desc}</p>
        </div>
    </header>

    <section class="section">
        <div class="container">
            <div class="content-body mx-auto max-w-900 line-height-1-8 legal-doc" data-reveal="fade-up">
${bodyHtml}
            </div>
        </div>
    </section>

    <!-- FOOTER_PLACEHOLDER -->
    <script src="script.js"></script>
</body>
</html>`;
    return template;
}

const finalFooter = `    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col footer-brand">
                    <div class="logo footer-logo">Cautioneo <span>Bailleurs</span></div>
                    <p class="footer-tagline">La plateforme de référence pour sécuriser, optimiser et simplifier la gestion de vos investissements locatifs. Protégez vos loyers en toute sérénité.</p>
                    <div class="mt-32">
                        <h4 class="text-white mb-12">Rejoignez la communauté</h4>
                        <form class="newsletter-form">
                            <input type="email" class="newsletter-input" placeholder="votre@email.com" required aria-label="Email Newsletter">
                            <button type="submit" class="newsletter-btn">S'inscrire</button>
                        </form>
                    </div>
                </div>
                <div class="footer-col">
                    <h4>Expertise</h4>
                    <ul class="footer-links">
                        <li><a href="procedures.html">Guide des Procédures</a></li>
                        <li><a href="fiscalite.html">Fiscalité Immobilière</a></li>
                        <li><a href="glossaire.html">Glossaire Juridique</a></li>
                        <li><a href="comparatif-gli.html">Comparatif GLI</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Outils</h4>
                    <ul class="footer-links">
                        <li><a href="simulateurs.html">Simulateur Rentabilité</a></li>
                        <li><a href="simulateurs.html">Estimateur GLI</a></li>
                        <li><a href="index.html#solvabilite">Testeur de Solvabilité</a></li>
                        <li><a href="boite-a-outils.html">Boîte à Outils</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Légal</h4>
                    <ul class="footer-links">
                        <li><a href="mentions-legales.html">Mentions légales</a></li>
                        <li><a href="cgs.html">CGS / CGU</a></li>
                        <li><a href="confidentialite.html">Protection des données</a></li>
                        <li><a href="reclamation.html">Réclamations</a></li>
                        <li><a href="conciergerie.html">Conciergerie</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <div>© 2026 Cautioneo. Tous droits réservés.</div>
            </div>
        </div>
    </footer>`;

// 1. Generate the 5 HTML files from Markdown
filesToProcess.forEach(item => {
    try {
        const mdContent = fs.readFileSync(path.join(__dirname, item.md), 'utf8');
        const htmlBody = parseMarkdown(mdContent);
        let newHtml = generatePage(item.title, item.desc, htmlBody);
        newHtml = newHtml.replace('<!-- FOOTER_PLACEHOLDER -->', finalFooter);
        fs.writeFileSync(path.join(__dirname, item.html), newHtml);
        console.log('Generated ' + item.html + ' from ' + item.md);
    } catch (e) {
        console.error('Error processing ' + item.md + ':', e.message);
    }
});

// 2. Update the footer across ALL html files
const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));
htmlFiles.forEach(file => {
    try {
        let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
        // Replace existing footprint
        const footerRegex = /<footer class="footer">[\s\S]*?<\/footer>/;
        if (footerRegex.test(content)) {
            content = content.replace(footerRegex, finalFooter);
            fs.writeFileSync(path.join(__dirname, file), content);
        }
    } catch (e) {
        console.error('Error updating footer in ' + file + ':', e.message);
    }
});

console.log('All updates complete');
