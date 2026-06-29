// Post-build (Level 2): remove raw lesson files from the deployed output.
//
// Lessons are authored in public/tutorials/<topic>/*.html, so Astro copies them
// verbatim into dist/. We delete those raw copies here so there is NO standalone
// lesson file served at a guessable URL — visitors can only read a lesson through
// its viewer page (/tutorials/<topic>/<lesson-slug>), which embeds it in a
// sandboxed iframe with the nav bar and download-deterrents.
//
// Honest note: this removes the easy "right-click → Save Link As" / direct-URL
// download. It is NOT a hard lock — a determined user can still recover content
// via DevTools / view-source. For true access control, gate the site (Level 3,
// e.g. Cloudflare Access). See TUTORIALS.md.
//
// Kept in dist (intentionally downloadable / harmless): index.html (landing),
// README.html (intro text), meta.json, and any resource files (png, pdf, zip, ...).

import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist', 'tutorials');

function isRawLesson(file) {
  if (!file.toLowerCase().endsWith('.html')) return false;
  const base = path.basename(file).toLowerCase();
  return base !== 'index.html' && base !== 'readme.html';
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (isRawLesson(p)) acc.push(p);
  }
  return acc;
}

const files = walk(DIST);
let count = 0;
for (const f of files) {
  // Skip viewer pages (they live in their own <lesson-slug>/index.html dirs and
  // are named index.html, so they're already excluded by isRawLesson).
  fs.rmSync(f);
  count++;
}

console.log(`[protect-lessons] removed ${count} raw lesson file(s) from dist (viewer pages only).`);
