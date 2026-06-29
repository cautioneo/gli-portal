import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  console.error("Error: dist directory does not exist. Run npm run build first.");
  process.exit(1);
}

// Get the remote URL from the parent repo
const remoteUrl = execSync('git remote get-url origin').toString().trim();
console.log(`Deploying to remote: ${remoteUrl}`);

// Change directory to dist
process.chdir(distDir);

try {
  // Clean up any existing local git repo in dist
  if (fs.existsSync('.git')) {
    fs.rmSync('.git', { recursive: true, force: true });
  }

  execSync('git init');
  // Configure git user name/email if not set
  try {
    execSync('git config user.name "OussamaSEO"');
    execSync('git config user.email "oussama@cautioneo.com"');
  } catch (e) {
    // Ignore error
  }
  execSync('git checkout -b gh-pages');
  execSync(`git remote add origin ${remoteUrl}`);
  execSync('git add -A');
  execSync('git commit -m "deploy: static site build"');
  
  console.log("Pushing to gh-pages branch...");
  execSync('git push origin gh-pages --force');
  console.log("Deployment successful!");
} catch (err) {
  console.error("Deployment failed:", err.message);
  process.exit(1);
}
