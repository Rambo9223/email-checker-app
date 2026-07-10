// Mirror of server/src/types/email.ts — kept in sync manually, or via a shared package.
// Note: EmailAttachment here has no `content: Buffer` field since the server
// strips raw bytes before sending JSON over the wire.

export interface EmailAddress {
  name: string | null;
  email: string;
}

export interface EmailAttachmentTransport {
  filename: string | null;
  contentType: string;
  size: number;
  contentId: string | null;
  contentDisposition: string | null;
  contentBase64?: string;
}

export type AuthResult =
  | "pass"
  | "fail"
  | "softfail"
  | "neutral"
  | "none"
  | "permerror"
  | "temperror"
  | "unknown";

export interface SpfResult {
  result: AuthResult;
  domain: string | null;
  rawHeader: string | null;
}

export interface DkimSignature {
  result: AuthResult;
  domain: string | null;
  selector: string | null;
  rawHeader: string | null;
}

export interface DmarcResult {
  result: AuthResult;
  policy: string | null;
  rawHeader: string | null;
}

export interface AuthenticationResults {
  spf: SpfResult;
  dkim: DkimSignature[];
  dmarc: DmarcResult;
  compoundHeader: string | null;
}

export interface ReceivedHop {
  from: string | null;
  by: string | null;
  timestamp: string | null; // ISO string over the wire
  raw: string;
}

export interface EmailBody {
  text: string | null;
  html: string | null;
  extractedUrls: string[];
}

export interface ParsedEmailTransport {
  messageId: string | null;
  subject: string | null;
  date: string | null; // ISO string over the wire

  from: EmailAddress | null;
  replyTo: EmailAddress[];
  to: EmailAddress[];
  cc: EmailAddress[];
  bcc: EmailAddress[];

  body: EmailBody;
  attachments: EmailAttachmentTransport[];

  authentication: AuthenticationResults;
  receivedChain: ReceivedHop[];
  rawHeaders: Record<string, string | string[]>;

  sourceFormat: "eml" | "msg";
  parsedAt: string; // ISO string
}

export type ValidationStatus = string | "pass" | "fail" | "warn" | "unknown";

export interface ValidationCheck {
  name: string;
  status: ValidationStatus;
  detail: string;
  raw?: unknown;
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
  score:number|null
  provider: string | null;           // which API answered
  raw: unknown;
}

export interface ContentValidationResult {
  spamScore: string | null;
  spamThreshold: number | null;
  isSpam: boolean | null;
  rules: Array<{ name?: string | undefined; score: number; description: string }>;
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
  parsedEmail: ParsedEmailTransport;
  checks: {
    auth: ValidationCheck[];
    sender: SenderValidationResult | null;
    content: ContentValidationResult | null;
    urls: UrlScanResult[];
  };
  summary: {
    overallStatus: ValidationStatus;
    passCount: number;
    warnCount: number;
    failCount: number;
    generatedAt: string; // ISO string
  };
}

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
