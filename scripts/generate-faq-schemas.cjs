const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getAllHtmlFiles(name, filesList);
    } else if (name.endsWith('.html')) {
      filesList.push(name);
    }
  }
  return filesList;
}

function processHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Regex to match accordion elements with faq-question and faq-answer
  const faqRegex = /class="[^"]*faq-item[^"]*"[\s\S]*?(?:class="[^"]*faq-question[^"]*"[^>]*>([\s\S]*?)<\/button>|class="[^"]*faq-question[^"]*"[^>]*>([\s\S]*?)<\/div>|class="[^"]*faq-question[^"]*"[^>]*>([\s\S]*?)<\/h3>)[\s\S]*?class="[^"]*faq-answer[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
  
  const faqItems = [];
  let match;
  while ((match = faqRegex.exec(content)) !== null) {
    const questionHtml = match[1] || match[2] || match[3];
    const answerHtml = match[4];
    
    if (questionHtml && answerHtml) {
      // Clean HTML tags and normalize whitespace
      const question = questionHtml.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      const answer = answerHtml.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      faqItems.push({ question, answer });
    }
  }
  
  if (faqItems.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
    
    const schemaString = `\n    <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>\n</head>`;
    // Inject before </head> if not already containing FAQPage
    if (!content.includes('"FAQPage"') && content.includes('</head>')) {
      content = content.replace('</head>', schemaString);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[FAQ SCHEMA] Injected ${faqItems.length} FAQ items into ${path.relative(path.join(__dirname, '..'), filePath)}`);
    }
  }
}

const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  const htmlFiles = getAllHtmlFiles(distDir);
  htmlFiles.forEach(processHtmlFile);
  console.log('[FAQ SCHEMA] FAQ schemas automated injection completed.');
} else {
  console.log('[FAQ SCHEMA] dist/ directory not found.');
}
