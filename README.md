# C-9INE website

Marketing site for C-9INE — a Google Cloud specialist delivering cloud migration and Google
Distributed Cloud engagements to banks, government and critical-infrastructure organisations.

Static site built with [Astro](https://astro.build), deployed via Cloudflare Pages. No CMS —
content lives in this repo and is updated by editing the pages directly (see
`docs/content-brief.md` for the full content/structure spec this build is based on).

## Development

```sh
npm install
npm run dev       # local dev server
npm run build     # typecheck + production build to dist/
npm run preview   # serve the production build locally
```

## Structure

- `src/pages/` — one file per route (Home, Cloud Migration, Google Distributed Cloud, Case
  Studies, About, Contact)
- `src/components/` — shared UI (nav, footer, hero, cards, the pillar-page Design/Build/Run
  scroll sequence, etc.)
- `src/styles/global.css` — design tokens (color, type, spacing) and base styles
- `src/assets/` — images processed through Astro's built-in image optimizer
- `docs/content-brief.md` — the content and structure brief this site was built from
- `.claude/skills/frontend-design/` — the design-guidance skill used while building this site

## Known follow-ups

A few content items are marked with `TODO` comments or placeholder copy pending confirmation —
see `docs/content-brief.md` §6 for the full list (CTO bio, team role titles, company
registration number, and the GDC hero wording sign-off).
