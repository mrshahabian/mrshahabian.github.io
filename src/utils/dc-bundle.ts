import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

// Turns a raw `.dc.html` lesson export (an <x-dc> page that expects a sibling
// `support.js`) into a self-contained "Bundled Page" — the same format as the
// pre-bundled lessons in public/tutorials/aws-vpc-foundations/*.html.
//
// A bundled page is a small bootstrap document (src/dc-runtime/bootstrap.html)
// carrying three JSON <script> blocks:
//   __bundler/manifest       uuid -> { mime, compressed, data (gzip, base64) }
//   __bundler/ext_resources  [{ id: <cdn url>, uuid }]  -> window.__resources
//   __bundler/template       the lesson HTML with asset URLs replaced by uuids
// On load the bootstrap unpacks the assets into blob: URLs, substitutes them
// into the template and swaps the document in. The dc runtime (support.js)
// consults window.__resources before touching unpkg, so React and ReactDOM
// come from the bundle rather than the network.
//
// Runtime assets live in src/dc-runtime/ (see the README there).

const RUNTIME_DIR = path.resolve('src/dc-runtime');

export const isDcLesson = (filename: string) => /\.dc\.html$/i.test(filename);

type Asset = { mime: string; compressed: boolean; data: string };
type ExtResource = { id: string; uuid: string };

// Deterministic, UUID-shaped id derived from the asset contents, so a rebuild
// with unchanged inputs produces byte-identical output.
function uuidFor(key: string, bytes: Buffer): string {
  const h = crypto.createHash('sha1').update(key).update(bytes).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

function sri384(bytes: Buffer): string {
  return 'sha384-' + crypto.createHash('sha384').update(bytes).digest('base64');
}

// JSON that is safe inside a <script> element: a literal "</script" inside a
// string would otherwise end the block early.
function scriptJson(value: unknown): string {
  return JSON.stringify(value).replace(/<\//g, '<\\/');
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Splash shown for the few hundred milliseconds while the bundle unpacks.
function thumbnail(title: string, bg: string, accent: string): string {
  const size = title.length <= 16 ? 58 : Math.max(30, Math.floor((58 * 16) / title.length));
  return `<div id="__bundler_thumbnail">
  <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="800" fill="${bg}"></rect>
    <rect x="400" y="260" width="180" height="220" rx="20" fill="${accent}"></rect>
    <rect x="600" y="260" width="180" height="220" rx="20" fill="${accent}" opacity=".55"></rect>
    <text x="600" y="640" font-family="'Bricolage Grotesque',sans-serif" font-size="${size}" font-weight="800" fill="#22243f" text-anchor="middle">${escapeXml(title)}</text>
    <text x="600" y="696" font-family="'Figtree',sans-serif" font-size="28" fill="#5a6080" text-anchor="middle">Interactive Lesson</text>
  </svg>
</div>`;
}

export function bundleDc(dcHtml: string, opts: { title: string }): string {
  const support = fs.readFileSync(path.join(RUNTIME_DIR, 'support.js'));
  const supportText = support.toString('utf-8');

  const manifest: Record<string, Asset> = {};
  const ext: ExtResource[] = [];
  const add = (key: string, bytes: Buffer, mime: string): string => {
    const uuid = uuidFor(key, bytes);
    manifest[uuid] = { mime, compressed: true, data: zlib.gzipSync(bytes, { level: 9 }).toString('base64') };
    return uuid;
  };

  const supportUuid = add('support.js', support, 'text/javascript');

  // CDN scripts the runtime would otherwise fetch from unpkg. Bundle the copies
  // in src/dc-runtime/ when they match the URL + SRI hash pinned in support.js;
  // otherwise leave that library to load from the CDN (with SRI) and say so.
  for (const lib of ['REACT', 'REACT_DOM']) {
    const url = supportText.match(new RegExp(`var ${lib}_URL = "([^"]+)"`))?.[1];
    const sri = supportText.match(new RegExp(`var ${lib}_SRI = "([^"]+)"`))?.[1];
    if (!url) continue;
    const file = path.join(RUNTIME_DIR, path.basename(url));
    if (!fs.existsSync(file)) {
      console.warn(`[dc-bundle] ${path.basename(file)} missing from src/dc-runtime — "${opts.title}" will load it from ${url}`);
      continue;
    }
    const bytes = fs.readFileSync(file);
    if (sri && sri384(bytes) !== sri) {
      console.warn(`[dc-bundle] ${path.basename(file)} does not match the SRI hash pinned in support.js — "${opts.title}" will load it from ${url}`);
      continue;
    }
    ext.push({ id: url, uuid: add(url, bytes, 'text/javascript') });
  }

  // Template: point the lesson at the bundled runtime instead of ./support.js.
  let template = dcHtml;
  const supportRef = /<script([^>]*?)\ssrc=(["'])(?:\.\/)?support\.js\2/i;
  if (supportRef.test(template)) {
    template = template.replace(supportRef, (_m, attrs: string, q: string) => `<script${attrs} src=${q}${supportUuid}${q}`);
  } else if (/<\/head>/i.test(template)) {
    template = template.replace(/<\/head>/i, `<script src="${supportUuid}"></script>\n</head>`);
  } else {
    template = `<script src="${supportUuid}"></script>\n` + template;
  }

  // Match the splash to the lesson's own palette so there is no colour flash.
  const bg = template.match(/body\s*\{[^}]*background:\s*(#[0-9a-fA-F]{3,8})/)?.[1] ?? '#eef2fc';
  const accent = template.match(/(?:^|[\s;}])a\s*\{\s*color:\s*(#[0-9a-fA-F]{3,8})/)?.[1] ?? '#3d6ef5';

  const bootstrap = fs.readFileSync(path.join(RUNTIME_DIR, 'bootstrap.html'), 'utf-8');
  return bootstrap
    .split('__DC_BG__').join(bg)
    .split('__DC_THUMBNAIL__').join(thumbnail(opts.title, bg, accent))
    .split('__DC_MANIFEST__').join(scriptJson(manifest))
    .split('__DC_EXT_RESOURCES__').join(scriptJson(ext))
    .split('__DC_TEMPLATE__').join(scriptJson(template));
}
