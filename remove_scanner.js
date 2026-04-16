const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'scanner-demo.html');
let content = fs.readFileSync(file, 'utf8');

const replacementBlock = `                <div class="mt-48 p-40 bg-dark text-white border-radius-20 text-center" data-reveal="fade-up">
                    <div class="badge badge-accent mb-16">Délégation Garantie</div>
                    <h2 class="text-3xl mb-16">Ne prenez plus ce risque seul</h2>
                    <p class="text-lg opacity-80 mb-32 max-w-700 mx-auto">Notre technologie certifie automatiquement l'authenticité des dossiers locataires. Protégez-vous des documents falsifiés en 1 seul clic.</p>
                    <a href="https://www.cautioneo.com/r/?referral_id=1b7fa16f-a353-4ff5-b28a-7b6886318826&kind=lessor&returnUrl=https%3A%2F%2Fpro.cautioneo.com%2Fpbi%2Fstart%2F" target="_blank" class="btn btn-primary">Je délègue la certification du dossier locataire à Cautioneo</a>
                </div>`;

const scannerContainerRegex = /<div class="scanner-container" id="scanner-wrapper">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
content = content.replace(scannerContainerRegex, replacementBlock + '\n            </div>\n        </section>');

const scriptRegex = /<script>\s*document\.addEventListener\('DOMContentLoaded', \(\) => {[\s\S]*?<\/script>/;
content = content.replace(scriptRegex, '');

fs.writeFileSync(file, content, 'utf8');
console.log("Scanner removed and replaced by single CTA");
