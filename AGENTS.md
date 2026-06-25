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
  index.css             CSS custom properties (dark Voltagent theme)
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
- **Styling**: Inline styles only, kebab-case property names (`"font-size"` not `fontSize`), CSS custom-property tokens via `var(--color-...)`.
- **Components**: `export default function Name(props)`, `splitProps` for rest spread.
- **Router**: `@solidjs/router` v0.16 — `<Route>` directly in JSX, `<A href>`, `useNavigate()`, `useParams<T>()`.
- **Data**: `createResource(source, fetcher)`, `refetch()` on mutate.
- **State**: `createSignal` local; module-level signal + hook for global state.
- **Backend**: `c.json({ error, details }, status)`. 400 validation, 401 auth, 404 not-found.
- **DB**: Drizzle query API for reads, `insert/update/delete` for writes. UUID via `defaultRandom()`.
- **Env**: No dotenv. `DATABASE_URL` via CLI or Vercel dashboard.

## Notes