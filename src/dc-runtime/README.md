# dc-runtime assets

Build-time support for lessons exported as raw `.dc.html` files (an `<x-dc>` page
that expects a sibling `support.js`). `src/utils/dc-bundle.ts` wraps each one into a
self-contained "Bundled Page" — the same format as the pre-bundled lessons under
`public/tutorials/aws-vpc-foundations/` — so it renders inside the lesson viewer
without any external runtime.

| File | What it is |
| --- | --- |
| `support.js` | The dc runtime (parses `<x-dc>`, evaluates `<script data-dc-script>`, renders with React). |
| `react.production.min.js`, `react-dom.production.min.js` | The React 18.3.1 UMD builds `support.js` pins (URL + SRI hash). Bundled so lessons do not depend on unpkg at view time. |
| `bootstrap.html` | The bundle bootstrap page with `__DC_*` placeholders: unpacks the manifest into blob URLs, substitutes them into the template and swaps the document in. |

All three assets were extracted verbatim from the newest pre-bundled lesson
(`16- Container Foundations.html`, dc runtime build of 16 Jul 2026); the React
files match the SRI hashes pinned inside `support.js`.

## Updating

- **New `support.js`**: replace the file. If it pins a different React version, drop
  the matching UMD files in here too (same base name as the pinned unpkg URL). When
  a file is missing or its hash does not match, the build warns and that library is
  loaded from unpkg instead — nothing breaks, it just needs the network.
- **Bootstrap**: keep the `__DC_BG__`, `__DC_THUMBNAIL__`, `__DC_MANIFEST__`,
  `__DC_EXT_RESOURCES__` and `__DC_TEMPLATE__` placeholders if you swap it for a
  newer bootstrap from a freshly bundled page.
