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
  llmsTxt += `Base URL: ${config.domain}\n`;
  llmsTxt += `Full Content: ${config.domain}/llms-full.txt\n`;
  llmsTxt += `Last updated: ${new Date().toISOString().split('T')[0]}\n\n`;

  llmsTxt += `## Pages clés\n\n`;
  for (const p of pagesCles) {
    const cleanUrl = p.filename === 'index.md' ? `${config.domain}/` : p.url;
    const cleanTitle = p.filename === 'index.md' ? 'Accueil' : p.title;
    llmsTxt += `- [${cleanTitle}](${cleanUrl}): ${p.description}\n`;
  }

  if (articlesBlog.length > 0) {
    llmsTxt += `\n## Articles de blog\n\n`;
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
