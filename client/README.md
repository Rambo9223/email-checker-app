# Email Checker — Frontend

React + TypeScript + Vite client for uploading `.eml` / `.msg` files and viewing validation results.

## Quick Start

```bash
cd frontend
npm install
cp .env.example .env   # point at your running server
npm run dev             # http://localhost:5173
```

Make sure the [server](../server) is running first (`npm run dev` in `server/`, default port `3001`).

## Structure

```
frontend/
├── src/
│   ├── App.tsx                    ← top-level state machine (idle/loading/success/error)
│   ├── App.css                    ← all styling — diagnostic/technical aesthetic
│   ├── types/
│   │   └── email.ts               ← mirrors server/src/types/email.ts (no Node deps)
│   ├── hooks/
│   │   └── useEmailChecker.ts     ← upload + fetch logic, exposes a small state machine
│   ├── utils/
│   │   └── format.ts              ← date/byte/string formatting helpers
│   └── components/
│       ├── EmailDropzone.tsx      ← drag & drop / click-to-browse file input
│       ├── LoadingState.tsx
│       ├── ErrorState.tsx
│       ├── ValidationResults.tsx  ← composes all result panels
│       ├── SummaryBanner.tsx      ← overall pass/warn/fail rollup
│       ├── EmailEnvelope.tsx      ← from/to/subject/date/attachments
│       ├── AuthPanel.tsx          ← SPF/DKIM/DMARC checks
│       ├── CheckItem.tsx          ← single check row (used by AuthPanel)
│       ├── SenderPanel.tsx        ← sender email validity
│       ├── ContentPanel.tsx       ← spam score + triggered rules
│       └── UrlsPanel.tsx          ← extracted links + safety status
```

## How it connects to the server

1. `EmailDropzone` accepts a `.eml`/`.msg` file and hands it to `useEmailChecker`.
2. The hook POSTs it as `multipart/form-data` to `${VITE_API_BASE_URL}/api/email/check`.
3. The server parses + validates, returns a `ValidationReport` JSON.
4. `ValidationResults` renders every section of that report.

If you change the shape of `ValidationReport` on the server, update `src/types/email.ts` here to match — these are currently kept in sync manually since they live in separate npm projects. (If you want a single source of truth, consider extracting both into a shared workspace package later.)

## Notes

- The dropzone is `.eml`/`.msg` only, validated both by client-side extension check and `accept` attribute (the server enforces it again).
- All requests are unauthenticated direct calls to `localhost` — fine for local use, but add an auth layer before deploying this anywhere public.
- Styling uses CSS custom properties in `App.css`, no Tailwind/component library — kept dependency-light since this is a single-purpose tool.
