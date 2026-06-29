// Post-build: inject light download-deterrents + noindex into LESSON html files only.
//
// Honest note: these are deterrents, not a lock. Anything a browser renders can be
// recovered by a determined user (DevTools / view-source / disabling JS). This only
// stops casual right-click/save/copy and keeps the raw lesson files out of search.
//
// Scope: dist/tutorials/<topic>/*.html  EXCEPT index.html (the landing page) and
// README.html. The site's own pages (home, CV, listings) are intentionally left
// untouched so the portfolio stays normal for recruiters.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('dist', 'tutorials');

const DETERRENT = `<meta name="robots" content="noindex,nofollow">
<style id="__protect">*{-webkit-user-select:none;-ms-user-select:none;user-select:none;-webkit-touch-callout:none}input,textarea,[contenteditable]{-webkit-user-select:text;user-select:text}</style>
<script>(function(){var stop=function(e){e.preventDefault();e.stopPropagation();return false;};
['contextmenu','dragstart','selectstart','copy','cut'].forEach(function(t){window.addEventListener(t,stop,true);});
window.addEventListener('keydown',function(e){var k=(e.key||'').toLowerCase();
if((e.ctrlKey||e.metaKey)&&(k==='s'||k==='u'||k==='p')){return stop(e);}
if(k==='f12'){return stop(e);}
if((e.ctrlKey||e.metaKey)&&e.shiftKey&&(k==='i'||k==='j'||k==='c')){return stop(e);}
},true);})();</script>`;

function isLesson(file) {
  if (!file.toLowerCase().endsWith('.html')) return false;
  const base = path.basename(file).toLowerCase();
  return base !== 'index.html' && base !== 'readme.html';
}

function walk(dir) {
  let out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p));
    else if (isLesson(p)) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
let count = 0;
for (const f of files) {
  let html = fs.readFileSync(f, 'utf-8');
  if (html.includes('id="__protect"')) continue; // idempotent
  if (/<head[^>]*>/i.test(html)) {
    html = html.replace(/<head([^>]*)>/i, `<head$1>\n${DETERRENT}`);
  } else if (/<html[^>]*>/i.test(html)) {
    html = html.replace(/<html([^>]*)>/i, `<html$1>\n${DETERRENT}`);
  } else {
    html = DETERRENT + '\n' + html;
  }
  fs.writeFileSync(f, html);
  count++;
}

console.log(`[protect-lessons] injected deterrents into ${count} lesson file(s).`);
