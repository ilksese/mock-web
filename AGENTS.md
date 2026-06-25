# MockWeb — Online Data Mock Platform

Vite + SolidJS SPA with a Hono API server, deployed as a single Vercel project. Neon PostgreSQL via Drizzle ORM.

## Commands

| Command | What |
|---|---|
| `npm run dev` | Vite dev server (proxies `/_manage` to `:8787`) |
| `npm run build` | `vite build` → `dist/` |
| `npx tsc --noEmit` | Type-check only (no emit) |
| `npm run db:push` | `drizzle-kit push` — sync schema to Neon (needs `DATABASE_URL` env) |
| `npm run db:generate` | `drizzle-kit generate` — create migration SQL |

No test runner yet.

## Architecture

```
api/   → Hono backend (Vercel serverless)
  index.ts              Entry: route assembly + handle()
  db/schema.ts          Drizzle: workspaces, endpoints, response_rules
  db/index.ts           Neon HTTP + drizzle instance
  routes/manage/        CRUD (Bearer auth): workspaces, endpoints, responses
  routes/mock/serve.ts  Catch-all: match endpoint → eval rules → respond
  middleware/            auth.ts (Bearer→workspace lookup), cache.ts (Map, 30s TTL)

src/   → SolidJS SPA
  main.tsx              Render + <Router>
  App.tsx               Layout + <Route>s (no <Routes> wrapper)
  index.css             Tailwind v4 `@theme` layer + global styles (dark Voltagent theme)
  components/ui/        Button, Input, Card, Modal, Toast, Badge, CodeBlock, Toggle
  components/layout/    NavBar, Layout
  components/workspace/ WorkspaceCreateCard, WorkspaceHeader
  components/endpoint/  EndpointCard, EndpointList, CreateEndpointModal, EndpointInfoBar
  components/response/  ResponseRuleCard/List/Editor, ConditionBuilder, BodyEditor
  pages/                HomePage, WorkspacePage, EndpointEditPage
  lib/client.ts         Typed fetch, auto Bearer from localStorage
  lib/storage.ts        localStorage helpers
  store/                Module-level createSignal hooks (toast, workspace)
```

**Route dispatch:** filesystem → `/_manage/*` (Hono) → SPA routes → `/*` (mock catch-all)

## Conventions

- **ESM** (`"type": "module"`), all `import`/`export`.
- **Styling**: Tailwind CSS v4 utility classes on `class` attribute (SolidJS JSX). No `style={{}}` props for static styles — only for runtime-dynamic values (e.g., width, color computed from a signal). Design tokens are defined in `src/index.css` via the `@theme` directive (Voltagent dark theme: single `#00d992` accent, Inter + SF Mono fonts). Use semantic utility names: `bg-canvas`, `text-primary`, `border-hairline`, `rounded-sm`, etc. Arbitrary values use `value` syntax for non-standard numbers: `text-[60px]`, `leading-[26px]`, `tracking-[-0.65px]`. Button variants use template literals with variant objects, not `clsx` or `tailwind-variants`. Global resets and the `.sk` skeleton shimmer class are in `src/index.css` via `@layer base` and `@layer components`.
- **Components**: `export default function Name(props)`, `splitProps` for rest spread.
- **Router**: `@solidjs/router` v0.16 — `<Route>` directly in JSX, `<A href>`, `useNavigate()`, `useParams<T>()`.
- **Data**: `createResource(source, fetcher)`, `refetch()` on mutate. Every page/component with async data MUST show skeletons during loading: use `resource.loading` with `<Show when={!resource.loading} fallback={<SkeletonLayout />}>`. Never show empty-state copy ("No items yet") while data is still loading — render it only after `resource.loading` is false and the list is empty.
- **State**: `createSignal` local; module-level signal + hook for global state.
- **Backend**: `c.json({ error, details }, status)`. 400 validation, 401 auth, 404 not-found.
- **DB**: Drizzle query API for reads, `insert/update/delete` for writes. UUID via `defaultRandom()`.
- **Env**: No dotenv. `DATABASE_URL` via CLI or Vercel dashboard.

## Notes

## Lessons Learned (from dev testing 2026-06-25)

### SolidJS Reactivity — the #1 pitfall in this codebase

SolidJS component functions run **ONCE** (unlike React). Only signals accessed inside reactive contexts (`<Show>`, `<For>`, `createMemo`, `createEffect`, JSX expressions) re-run when dependencies change.

**BANNED patterns** (all caused bugs in this codebase):
- `if (!props.open) return null;` in component body → evaluated once, never re-evaluates. Use `<Show when={props.open}>`.
- `if (props.rules.length === 0) return <Fallback/>` → same problem. Use `<Show when={props.rules.length > 0} fallback={<Fallback/>}>`.
- `const rules = () => endpoint()?.responseRules ?? [];` passed as `rules={rules()}` → the `()` call dereferences once at render. Use `createMemo(() => endpoint()?.responseRules ?? [])` and pass `rules={rules()}` (memo tracks).
- `const r = props.rule;` destructuring props to a local variable at top of component → loses reactivity. Access `props.rule` lazily inside JSX, or use `createMemo`/`createEffect`.

