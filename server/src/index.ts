import "dotenv/config";
import express from "express";
import cors from "cors";
import { emailRouter } from "./routes/routes_email";
import { errorHandler } from "./middleware/errorHandler"

const app = express();
const PORT = process.env.PORT ?? 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(
  cors({
    // In development your Vite frontend runs on 5173
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

app.use(express.json({ limit: "1mb" }));

// ─── Routes ──────────────────────────────────────────────────────────────────

app.use("/api/email", emailRouter);

// ─── Error handler (must be last) ────────────────────────────────────────────

app.use(errorHandler);

// ─── Start ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅  Email checker server running on http://localhost:${PORT}`);
  console.log(`   POST /api/email/check  — upload an .eml or .msg file`);
  console.log(`   GET  /api/email/health — check active providers`);
});

export default app;
