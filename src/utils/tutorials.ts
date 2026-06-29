import fs from 'node:fs';
import path from 'node:path';

// Reads teaching content from `public/tutorials/<topic>/` at build time.
// Each sub-directory is a "topic" (a Tutorials section). Inside it:
//   - meta.json        -> { title, description, order, videos:[{title,url}], books:[{title,url}] }
//   - README.html      -> optional free-form landing body (rendered as-is)
//   - *.html           -> subsections (lesson pages). A leading "NN - " sets ordering.
//   - any other file   -> a downloadable resource (drawing, sample, slides, ...)
// Everything is dynamic: add a file to a folder and it shows up. No code changes needed.

const ROOT = path.resolve('public/tutorials');

export type Link = { title: string; url: string };
export type Subsection = { name: string; file: string; url: string; order: number };
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

function fileUrl(slug: string, file: string): string {
  return `/tutorials/${encodeURIComponent(slug)}/${encodeURIComponent(file)}`;
}

function humanSize(bytes: number): string {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0, n = bytes;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

export function formatSize(bytes: number): string {
  return humanSize(bytes);
}

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

    for (const e of entries) {
      const lower = e.name.toLowerCase();
      if (lower === 'meta.json') continue;
      if (isBody(e.name)) { bodyHtml = fs.readFileSync(path.join(dirPath, e.name), 'utf-8'); continue; }
      if (lower.endsWith('.html')) {
        const { name, order } = fromFilename(e.name);
        subsections.push({ name, file: e.name, url: fileUrl(slug, e.name), order });
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
