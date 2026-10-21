# Portfolio

A personal hero page and interactive CV built with React 18, TypeScript (strict) and Vite 5.

- **Hero** with name, headline, summary and social links.
- **3D lanyard badge** (react-three-fiber + rapier physics) you can grab and swing; the badge face is painted from your profile data.
- **3D CV journey**: a camera path through your milestones, with an accessible panel and keyboard controls.
- **Timeline sections** for experience, education, projects, courses and skills.

Without WebGL or with `prefers-reduced-motion`, every 3D feature falls back to an accessible 2D version.

## Quick start

### Docker

```bash
npm run docker:up    # production image (nginx) on http://localhost:8080
npm run docker:dev   # Vite dev server with hot reload on http://localhost:5173
```

Equivalent raw commands: `docker compose up --build web` and `docker compose --profile dev up --build dev`.
The image build runs the full `verify` pipeline (typecheck, lint, format, tests); a failing check aborts the build.

### Node (18+)

```bash
npm ci
npm run dev          # http://localhost:5173
npm run build && npm run preview
```

## Make it yours

1. Edit **`src/data/profile.data.ts`** - it is the only file you need to change. Dates use `YYYY-MM`; omit `end` for ongoing items; every `id` must be unique.
2. Put your photo at **`public/photo.jpg`** and set `photoUrl: '/photo.jpg'`. Until then the placeholder `public/photo.svg` is used.
3. Run `npm test` - `src/data/profile.data.test.ts` validates the file and catches bad dates or duplicate ids.

## Scripts

| Script                    | Purpose                                              |
| ------------------------- | ---------------------------------------------------- |
| `dev`                     | Vite dev server                                      |
| `build`                   | Type-check (`tsc -b`) and production build to `dist` |
| `preview`                 | Serve the production build locally                   |
| `test` / `test:watch`     | Vitest, single run / watch mode                      |
| `coverage`                | Tests with V8 coverage                               |
| `lint` / `lint:fix`       | ESLint                                               |
| `format` / `format:check` | Prettier                                             |
| `typecheck`               | `tsc --noEmit` for app and node configs              |
| `verify`                  | typecheck + lint + format:check + test               |
| `docker:build`            | Build the `portfolio` image                          |
| `docker:up`               | Run the production container on port 8080            |
| `docker:dev`              | Run the dev server in a container on port 5173       |

## Project structure

```
src/
  domain/      Pure types and functions: profile, date ranges, timeline, validation
  services/    ProfileRepository interface and implementation
  data/        profile.data.ts - your CV content
  app/         Composition: ProfileContext, sections registry, page
  features/
    hero/        Hero section and social links
    badge/       Badge, capability detection, canvas painter
      scene/     Lazy-loaded three.js lanyard (physics, drag math, textures)
    cv3d/        3D CV section, milestone panel/controls, layout, navigation state
      scene/     Lazy-loaded journey canvas, path, nodes, camera rig
    timeline/    Generic timeline and in-view hook
    experience/ education/ projects/ courses/ skills/   Content sections
    navigation/  Site navigation
  ui/          Presentational primitives: Card, Section, TagList
  styles/      Design tokens and global styles
  test/        Test setup, fixtures, fake repository
```

## Architecture decisions

- **Pure domain layer.** `src/domain` has no React or browser dependencies, so date math, timeline building and validation are trivially unit-testable and reusable.
- **Repository + context provider.** Components depend on the `ProfileRepository` interface delivered through `ProfileContext`, not on the data file (dependency inversion). The data source can be swapped (static file, API, test fake) without touching UI code.
- **Sections registry.** `src/app/sections.tsx` is the single source of truth for page order and navigation entries. Adding a section means adding one entry, not editing the page or nav (open/closed).
- **Timeline sources as strategies.** `src/domain/timelineSources.ts` maps each content type to timeline entries; new content types plug in without changing the timeline builder (open/closed).
- **Capability strategy with fallbacks.** WebGL support and `prefers-reduced-motion` decide between the 3D and the accessible 2D rendering, so the content is always reachable by keyboard and screen readers.
- **Lazy-loaded 3D.** three.js, drei and rapier load only when a 3D scene is actually rendered. Initial bundle: `index` 168 kB (55 kB gzip) + 15 kB CSS. Deferred chunks: `LanyardCanvas` 2.1 MB (776 kB gzip, includes rapier WASM), shared three.js chunk 820 kB (221 kB gzip), `JourneyCanvas` 36 kB (11 kB gzip).
- **Narrow canvas interface (ISP).** Badge painters depend on a minimal 2D-context interface rather than `CanvasRenderingContext2D`, so they are tested with a recording fake in jsdom.
- **Pure physics and drag math.** `dragMath.ts` and the CV `layout.ts` are plain functions, unit-tested independently of the render loop.
- **No remote assets.** No CDNs, web fonts or remote textures; the app works offline and in isolated containers. The nginx CSP (`default-src 'self'`) enforces this, allowing only `'wasm-unsafe-eval'` for rapier, `blob:` workers, `data:`/`blob:` images and inline styles.
- **CSS Modules + design tokens.** Component-scoped styles with shared custom properties in `src/styles/tokens.css`.
- **Container.** Multi-stage image (`deps` -> `verify` -> `build` -> `runtime`) on pinned Node 20 / nginx 1.27 Alpine, running as the unprivileged `nginx` user on port 8080 with a health check, SPA fallback, immutable caching for hashed `/assets/` and `no-cache` for `index.html`. Image size: 84 MB.

## Testing strategy

- Test-driven: each behaviour starts with a failing test.
- UI tests use Testing Library and query by accessible roles and names, asserting behaviour rather than implementation.
- 3D rendering components (`scene/` folders) are intentionally thin and not rendered in jsdom; their logic (layout, drag math, navigation state, painters, capability detection) lives in pure modules that are unit-tested.
- Current suite: 179 tests in 33 files (`npm test`).

## Workflow

Each iteration follows red -> green -> refactor -> lint, then one Conventional Commit (`feat:`, `test:`, `build:`, ...). See `git log` for the history.
