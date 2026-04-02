const fs = require('fs');
const path = require('path');

const directory = './'; // Current Dir
const htmlFiles = fs.readdirSync(directory).filter(f => f.endsWith('.html'));

const finalFooter = `    <!-- Footer Partagé Riche -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col" style="grid-column: span 2;">
                    <div class="logo" style="color: white; margin-bottom: 16px;">Cautioneo <span>Bailleurs</span></div>
                    <p style="color: var(--primary-light); max-width: 400px; font-size: 1.05rem;">La plateforme de référence pour sécuriser, optimiser et simplifier la gestion de vos investissements locatifs. Protégez vos loyers en toute sérénité.</p>
                </div>
                <div class="footer-col">
                    <h4>Ressources</h4>
                    <ul class="footer-links">
                        <li><a href="procedures.html">Guide des Procédures</a></li>
                        <li><a href="fiscalite.html">Fiscalité Immobilière</a></li>
                        <li><a href="comparatif-gli.html">Comparatif Garanties</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Outils</h4>
                    <ul class="footer-links">
                        <li><a href="simulateurs.html">Simulateur Rentabilité</a></li>
                        <li><a href="simulateurs.html">Estimateur GLI</a></li>
                        <li><a href="index.html#solvabilite">Testeur de Solvabilité</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Informations Légales</h4>
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

htmlFiles.forEach(file => {
    let content = fs.readFileSync(path.join(directory, file), 'utf8');
    // More flexible regex to catch footer with or without styles/classes
    const footerRegex = /<footer[^>]*class="footer"[^>]*>[\s\S]*?<\/footer>/;
    if (footerRegex.test(content)) {
        content = content.replace(footerRegex, finalFooter);
        fs.writeFileSync(path.join(directory, file), content);
        console.log(`Updated Footer (Flex Regex): ${file}`);
    } else {
        console.log(`Footer NOT found in: ${file}`);
    }
});

console.log("Global Footer Update (4 columns) Completed.");
