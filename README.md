# nest.mgvdev.io

Documentation site for [mgvdev](https://github.com/mgvdev)'s open-source NestJS packages.
Built with [Fumapress](https://press.fumadocs.dev) (Fumadocs + Waku).

Features: Orama full-text search, `llms.txt` output for AI agents, and per-package sidebar
sections so the site scales to many packages.

## Development

The site runs on Node (via Waku) — use any of npm, pnpm, yarn, or bun.

```sh
# install
npm install        # or: pnpm install · yarn · bun install

# scripts (swap npm for your manager)
npm run dev          # dev server
npm run build        # static production build
npm run start        # serve the production build
npm run types:check  # generate MDX types + tsc --noEmit
```

## Content structure

```
content/
  index.mdx              # landing page (list of packages)
  <package>/
    meta.json           # { "title": "...", "root": true, "pages": [...] }
    index.mdx           # package intro
    ...more pages
```

Each package folder is a Fumadocs **root** (`"root": true` in its `meta.json`), so it gets
its own sidebar section and the docs UI shows a switcher between packages.

## Adding a new package

1. Create `content/<package>/`.
2. Add `meta.json` with `{ "title": "<package>", "root": true, "pages": ["index", ...] }`.
3. Write `index.mdx` and the rest of the pages.
4. Link it from `content/index.mdx`.

No config changes needed — search, `llms.txt`, and the sidebar pick it up automatically.

## Configuration

- `press.config.tsx` — site metadata, static mode, plugins (Orama search, `llms.txt`, Takumi
  OG images).
- `source.config.ts` — the MDX content collection.
- `waku.config.ts` — Vite/Waku plugins.
