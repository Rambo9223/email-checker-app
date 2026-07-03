# Email Checker — Express Server

Parses `.eml` and `.msg` files, runs validation checks, and returns a structured JSON report.

## Quick Start

```bash
cd server
npm install
cp .env.example .env   # add your API keys
npm run dev            # starts on http://localhost:3001
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/email/check` | Upload an `.eml` or `.msg` file (field: `file`) |
| `GET`  | `/api/email/health` | Check which validation providers are active |

### Example cURL

```bash
curl -X POST http://localhost:3001/api/email/check \
  -F "file=@/path/to/your/email.eml"
```

## Validation Pipeline

```
Upload (.eml / .msg)
   │
   ├─ emlParser.ts  ──► postal-mime      → ParsedEmail
   └─ msgParser.ts  ──► @kenjiuno/msgreader
          │
          ├─ headerValidator.ts   (SPF / DKIM / DMARC — no API key needed)
          ├─ senderValidator.ts   (Abstract API — optional)
          ├─ contentValidator.ts  (Postmark SpamCheck — free, no key needed)
          └─ urlValidator.ts      (Google Safe Browsing — optional)
                    │
                    └─► ValidationReport (JSON)
```

## Providers & API Keys

| Provider | Purpose | Key Required |
|----------|---------|-------------|
| Built-in header parsing | SPF / DKIM / DMARC | ❌ |
| [Postmark SpamCheck](https://spamcheck.postmarkapp.com) | Content spam score | ❌ |
| [Abstract API](https://www.abstractapi.com/) | Sender email validity | ✅ `ABSTRACT_API_KEY` |
| [Google Safe Browsing](https://developers.google.com/safe-browsing) | URL threat scan | ✅ `GOOGLE_SAFE_BROWSING_KEY` |

Without API keys the server still works — sender validation falls back to a local format check and URL scanning is skipped.

## Using Types in the Frontend

Copy `src/types/email.ts` into your Vite project at `src/types/email.ts`.  
All types are pure TypeScript (no Node.js imports).

```ts
import type { ValidationReport, EmailApiResponse } from "./types/email";

const res = await fetch("http://localhost:3001/api/email/check", {
  method: "POST",
  body: formData,           // FormData with field "file"
});
const json: EmailApiResponse = await res.json();
if (json.success) {
  const report: ValidationReport = json.data;
}
```

## Project Structure

```
server/
├── src/
│   ├── index.ts                  ← Express app entry
│   ├── types/
│   │   └── email.ts              ← All shared types
│   ├── parsers/
│   │   ├── emlParser.ts          ← .eml → ParsedEmail
│   │   └── msgParser.ts          ← .msg → ParsedEmail
│   ├── validators/
│   │   ├── headerValidator.ts    ← SPF/DKIM/DMARC
│   │   ├── senderValidator.ts    ← Email address validity
│   │   ├── contentValidator.ts   ← Spam scoring
│   │   └── urlValidator.ts       ← Link safety
│   ├── routes/
│   │   └── email.ts              ← POST /check, GET /health
│   └── middleware/
│       └── errorHandler.ts       ← Centralised error responses
├── .env.example
├── package.json
└── tsconfig.json
```
