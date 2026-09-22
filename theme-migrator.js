const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'apps/web/src');

const replacements = [
  // Status Success (Emerald)
  { regex: /bg-emerald-500\/20/g, replacement: 'bg-success-bg' },
  { regex: /bg-emerald-500\/10/g, replacement: 'bg-success-bg' },
  { regex: /text-emerald-400/g, replacement: 'text-success-text' },
  { regex: /text-emerald-500/g, replacement: 'text-success-text' },
  { regex: /border-emerald-500\/20/g, replacement: 'border-success-border' },
  
  // Status Warning (Amber)
  { regex: /bg-amber-500\/20/g, replacement: 'bg-warning-bg' },
  { regex: /bg-amber-500\/10/g, replacement: 'bg-warning-bg' },
  { regex: /text-amber-400/g, replacement: 'text-warning-text' },
  { regex: /text-amber-500/g, replacement: 'text-warning-text' },
  { regex: /border-amber-500\/20/g, replacement: 'border-warning-border' },

  // Status Danger (Red)
  { regex: /bg-red-500\/20/g, replacement: 'bg-danger-bg' },
  { regex: /bg-red-500\/10/g, replacement: 'bg-danger-bg' },
  { regex: /text-red-400/g, replacement: 'text-danger-text' },
  // Do not replace text-red-500 because it might be used on dark backgrounds like buttons unless we check, but mostly it is for text. Let's map it.
  { regex: /text-red-500/g, replacement: 'text-danger-text' },
  { regex: /border-red-500\/20/g, replacement: 'border-danger-border' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      for (const { regex, replacement } of replacements) {
        newContent = newContent.replace(regex, replacement);
      }
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(directoryPath);
console.log("Status color migration complete.");
