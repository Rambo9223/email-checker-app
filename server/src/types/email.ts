// ─────────────────────────────────────────────
// Core address / attachment primitives
// ─────────────────────────────────────────────

export interface EmailAddress {
  name: string | null;
  email: string;
}

export interface EmailAttachment {
  filename: string | null;
  contentType: string;
  size: number|string;
  contentId: string | null;       // for inline images (<cid:...>)
  contentDisposition: string | null;
  content: Buffer;                 // raw bytes — strip before sending to client
  contentBase64?: string;          // base64 version for API / client transport
}

// ─────────────────────────────────────────────
// Authentication / deliverability headers
// ─────────────────────────────────────────────

export type AuthResult = "pass" | "fail" | "softfail" | "neutral" | "none" | "permerror" | "temperror" | "unknown" | string;

export interface SpfResult {
  result: AuthResult;
  domain: string | null;
  rawHeader: string | null;
}

export interface DkimSignature {
  result: AuthResult;
  domain: string | null;        // d= tag
  selector: string | null;      // s= tag
  rawHeader: string | null;
}

export interface DmarcResult {
  result: AuthResult;
  policy: string | null;        // p= tag  (none | quarantine | reject)
  rawHeader: string | null;
}

export interface AuthenticationResults {
  spf: SpfResult;
  dkim: DkimSignature[];        // there can be multiple DKIM signatures
  dmarc: DmarcResult;
  compoundHeader: string | null; // raw Authentication-Results header
}

// ─────────────────────────────────────────────
// Routing / infrastructure headers
// ─────────────────────────────────────────────

export interface ReceivedHop {
  from: string | null;
  by: string | null;
  timestamp: Date | null;
  raw: string;
}

// ─────────────────────────────────────────────
// Parsed email body
// ─────────────────────────────────────────────

export interface EmailBody {
  text: string | null;          // plain-text version
  html: string | null;          // HTML version
  extractedUrls: string[];      // all hrefs / plain-text URLs found in body
}

// ─────────────────────────────────────────────
// Full parsed email — output of the parsers
// ─────────────────────────────────────────────

export interface ParsedEmail {
  // Envelope
  messageId: string | null;
  subject: string | null;
  date: Date | null;

  // Participants
  from: EmailAddress | null;
  replyTo: EmailAddress[];
  to: EmailAddress[];
  cc: EmailAddress[];
  bcc: EmailAddress[];

  // Body
  body: EmailBody;

  // Attachments
  attachments: EmailAttachment[];

  // Auth
  authentication: AuthenticationResults;

  // Routing
  receivedChain: ReceivedHop[];

  // Raw storage for anything we didn't explicitly parse
  rawHeaders: Record<string, string | string[]>;

  // Source metadata
  sourceFormat: "eml" | "msg" | string;
  parsedAt: Date;
}

// ─────────────────────────────────────────────
// Validation results — returned by validators
// ─────────────────────────────────────────────

export type ValidationStatus = "pass" | "fail" | "warn" | "unknown";

export interface ValidationCheck {
  name: string;
  status: ValidationStatus;
  detail: string;
  raw?: unknown;                // raw API response or header value for debugging
}

export interface SenderValidationResult {
  Address: string,
  isFormatValid?: boolean;
  catch_all:boolean|null,
  Status:string,
  Disposable_Domain:boolean | null,
  Role_Based: boolean | null ,
  Free_Domain: boolean | null,
  GreyListed: boolean | null ,
  Diagnosis: string
  /*
  isFormatValid: boolean;
  isDomainValid: boolean | null;     // null = not checked
  isMxValid: boolean | null;
  isDisposable: boolean | null;
  isCatchAll: boolean | null;
  score: number | null;              // 0–100 from external API, if available
  */
  score?:number| null,
  provider: string | null;           // which API answered
  raw: unknown;
}

export interface ContentValidationResult {
  spamScore: number | null;          // e.g. SpamAssassin score
  spamThreshold: number | null;
  isSpam: boolean | null;
  rules: Array<{ name: string; score: number; description: string }>;
  provider: string | null;
  raw: unknown;
}

export interface UrlScanResult {
  url: string;
  isSafe: boolean | null;
  threatTypes: string[];
  provider: string | null;
  raw: unknown;
}

export interface ValidationReport {
  parsedEmail: Omit<ParsedEmail, "attachments"> & {
    attachments: Omit<EmailAttachment, "content">[];  // strip raw Buffer for transport
  };
  checks: {
    auth: ValidationCheck[];          // SPF / DKIM / DMARC checks
    sender: SenderValidationResult | null;
    content: ContentValidationResult | null;
    urls: UrlScanResult[];
  };
  summary: {
    overallStatus: ValidationStatus;
    passCount: number;
    warnCount: number;
    failCount: number;
    generatedAt: Date;
  };
}

// ─────────────────────────────────────────────
// HTTP API shapes (request / response)
// ─────────────────────────────────────────────

export interface ParseEmailResponse {
  success: true;
  data: ValidationReport;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: string;
}

export type EmailApiResponse = ParseEmailResponse | ApiErrorResponse;
