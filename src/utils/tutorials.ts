import fs from 'node:fs';
import path from 'node:path';

// Reads teaching content from `public/tutorials/<topic>/` at build time.
// Each sub-directory is a "topic" (a Tutorials section). Inside it:
//   - meta.json        -> { title, description, order, videos:[{title,url}], books:[{title,url}] }
//   - README.html      -> optional free-form landing body (rendered as-is)
//   - *.html           -> lessons. A leading "NN - " sets ordering.
//   - any other file   -> a downloadable resource (drawing, sample, slides, ...)
//
// Lessons are NOT linked as raw files. They are shown through a viewer route
// (/tutorials/<topic>/<lesson-slug>) that embeds the lesson in a sandboxed iframe,
// and the raw .html is removed from the deployed output (see scripts/protect-lessons.mjs),
// so there is no standalone file to download at a guessable URL.

const ROOT = path.resolve('public/tutorials');

export type Link = { title: string; url: string };
export type Subsection = { name: string; file: string; slug: string; href: string; order: number };
export type Resource = { name: string; file: string; url: string; size: number };
export type Section = {
  slug: string;
  title: string;
  description: string;
  order: number;
  bodyHtml: string;
  subsections: Subsection[];
  resources: Resource[];
  videos: Link[];
  books: Link[];
};

const isHidden = (n: string) => n.startsWith('.') || n.startsWith('_');
const isBody = (n: string) => /^(readme|index)\.html$/i.test(n);

function fromFilename(filename: string): { name: string; order: number } {
  const base = filename.replace(/\.[^.]+$/, '');
  const m = base.match(/^\s*(\d+)\s*[-_.)]\s+(.+)$/); // "01 - Name", "1) Name", "02_Name"
  if (m) return { name: m[2].trim(), order: parseInt(m[1], 10) };
  return { name: base.trim(), order: 9999 };
}

function fromSlug(slug: string): string {
  return slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'lesson';
}

function fileUrl(slug: string, file: string): string {
  return `/tutorials/${encodeURIComponent(slug)}/${encodeURIComponent(file)}`;
}

export function formatSize(bytes: number): string {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0, n = bytes;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

// In-frame deterrents injected into the lesson HTML that we embed via iframe srcdoc.
const FRAME_DETERRENT = `<style>*{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}input,textarea,[contenteditable]{-webkit-user-select:text;user-select:text}</style>
<script>(function(){var s=function(e){e.preventDefault();e.stopPropagation();return false;};
['contextmenu','dragstart','selectstart','copy','cut'].forEach(function(t){window.addEventListener(t,s,true);});
window.addEventListener('keydown',function(e){var k=(e.key||'').toLowerCase();
if((e.ctrlKey||e.metaKey)&&(k==='s'||k==='u'||k==='p')){return s(e);}if(k==='f12'){return s(e);}
if((e.ctrlKey||e.metaKey)&&e.shiftKey&&(k==='i'||k==='j'||k==='c')){return s(e);}},true);})();</script>`;

export function getSections(): Section[] {
  if (!fs.existsSync(ROOT)) return [];
  const dirs = fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !isHidden(d.name));

  const sections: Section[] = dirs.map((d) => {
    const slug = d.name;
    const dirPath = path.join(ROOT, slug);
    const entries = fs
      .readdirSync(dirPath, { withFileTypes: true })
      .filter((e) => e.isFile() && !isHidden(e.name));

    let meta: Record<string, any> = {};
    const metaPath = path.join(dirPath, 'meta.json');
    if (fs.existsSync(metaPath)) {
      try { meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8')); } catch { meta = {}; }
    }

    let bodyHtml = '';
    const subsections: Subsection[] = [];
    const resources: Resource[] = [];
    const usedSlugs = new Set<string>();

    for (const e of entries) {
      const lower = e.name.toLowerCase();
      if (lower === 'meta.json') continue;
      if (isBody(e.name)) { bodyHtml = fs.readFileSync(path.join(dirPath, e.name), 'utf-8'); continue; }
      if (lower.endsWith('.html')) {
        const { name, order } = fromFilename(e.name);
        let ls = slugify(name); let n = 2;
        while (usedSlugs.has(ls)) ls = `${slugify(name)}-${n++}`;
        usedSlugs.add(ls);
        subsections.push({ name, file: e.name, slug: ls, href: `/tutorials/${slug}/${ls}`, order });
      } else if (!/\.(md|markdown)$/i.test(e.name)) {
        let size = 0;
        try { size = fs.statSync(path.join(dirPath, e.name)).size; } catch {}
        resources.push({ name: e.name, file: e.name, url: fileUrl(slug, e.name), size });
      }
    }

    subsections.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
    resources.sort((a, b) => a.name.localeCompare(b.name));

    return {
      slug,
      title: meta.title || fromSlug(slug),
      description: meta.description || '',
      order: typeof meta.order === 'number' ? meta.order : 9999,
      bodyHtml,
      subsections,
      resources,
      videos: Array.isArray(meta.videos) ? meta.videos : [],
      books: Array.isArray(meta.books) ? meta.books : [],
    };
  });

  sections.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  return sections;
}

export function getSection(slug: string): Section | undefined {
  return getSections().find((s) => s.slug === slug);
}

export type Lesson = {
  section: Section;
  sub: Subsection;
  index: number;
  prev: Subsection | null;
  next: Subsection | null;
  html: string;
};

export function getLesson(sectionSlug: string, lessonSlug: string): Lesson | undefined {
  const section = getSection(sectionSlug);
  if (!section) return undefined;
  const index = section.subsections.findIndex((s) => s.slug === lessonSlug);
  if (index < 0) return undefined;
  const sub = section.subsections[index];

  let html = fs.readFileSync(path.join(ROOT, sectionSlug, sub.file), 'utf-8');
  if (/<head[^>]*>/i.test(html)) html = html.replace(/<head([^>]*)>/i, `<head$1>\n${FRAME_DETERRENT}`);
  else if (/<html[^>]*>/i.test(html)) html = html.replace(/<html([^>]*)>/i, `<html$1>\n${FRAME_DETERRENT}`);
  else html = FRAME_DETERRENT + '\n' + html;

  return {
    section,
    sub,
    index,
    prev: index > 0 ? section.subsections[index - 1] : null,
    next: index < section.subsections.length - 1 ? section.subsections[index + 1] : null,
    html,
  };
}
