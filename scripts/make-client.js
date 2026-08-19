const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file === 'page.tsx') {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('"use client"')) {
        fs.writeFileSync(fullPath, '"use client";\n\n' + content);
      }
    }
  }
}

processDir(path.join(process.cwd(), 'src', 'app'));