**Rule**: any conditional rendering or prop-derived data MUST go through `<Show>`, `<For>`, or `createMemo`. Never plain `if`/`return`/`const` in component body for reactive data.

### Drizzle ORM — relations query API

`db.query.X.findFirst({ with: { relatedTable: true } })` requires explicit `relations()` definitions in schema. Foreign keys (`.references()`) alone are NOT enough — you get `TypeError: Cannot read properties of undefined (reading 'referencedTable')` at runtime (500 error). Always define `relations()` for every table that has relationships.

### API route contracts — keep client and server in sync

`src/lib/client.ts` defines fetch paths; `api/routes/manage/*.ts` defines Hono routes. These must match exactly. Bugs found:
- Client: `POST /_manage/endpoints/:epId/responses` vs Server: `/:epId` (missing `/responses`) → 404
- PUT/DELETE mounted at `/_manage/endpoints` but client calls `/_manage/responses/:id` → 404

When adding/changing a route, grep both `client.ts` AND the route file to verify paths match. Consider a shared route constant or an integration test.

### API boundary — type confusion on headers field

`headers` arrives as a JSON **string** from the client (it's `<Input value={headers()}>`). Server must NOT `JSON.stringify()` it again — check `typeof body.headers === "string"` before stringifying. Double-encoding produces `"{\\"Content-Type\\": ...}"` which corrupts response headers.

### Local dev environment — both services must run

`npm run dev` only starts Vite (:5173). The Hono API (:8787) has no standalone dev server — `api/index.ts` only exports a `hono/vercel` serverless handler. For local testing:
- `npm run dev:api` runs the API on :8787 (via esbuild bundle + `@hono/node-server`, because `tsx` is broken on Node 22.20.0)
- `DATABASE_URL` must be set in the environment
- Both processes needed: `pm2 start "npm run dev" --name mock-web-dev` + `pm2 start "npm run dev:api" --name mock-web-api`

### Testing methodology — audit for the same anti-pattern

When a reactivity/route bug is found in one component, immediately grep the entire codebase for the same pattern. Don't discover the same class of bug one-by-one through manual testing. In this session, the `if (!props.x) return` pattern existed in both `Modal.tsx` and `ResponseRuleList.tsx` — finding the second one cost an extra test cycle.

### Process lesson — verify the full stack before UI testing

Before browser-testing, confirm: (1) both servers running, (2) health endpoint returns 200, (3) API + DB connectivity works. Starting browser tests with a broken backend wastes cycles on misattributed "UI bugs" that are actually 500/404 errors.

### Skeleton screens — mandatory for async data loading (2026-06-25)

Every page or component that loads data via `createResource` MUST render skeleton placeholders during loading. This prevents layout shift and misleading empty-state copy.

**Required pattern** (three-state rendering):
```tsx
// NEVER: <Show when={data()}>  — lumps loading and empty together
// INSTEAD:
<Show when={!data.loading} fallback={<Skeleton />}>
  <Show when={data()} fallback={<EmptyState />}>
    <RealContent />
  </Show>
</Show>
```

- `Skeleton` component: `src/components/ui/Skeleton.tsx` — width/height/radius props, CSS shimmer animation
- Skeleton layout MUST mimic the real component's dimensions and structure to avoid layout shift
- Use fixed skeleton item counts (4 endpoint cards, 3 rule cards) — not adaptive
- Empty-state copy ("No endpoints yet") renders ONLY after loading completes AND data is empty

### Vercel deployment — ESM relative imports MUST have `.js` extension (2026-06-25)

Vercel's Node.js ESM runtime compiles TypeScript to JavaScript but preserves the directory structure (`api/index.ts` → `/var/task/api/index.js`). **Every relative import MUST include the `.js` extension**, otherwise you get `ERR_MODULE_NOT_FOUND` at runtime.

```ts
// WRONG — works locally (esbuild auto-resolve) but fails on Vercel:
import { db } from "../db";

// CORRECT:
import { db } from "../db/index.js";
```

`npm run dev:api` and `npx tsc --noEmit` do NOT catch this — only `vercel dev` or actual deployment does.

### Vercel environment — `c.req.url` is relative, not absolute (2026-06-25)

In Vercel serverless, `c.req.url` returns a relative path like `/_manage/workspaces` instead of a full URL. `new URL(c.req.url)` throws `ERR_INVALID_URL`. Use `c.req.path` for pathname directly.

```ts
// WRONG — throws on Vercel:
const url = new URL(c.req.url);
const path = url.pathname;

// CORRECT:
const path = c.req.path;
```

### Vercel function signature — use named HTTP exports, not default (2026-06-25)

`export default handle(app)` uses the legacy `(req, res) => void` signature. Vercel warns the returned `Response` is ignored. Export named HTTP methods instead:

```ts
// WRONG:
export default handle(app);

// CORRECT:
const handler = handle(app);
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
```
