const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const mainPath = path.join(distDir, 'main.js');
const srcDir = path.join(distDir, 'src');
const srcMainPath = path.join(srcDir, 'main.js');

// 1. If dist/main.js exists, create dist/src/main.js as proxy for backwards compatibility (Render)
if (fs.existsSync(mainPath)) {
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }
  if (!fs.existsSync(srcMainPath)) {
    fs.writeFileSync(srcMainPath, "require('../main.js');\n", 'utf8');
    console.log('[postbuild] Created fallback dist/src/main.js -> ../main.js');
  }
}

// 2. If dist/src/main.js exists but dist/main.js does not (Hostinger requirement)
if (fs.existsSync(srcMainPath) && !fs.existsSync(mainPath)) {
  fs.writeFileSync(mainPath, "require('./src/main.js');\n", 'utf8');
  console.log('[postbuild] Created fallback dist/main.js -> ./src/main.js');
}
