import os, glob

def process_cautioneo_gli():
    pages_dir = r'C:\Users\OussamaElAmel\.gemini\antigravity\scratch\cautioneo-gli\src\pages'
    city_files = glob.glob(os.path.join(pages_dir, 'blog-assurance-loyer-impaye-*.astro'))
    
    count = 0
    for f in city_files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        if 'GLIEligibilityCalculator' in content:
            continue
        
        # 1. Add import
        if '---' in content:
            parts = content.split('---', 2)
            if len(parts) >= 3:
                import_stmt = "\nimport GLIEligibilityCalculator from '../components/GLIEligibilityCalculator.astro';"
                parts[1] = parts[1] + import_stmt
                content = '---'.join(parts)
        
        # 2. Add Component inside article/section
        if '</article>' in content:
            content = content.replace('</article>', '    <GLIEligibilityCalculator />\n</article>', 1)
        elif '</main>' in content:
            content = content.replace('</main>', '    <GLIEligibilityCalculator />\n</main>', 1)
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        count += 1
    
    print(f"[cautioneo-gli] Embedded GLIEligibilityCalculator into {count} city pages.")

process_cautioneo_gli()
