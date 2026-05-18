const fs = require('fs');

// 1. Update procedures.html
let procContent = fs.readFileSync('procedures.html', 'utf-8');
if (!procContent.includes('id="litiges-recours"')) {
    const etape4Str = `<!-- Étape 4 -->`;
    const etape5Str = `
                        <!-- Étape 5 -->
                        <div class="timeline-item" data-reveal="fade-up" id="litiges-recours">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <div class="badge badge-secondary mb-12" style="margin-top: 64px;">Étape 5 : Litiges & Recours</div>
                                <h2>Faire face aux situations difficiles</h2>
                                <p class="text-muted mb-24">Squat, dégradations, agressivité : les recours légaux du propriétaire.</p>
                                <div class="grid-2-cols">
                                    <div class="card info-card">
                                        <h4 class="mb-8">Loi Anti-Squat</h4>
                                        <p class="text-sm mb-16">Comprendre la procédure express de 48h.</p>
                                        <a href="guide-loi-anti-squat-2026" class="card-link text-sm">Lire le guide</a>
                                    </div>
                                    <div class="card info-card">
                                        <h4 class="mb-8">Recours Dégradations</h4>
                                        <p class="text-sm mb-16">Que faire face aux dégâts constatés après l'état des lieux ?</p>
                                        <a href="guide-recours-degradations-sortie" class="card-link text-sm">Vos recours</a>
                                    </div>
                                </div>
                                <div class="mt-16">
                                    <a href="guide-litiges-locataire" class="text-primary font-600 no-decoration text-sm">&rarr; Locataire agressif ou logement insalubre : Que faire ?</a>
                                </div>
                            </div>
                        </div>
`;
    procContent = procContent.replace('<!-- Étape 4 -->', etape5Str + '\n                        <!-- Étape 4 -->');
    procContent = procContent.replace('<li class="mb-12"><a href="#gestion-impayes"', '<li class="mb-12"><a href="#litiges-recours" class="text-main font-medium">Litiges &amp; Recours</a></li>\n                        <li class="mb-12"><a href="#gestion-impayes"');
    fs.writeFileSync('procedures.html', procContent);
}

// Helper to replace text with link
function addLink(file, textToReplace, linkStr) {
    let content = fs.readFileSync(file, 'utf-8');
    if (content.includes(textToReplace) && !content.includes(linkStr)) {
        content = content.replace(textToReplace, linkStr);
        fs.writeFileSync(file, content);
    }
}

// 2. Add internal links to new guides
addLink('guide-loi-anti-squat-2026.html', 'clause résolutoire du bail', '<a href="glossaire-clause-resolutoire">clause résolutoire du bail</a>');
addLink('guide-loi-anti-squat-2026.html', 'mise en demeure au Préfet', '<a href="procedures">mise en demeure au Préfet</a>');

addLink('guide-litiges-locataire.html', 'troubles anormaux de voisinage', '<a href="blog-loyer-impaye-procedure">troubles anormaux de voisinage</a>');
addLink('guide-litiges-locataire.html', 'expulser un locataire', '<a href="procedures">expulser un locataire</a>');

addLink('guide-caution-solidaire.html', 'location vide', '<a href="guide-micro-foncier">location vide</a>');
addLink('guide-caution-solidaire.html', 'colocation', '<a href="blog-coliving-sous-location">colocation</a>');
addLink('guide-caution-solidaire.html', 'GLI inversée', '<a href="comparatif-gli">GLI inversée</a>');

addLink('guide-location-sans-garant.html', 'assurances loyers impayés (GLI) classiques', '<a href="comparatif-gli">assurances loyers impayés (GLI) classiques</a>');
addLink('guide-location-sans-garant.html', 'Garantie Visale', '<a href="comparatif-visale">Garantie Visale</a>');

addLink('guide-recours-degradations-sortie.html', 'dépôt de garantie', '<a href="glossaire-depot-garantie">dépôt de garantie</a>');
addLink('guide-recours-degradations-sortie.html', 'état des lieux de sortie signé par le locataire', '<a href="guide-etat-des-lieux">état des lieux de sortie signé par le locataire</a>');

console.log("Internal links updated");
