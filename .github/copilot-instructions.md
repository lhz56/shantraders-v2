This repository is a small Next.js (App Router) site created with `create-next-app`.

Purpose for AI coding agents
- Make minimal, idiomatic changes that fit the App Router layout (files under `app/`).
- Prefer small, self-contained commits that update UI or add features; keep styling consistent with Tailwind utility classes already present.

Quick facts (do these first)
- Framework: Next.js (App Router) — entry points: `app/layout.js`, `app/page.js`.
- Scripts: `npm run dev` (dev server), `npm run build`, `npm run start` — check `package.json`.
- Styling: Tailwind CSS (see `app/globals.css` and `tailwindcss` in devDependencies).
- Aliases: `@/*` maps to project root via `jsconfig.json`.

What to change and how
- Edit pages and UI under `app/`. Add route folders (e.g. `app/inventory/page.js`) for new pages.
- Keep server/client boundaries in mind: files in `app/` are server components by default. Use `'use client'` at the top of a component when you need client-side behavior (hooks, event handlers, state).
- Use `next/image` for images (example: `app/page.js` uses `Image` from `next/image`). Provide static assets under `public/`.

Patterns and conventions observed
- App Router structure: layout in `app/layout.js` sets global fonts and metadata; individual pages are under `app/*`.
- Font loading uses `next/font/google` and CSS variables (see `layout.js`). Mirror the same approach for new fonts.
- Tailwind utilities are used for styling rather than component libraries — follow existing utility patterns and spacing scale.

Integration and dev workflows
- Run the dev server with `npm run dev` and open http://localhost:3000.
- Build using `npm run build` then `npm run start` to run production build locally.
- There are no tests configured; do not add heavy infra without asking. Keep PRs minimal.

Files to inspect when changing behavior
- `app/layout.js` — global layout, fonts, metadata.
- `app/page.js` — homepage UI and examples of `next/image` and Tailwind usage.
- `jsconfig.json` — path alias `@/*`.
- `next.config.mjs` — currently default, update only if you need custom Next.js config.

Examples (copy/paste friendly)
- New page route skeleton (place at `app/inventory/page.js`):

  export default function InventoryPage() {
    return <main className="p-8">Inventory main</main>;
  }

- Client component pattern:

  'use client'
  import { useState } from 'react'
  export default function Foo() {
    const [count, setCount] = useState(0)
    return <button onClick={() => setCount(c => c + 1)}>{count}</button>
  }

When to ask for clarification
- If a change requires new dependencies, CI, or tests, ask the maintainers before adding them.
- If you need runtime environment variables or external integrations, request details for secrets and deployment targets.

If anything here is unclear or you want the file expanded (examples, more routes, or a CONTRIBUTING section), tell me which area to expand.
