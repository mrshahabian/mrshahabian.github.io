# Adding tutorials / teaching content

The Tutorials area is **directory-driven** — you add files, not code. Everything lives
under `public/tutorials/`.

```
public/tutorials/
  <topic-folder>/            ← one folder = one topic (a card on /tutorials)
    meta.json                ← (optional) title, description, order, video & book links
    README.html              ← (optional) free-form landing text you edit like any HTML
    01 - First Lesson.html   ← a lesson page (a "subsection")
    02 - Second Lesson.html  ← another lesson
    diagram.png              ← any other file → shown as a downloadable resource
    sample.zip               ← …drawings, samples, slides, PDFs, anything
```

## How it maps to the site

- **Topic folder** → a card on `/tutorials` and a page at `/tutorials/<topic-folder>`.
- **`*.html` files** → lessons, auto-listed on the topic page. Opening one shows it in a
  **viewer page** (`/tutorials/<topic>/<lesson-slug>`) with a nav bar (back to course /
  Tutorials / Home / Prev / Next). The lesson is embedded in a sandboxed frame.
- **Lesson title** = the file name without extension. A leading `NN - ` (e.g. `01 - `)
  sets the order and is stripped from the displayed title.
- **`README.html` or `index.html`** → rendered as the topic's intro text (not a lesson).
- **Any non-HTML file** (png, pdf, zip, …) → listed under **Resources & files** as a download.

## Editing the topic landing (`meta.json`)

All fields are optional:

```json
{
  "title": "AWS VPC Foundations",
  "description": "Short summary shown on the card and page header.",
  "order": 1,
  "videos": [
    { "title": "Intro video", "url": "https://youtu.be/..." }
  ],
  "books": [
    { "title": "Reference book or docs", "url": "https://..." }
  ]
}
```

If there's no `meta.json`, the title is derived from the folder name and the rest is omitted.

## To add a new topic

1. Create a folder under `public/tutorials/`, e.g. `public/tutorials/linux-basics/`.
2. Drop your `.html` lesson files in it (name them `01 - …`, `02 - …` to order them).
3. (Optional) add a `meta.json` and/or `README.html`, plus any resource files.
4. Commit and push — the topic appears automatically on the next deploy.

## Download protection

- Lessons are **not** served as standalone files. Raw `.html` is removed from the
  deployed output; each lesson is shown only through its viewer page.
- The viewer does **not** contain readable lesson HTML. The lesson travels as an
  encoded payload, decoded at runtime and rendered through a short-lived blob URL,
  and only when the page is served from an allowed host (`mrshahabian.com`,
  `mrshahabian.github.io`, localhost for dev). A saved copy of the page — via
  Save Link As, Save Page As, or re-hosting the file — shows a "view on the live
  website" notice instead of the lesson. Right-click / save / copy shortcuts are
  also disabled in the viewer and inside lessons.
- Remaining limit: content someone is *currently viewing* can still be extracted
  with browser DevTools — true of any website. The only way to stop that for the
  public is authentication (Level 3), e.g. **Cloudflare Access** on
  `mrshahabian.com` (free tier): Cloudflare dashboard → Zero Trust → Access →
  Applications → self-hosted app for `mrshahabian.com/tutorials/*` with an
  email-OTP policy. (Not set up yet — ask when ready.)
