const fs = require('node:fs');
const path = require('node:path');

/**
 * Vite writes the PWA bundle to client/dist.
 * Cloudflare Pages projects are often configured with the default output
 * directory "dist", so mirror the build there as well. Both paths are
 * gitignored; this only runs after a successful build.
 */
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'client', 'dist');
const target = path.join(root, 'dist');

if (!fs.existsSync(source)) {
  console.error(`Build output not found: ${source}`);
  process.exit(1);
}

fs.mkdirSync(target, { recursive: true });
fs.cpSync(source, target, { recursive: true, force: true });
console.log(`Build output mirrored to ${target}`);
