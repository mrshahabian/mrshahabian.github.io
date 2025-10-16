## Alashti Personal Website

Tech: Astro 5 + Tailwind 4 + MDX + Content Collections + GitHub Pages

### Local setup
```bash
nvm use
npm install
npm run dev
# open http://localhost:4321
```

Optional production preview:
```bash
npm run build
npm run preview
```

### Content structure
- `src/content/blog` — blog posts (md/mdx)
- `src/content/projects` — project entries
- `src/content/publications` — publications (authors, venue, year, doi/url)
- `src/content/experience` — roles, companies, dates
- `src/content/education` — degrees, schools
- `src/content/tutorials` — tutorials with links to repo/notebooks/videos
- `src/content/events` — workshops and events

Each folder accepts Markdown/MDX with frontmatter as defined in `src/content.config.ts`.

### Deployment (GitHub Pages)
This repo includes `.github/workflows/deploy.yml`.

1) Push to GitHub `main` (already set up).
2) In GitHub → Settings → Pages → Source: GitHub Actions.
3) Set Custom domain: `www.alashti.com`. Enable “Enforce HTTPS”.
4) DNS at GoDaddy (keep GoDaddy nameservers):
   - CNAME: `www` → `mrshahabian.github.io`
   - Optional apex redirect to `www`:
     - A: `@` → 185.199.108.153
     - A: `@` → 185.199.109.153
     - A: `@` → 185.199.110.153
     - A: `@` → 185.199.111.153
     - AAAA: `@` → 2606:50c:8000::153
     - AAAA: `@` → 2606:50c:8001::153
     - AAAA: `@` → 2606:50c:8002::153
     - AAAA: `@` → 2606:50c:8003::153

`public/CNAME` is set to `www.alashti.com` so Pages will keep the domain.

### Environment / tooling
- Node pinned via `.nvmrc` (v22) and `engines.node` in `package.json`.
- `.gitignore` excludes `dist/`, `node_modules/`, `.env*`, logs, etc.
- Put secrets (analytics, form keys) into `.env` (gitignored) when needed.

### Editing the nav / pages
- Update nav links in `src/components/Header.astro`.
- Page files live in `src/pages/`.

### Common tasks
- Add a blog post: create `src/content/blog/my-post.md`.
- Add a project: create `src/content/projects/my-project.md` with `title`, `description`, optional `links`.
- Add an event: create `src/content/events/my-event.md` with `title`, `description`, `date`.
