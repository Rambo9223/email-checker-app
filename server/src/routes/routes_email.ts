import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import { parseEml } from "../parsers/emlParser";
import { parseMsg } from "../parsers/msgParser";
import { validateAuthHeaders, summariseChecks } from "../validators/headerValidator";
import { validateSender } from "../validators/senderValidator";
import { validateContent } from "../validators/contentValidator";
import { scanUrls } from "../validators/urlValidator";
import { ParsedEmail, ValidationReport, EmailApiResponse } from "../types/email";

// ─── Multer — memory storage, 25 MB limit ────────────────────────────────────

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".eml" || ext === ".msg") return cb(null, true);
    cb(new Error("Only .eml and .msg files are accepted"));
  },
});

// ─── Helper: strip raw Buffer before sending to client ───────────────────────

function sanitiseForTransport(email: ParsedEmail): ValidationReport["parsedEmail"] {
  return {
    ...email,
    attachments: email.attachments.map(({ content: _buf, ...rest }) => rest),
  };
}

// ─── Router ──────────────────────────────────────────────────────────────────

export const emailRouter = Router();

/**
 * POST /api/email/check
 * Accepts a single .eml or .msg file upload (field name: "file").
 * Returns a full ValidationReport as JSON.
 */
emailRouter.post(
  "/check",
  upload.single("file"),
  async (req: Request, res: Response<EmailApiResponse>) => {
    //console.log(req.headers);
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();

    try {
      // 1. Parse
      let parsed: ParsedEmail;
      if (ext === ".eml") {
        parsed = await parseEml(req.file.buffer);
        //console.log(parsed);
      } else if (ext === ".msg") {
        parsed = await parseMsg(req.file.buffer);
      } else {
        return res.status(400).json({ success: false, error: "Unsupported file type" });
      }

      // 2. Run validators in parallel
      const [senderResult, contentResult, urlResults] = await Promise.all([
        validateSender(parsed.from?.email ?? null),
        validateContent(parsed.body.text, parsed.body.html),
        scanUrls(parsed.body.extractedUrls),
      ]);

      // 3. Auth header checks (synchronous)
      const authChecks = validateAuthHeaders(parsed);

      // 4. Build summary
      const allChecks = [...authChecks];
      const summary = {
        ...summariseChecks(allChecks),
        generatedAt: new Date(),
      };

      // 5. Compose report
      const report: ValidationReport = {
        parsedEmail: sanitiseForTransport(parsed),
        checks: {
          auth: authChecks,
          sender: senderResult,
          content: contentResult,
          urls: urlResults,
        },
        summary,
      };

      return res.json({ success: true, data: report });
    } catch (err) {
      console.error("[POST /api/email/check] error:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to process email",
        details: err instanceof Error ? err.message : String(err),
      });
    }
  }
);

/**
 * GET /api/email/health
 * Quick liveness check — useful for frontend polling.
 */
emailRouter.get("/health", (_req, res) => {
  res.json({
    ok: true,
    providers: {
      senderValidation: !!process.env.MY_EMAIL_VERIFIER_KEY ? "My Email Verifier" : "local-format-only",
      urlScanning: !!process.env.GOOGLE_SAFE_BROWSING_KEY ? "GoogleSafeBrowsing" : "disabled",
      contentSpam: "PostmarkSpamCheck (free)",
    },
  });
});
