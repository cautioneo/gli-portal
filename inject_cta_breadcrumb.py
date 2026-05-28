#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script d'injection CTA Sticky + BreadcrumbList JSON-LD dans tous les articles existants.
"""

import os
import re

BLOG_DIR = r"C:\Users\OussamaElAmel\.gemini\antigravity\scratch\cautioneo-gli"
EXCLUDE_FILES = {"index.html", "blog.html"}

CTA_STICKY = '''<!-- CTA Sticky -->
<div class="sticky-cta" id="sticky-cta">
  <div class="sticky-cta-content">
    <span class="sticky-cta-text">🏠 Protégez vos loyers avec la GLI Cautioneo</span>
    <a href="https://app.cautioneo.com" class="sticky-cta-btn" target="_blank" rel="noopener">Obtenir un devis →</a>
  </div>
  <button class="sticky-cta-close" onclick="document.getElementById('sticky-cta').style.display='none'">✕</button>
</div>
<style>
.sticky-cta { position: fixed; bottom: 0; left: 0; right: 0; background: linear-gradient(135deg, #b45309, #92400e); color: white; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; z-index: 9999; box-shadow: 0 -4px 20px rgba(180,83,9,0.4); animation: slideUp 0.5s ease; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.sticky-cta-content { display: flex; align-items: center; gap: 20px; flex: 1; }
.sticky-cta-text { font-size: 0.95rem; font-weight: 600; }
.sticky-cta-btn { background: white; color: #b45309; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; text-decoration: none; transition: all 0.2s; white-space: nowrap; }
.sticky-cta-btn:hover { background: #fffbeb; transform: scale(1.03); }
.sticky-cta-close { background: none; border: none; color: rgba(255,255,255,0.7); font-size: 1.2rem; cursor: pointer; padding: 4px 8px; }
@media (max-width: 640px) { .sticky-cta-text { display: none; } }
</style>'''

def get_slug(filename):
    """Retourne le slug complet pour un fichier HTML."""
    name = filename.replace(".html", "")
    if name.startswith("blog-assurance-loyer-impaye-"):
        return f"blog/{name}"
    else:
        return f"blog/{name}"

def get_page_title(content, filename):
    """Extrait le titre H1 de la page."""
    match = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.DOTALL | re.IGNORECASE)
    if match:
        title = re.sub(r'<[^>]+>', '', match.group(1)).strip()
        return title
    # Fallback sur le title tag
    match = re.search(r'<title>(.*?)</title>', content, re.DOTALL | re.IGNORECASE)
    if match:
        return re.sub(r'<[^>]+>', '', match.group(1)).strip()
    return filename.replace(".html", "")

def build_breadcrumb(title, slug):
    """Construit le JSON-LD BreadcrumbList."""
    return f'''<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {{"@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://cautioneo-gli.com"}},
    {{"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://cautioneo-gli.com/blog"}},
    {{"@type": "ListItem", "position": 3, "name": "{title}", "item": "https://cautioneo-gli.com/{slug}"}}
  ]
}}
</script>'''

def inject_file(filepath, filename):
    """Injecte le CTA et le BreadcrumbList dans un fichier HTML."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False
    slug = get_slug(filename)

    # --- Injection BreadcrumbList ---
    if 'BreadcrumbList' not in content:
        title = get_page_title(content, filename)
        breadcrumb = build_breadcrumb(title, slug)

        # Trouver la fin du bloc JSON-LD Article ou juste avant </head>
        # On cherche la fermeture du dernier </script> dans le head, avant </head>
        head_end = content.find('</head>')
        if head_end == -1:
            print(f"  [WARN] Pas de </head> trouvé dans {filename}, skip breadcrumb.")
        else:
            # Insérer juste avant </head>
            content = content[:head_end] + "\n    " + breadcrumb + "\n" + content[head_end:]
            print(f"  [OK] BreadcrumbList injecté dans {filename}")
            modified = True
    else:
        print(f"  [SKIP] BreadcrumbList déjà présent dans {filename}")

    # --- Injection CTA Sticky ---
    if 'sticky-cta' not in content:
        body_end = content.rfind('</body>')
        if body_end == -1:
            print(f"  [WARN] Pas de </body> trouvé dans {filename}, skip CTA.")
        else:
            content = content[:body_end] + "\n" + CTA_STICKY + "\n" + content[body_end:]
            print(f"  [OK] CTA Sticky injecté dans {filename}")
            modified = True
    else:
        print(f"  [SKIP] CTA Sticky déjà présent dans {filename}")

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    print("=" * 60)
    print("INJECTION CTA STICKY + BREADCRUMBLIST")
    print("=" * 60)
    
    html_files = [
        f for f in os.listdir(BLOG_DIR)
        if f.endswith('.html') and f not in EXCLUDE_FILES
    ]
    
    html_files.sort()
    total = 0
    modified = 0
    
    for filename in html_files:
        filepath = os.path.join(BLOG_DIR, filename)
        print(f"\n[{filename}]")
        total += 1
        if inject_file(filepath, filename):
            modified += 1
    
    print("\n" + "=" * 60)
    print(f"TERMINÉ : {total} fichiers analysés, {modified} fichiers modifiés.")
    print("=" * 60)

if __name__ == "__main__":
    main()
