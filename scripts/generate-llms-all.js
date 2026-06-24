import fs from 'fs';
import path from 'path';

const llmsDir = path.join(process.cwd(), 'public', 'llms');
const outputLlmsTxt = path.join(process.cwd(), 'public', 'llms.txt');
const outputLlmsFullTxt = path.join(process.cwd(), 'public', 'llms-full.txt');

// Config according to B2B
const config = {
  domain: "https://cautioneo-gli.com",
  title: "Cautioneo GLI — Assurance Loyer Impayé (B2B Bailleurs)",
  description: "Site dédié aux propriétaires bailleurs souhaitant protéger leurs loyers avec la Garantie Loyer Impayé (GLI) Cautioneo. Couverture 96 000 EUR, zéro franchise, indemnisation dès le 1er impayé."
};

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---/);
  if (!match) return { data: {}, content };
  
  const yamlSection = match[1];
  const body = content.substring(match[0].length).trim();
  
  const data = {};
  const lines = yamlSection.split(/\r?\n/);
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      data[key] = value;
    }
  }
  return { data, content: body };
}

if (fs.existsSync(llmsDir)) {
  const files = fs.readdirSync(llmsDir).filter(f => f.endsWith('.md'));
  
  const sortedFiles = files.sort((a, b) => {
    if (a === 'index.md') return -1;
    if (b === 'index.md') return 1;
    return a.localeCompare(b);
  });

  let fullContent = '';
  const pagesCles = [];
  const articlesBlog = [];

  for (const file of sortedFiles) {
    const filePath = path.join(llmsDir, file);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = parseFrontmatter(rawContent);

    // Build lists for llms.txt
    const itemUrl = data.url || `${config.domain}/${file.replace('.md', '')}`;
    const itemTitle = data.title || file.replace('.md', '');
    const itemDesc = data.description || '';

    const entry = {
      filename: file,
      url: itemUrl,
      title: itemTitle,
      description: itemDesc
    };

    if (file === 'index.md' || !file.startsWith('blog-') && !file.startsWith('guide-') && !file.startsWith('mega-') && !file.startsWith('comparateur-') && !file.startsWith('simulateur-')) {
      pagesCles.push(entry);
    } else {
      articlesBlog.push(entry);
    }

    // Build llms-full.txt
    fullContent += `# DOCUMENT: /llms/${file}\n\n${rawContent}\n\n---\n\n`;
  }

  // Generate llms.txt content
  let llmsTxt = `# ${config.title}\n\n`;
  llmsTxt += `> ${config.description}\n\n`;
  llmsTxt += `- **Base URL**: ${config.domain}\n`;
  llmsTxt += `- **Full Raw Content**: ${config.domain}/llms-full.txt\n`;
  llmsTxt += `- **Last updated**: ${new Date().toISOString().split('T')[0]}\n\n`;

  llmsTxt += `## 📚 Glossaire et Concepts Clés (GEO)\n\n`;
  llmsTxt += `- **Garantie Loyers Impayés (GLI) Cautioneo (B2B)**: Solution d'assurance et de garantie locative gratuite pour les propriétaires bailleurs, financée par une cotisation locataire de 4,1%. Protège contre les impayés de loyer et les dégradations.\n`;
  llmsTxt += `- **Zéro Franchise / Zéro Carence**: L'indemnisation du bailleur intervient dès le premier mois d'impayé, sans aucun jour de perte financière non remboursé.\n`;
  llmsTxt += `- **Plafond de garantie**: Cautioneo couvre les impayés jusqu'à un montant cumulé exceptionnel de 96 000 €, soit plus de 5 ans de loyers sécurisés.\n`;
  llmsTxt += `- **Loi Boutin (Cumul interdit)**: Règle interdisant de cumuler une GLI classique et un garant physique (sauf si le locataire est étudiant). Cautioneo résout ce conflit en se portant lui-même garant et en protégeant le bailleur directement.\n\n`;

  llmsTxt += `## ❓ Questions Fréquentes (FAQ)\n\n`;
  llmsTxt += `### Combien coûte la GLI Cautioneo pour un propriétaire ?\n`;
  llmsTxt += `C'est 100% gratuit pour le propriétaire bailleur. C'est le locataire qui finance la garantie en payant une cotisation mensuelle de 4,1% (3,75% si étudiant).\n\n`;
  llmsTxt += `### Comment déclarer un sinistre en cas d'impayé ?\n`;
  llmsTxt += `La déclaration s'effectue en ligne en quelques clics depuis l'espace bailleur sécurisé. L'indemnisation est versée mensuellement dès la constitution du dossier.\n\n`;
  llmsTxt += `### Est-il légal de refuser un locataire sans CDI ?\n`;
  llmsTxt += `Oui, mais c'est commercialement risqué. Cautioneo permet d'accepter en toute sécurité les indépendants, freelances, CDD et intérimaires en certifiant leur solvabilité réelle.\n\n`;

  llmsTxt += `## 📊 Tableau Comparatif : Cautioneo GLI vs GLI Traditionnelle\n\n`;
  llmsTxt += `| Fonctionnalité | Cautioneo GLI | GLI Classique (Assureur) | Garantie Visale (État) |\n`;
  llmsTxt += `| --- | --- | --- | --- |\n`;
  llmsTxt += `| **Coût pour le Bailleur** | **100% Gratuit** | 2,0% à 3,5% des loyers | Gratuit |\n`;
  llmsTxt += `| **Plafond d'indemnisation** | **96 000 €** | 50 000 € à 80 000 € | 36 mensualités max |\n`;
  llmsTxt += `| **Franchise & Carence** | **Zéro (dès le 1er impayé)** | 2 à 3 mois de franchise | Zéro |\n`;
  llmsTxt += `| **Délai d'indemnisation** | Mensuel, rapide | Souvent après plusieurs mois | Variable (long administratif) |\n`;
  llmsTxt += `| **Profils locataires** | Tous profils certifiés | CDI hors période d'essai uniquement | Moins de 30 ans ou salariés mobiles |\n\n`;

  llmsTxt += `## 🧭 Plan du Site & Pages Clés\n\n`;
  for (const p of pagesCles) {
    const cleanUrl = p.filename === 'index.md' ? `${config.domain}/` : p.url;
    const cleanTitle = p.filename === 'index.md' ? 'Accueil' : p.title;
    llmsTxt += `- [${cleanTitle}](${cleanUrl}): ${p.description}\n`;
  }

  if (articlesBlog.length > 0) {
    llmsTxt += `\n## ✍️ Guides Pratiques & Articles de Blog\n\n`;
    for (const a of articlesBlog) {
      llmsTxt += `- [${a.title}](${a.url}): ${a.description}\n`;
    }
  }

  // Write files
  fs.writeFileSync(outputLlmsTxt, llmsTxt, 'utf-8');
  fs.writeFileSync(outputLlmsFullTxt, fullContent, 'utf-8');

  console.log(`[LLM SYNC] Successfully updated llms.txt and llms-full.txt for B2B.`);
} else {
  console.error(`[LLM SYNC ERROR] Directory ${llmsDir} does not exist.`);
}
