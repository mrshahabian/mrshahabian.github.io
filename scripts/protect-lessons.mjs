// Post-build: enhance LESSON html files (dist/tutorials/<topic>/*.html) with
//   (1) a floating nav bar back to the course / tutorials / home, and
//   (2) light download-deterrents + noindex.
//
// Honest note: the deterrents are deterrents, not a lock. Anything a browser renders
// can be recovered by a determined user (DevTools / view-source / disabling JS). This
// only stops casual right-click/save/copy and keeps the raw files out of search.
//
// Scope: lesson files only — EXCEPT index.html (the landing page) and README.html.
// The site's own pages (home, CV, listings) already have the normal site header and
// are intentionally left untouched so the portfolio stays normal for recruiters.

import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist', 'tutorials');
const PUBLIC = path.resolve('public', 'tutorials');

function titleForSlug(slug) {
  const metaPath = path.join(PUBLIC, slug, 'meta.json');
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      if (meta && typeof meta.title === 'string' && meta.title.trim()) return meta.title.trim();
    } catch {}
  }
  return slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const DETERRENT = `<meta name="robots" content="noindex,nofollow">
<style id="__protect">*{-webkit-user-select:none;-ms-user-select:none;user-select:none;-webkit-touch-callout:none}input,textarea,[contenteditable]{-webkit-user-select:text;user-select:text}#__sitenav,#__sitenav *{-webkit-user-select:none;user-select:none}</style>
<script>(function(){var stop=function(e){e.preventDefault();e.stopPropagation();return false;};
['contextmenu','dragstart','selectstart','copy','cut'].forEach(function(t){window.addEventListener(t,stop,true);});
window.addEventListener('keydown',function(e){var k=(e.key||'').toLowerCase();
if((e.ctrlKey||e.metaKey)&&(k==='s'||k==='u'||k==='p')){return stop(e);}
if(k==='f12'){return stop(e);}
if((e.ctrlKey||e.metaKey)&&e.shiftKey&&(k==='i'||k==='j'||k==='c')){return stop(e);}
},true);})();</script>`;

function navScript(slug, title) {
  const data = JSON.stringify({ base: `/tutorials/${slug}`, title });
  return `<script>(function(){var D=${data};
function a(href,label,primary){return '<a href="'+href+'" style="pointer-events:auto;text-decoration:none;display:inline-flex;align-items:center;gap:5px;padding:7px 12px;border-radius:9px;font:600 13px/1 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#fff;background:'+(primary?'rgba(29,78,216,.92)':'rgba(20,24,40,.82)')+';box-shadow:0 1px 6px rgba(0,0,0,.25);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)">'+label+'</a>';}
function mk(){if(document.getElementById('__sitenav'))return;
var bar=document.createElement('div');bar.id='__sitenav';
bar.setAttribute('style','position:fixed;top:12px;left:12px;z-index:2147483647;display:flex;gap:8px;flex-wrap:wrap;pointer-events:none');
var t=D.title.replace(/&/g,'&amp;').replace(/</g,'&lt;');
bar.innerHTML=a(D.base,'\\u2190 '+t,true)+a('/tutorials','Tutorials',false)+a('/','Home',false);
(document.documentElement||document.body).appendChild(bar);}
if(document.readyState!=='loading')mk();else document.addEventListener('DOMContentLoaded',mk);
window.addEventListener('load',mk);setInterval(mk,1200);})();</script>`;
}

function isLesson(file) {
  if (!file.toLowerCase().endsWith('.html')) return false;
  const base = path.basename(file).toLowerCase();
  return base !== 'index.html' && base !== 'readme.html';
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (isLesson(p)) acc.push(p);
  }
  return acc;
}

const files = walk(DIST);
let count = 0;
for (const f of files) {
  let html = fs.readFileSync(f, 'utf-8');
  if (html.includes('id="__protect"')) continue; // idempotent
  const slug = path.relative(DIST, f).split(path.sep)[0];
  const inject = DETERRENT + '\n' + navScript(slug, titleForSlug(slug));
  if (/<head[^>]*>/i.test(html)) html = html.replace(/<head([^>]*)>/i, `<head$1>\n${inject}`);
  else if (/<html[^>]*>/i.test(html)) html = html.replace(/<html([^>]*)>/i, `<html$1>\n${inject}`);
  else html = inject + '\n' + html;
  fs.writeFileSync(f, html);
  count++;
}

console.log(`[protect-lessons] enhanced ${count} lesson file(s) with nav + deterrents.`);
