import os
import re

b2b_dir = r"C:\Users\OussamaElAmel\.gemini\antigravity\scratch\cautioneo-gli"
index_path = os.path.join(b2b_dir, "index.html")

# Read index.html
with open(index_path, "r", encoding="utf-8") as f:
    index_content = f.read()

print("--- Links in B2B index.html ---")
# Find links to articles
links = re.findall(r'href=["\']([^"\']+)["\']', index_content)
blog_links = [l for l in links if "blog-" in l or "blog.html" in l]
print(f"Total blog links in index.html: {len(blog_links)}")
for l in blog_links[:10]:
    print(f" - {l}")

# Check one article file for links inside article body
article_path = os.path.join(b2b_dir, "blog-gli-prix-fonctionnement.html")
with open(article_path, "r", encoding="utf-8") as f:
    art_content = f.read()

print("\n--- Links in B2B blog-gli-prix-fonctionnement.html ---")
art_links = re.findall(r'href=["\']([^"\']+)["\']', art_content)
body_links = [l for l in art_links if "blog" in l or "index" in l or "styles" in l]
print(f"Total internal links: {len(body_links)}")
for l in body_links[:15]:
    print(f" - {l}")
