const fs = require('fs');

const filesToFix = [
    'blog-gli-vs-garant.html',
    'blog-louer-sans-garant.html',
    'blog-rassurer-proprietaire.html'
];

const PBI_LINK = 'https://www.cautioneo.com/r/?referral_id=1b7fa16f-a353-4ff5-b28a-7b6886318826&kind=lessor&returnUrl=https%3A%2F%2Fpro.cautioneo.com%2Fpbi%2Fstart%2F';

filesToFix.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Remplacer tous les href="#" par le lien tracké PBI
        content = content.replace(/href="#"/g, `href="${PBI_LINK}" target="_blank"`);
        
        fs.writeFileSync(file, content);
        console.log(`CTAs trackés ajoutés à : ${file}`);
    }
});
console.log("Terminé !");
