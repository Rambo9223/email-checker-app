import PostalMime from "postal-mime";
import { ParsedEmail, AuthenticationResults, ReceivedHop, SpfResult, DkimSignature, DmarcResult, EmailAddress } from "../types/email";
import { extractUrls } from "../utils/extractUrls";

// ─── Header helpers ───────────────────────────────────────────────────────────

function parseAuthResultHeader(raw: string | null): AuthenticationResults {
  const def = (result = "unknown") => ({ result, domain: null, rawHeader: raw } as SpfResult);

  if (!raw) {
    return {
      spf: def(),
      dkim: [],
      dmarc: { result: "unknown", policy: null, rawHeader: null },
      compoundHeader: null,
    };
  }

  // SPF
  const spfMatch = raw.match(/spf=(\S+)/i);
  const spfDomain = raw.match(/smtp\.mailfrom=([^\s;]+)/i);
  const spf: SpfResult = {
    result: (spfMatch?.[1]?.toLowerCase() ?? "unknown") as SpfResult["result"],
    domain: spfDomain?.[1] ?? null,
    rawHeader: raw,
  };

  // DKIM — can appear multiple times
  const dkimRegex = /dkim=(\S+)[^;]*header\.d=([^\s;]+)/gi;
  const dkim: DkimSignature[] = [];
  let m: RegExpExecArray | null;
  while ((m = dkimRegex.exec(raw)) !== null) {
    dkim.push({ result: m[1].toLowerCase() as DkimSignature["result"], domain: m[2], selector: null, rawHeader: raw });
  }

  // DMARC
  const dmarcMatch = raw.match(/dmarc=(\S+)/i);
  const policyMatch = raw.match(/p=([^\s;]+)/i);
  const dmarc: DmarcResult = {
    result: (dmarcMatch?.[1]?.toLowerCase() ?? "unknown") as DmarcResult["result"],
    policy: policyMatch?.[1] ?? null,
    rawHeader: raw,
  };

  return { spf, dkim, dmarc, compoundHeader: raw };
}

function parseReceivedHeader(raw: string): ReceivedHop {
  const fromMatch = raw.match(/from\s+(\S+)/i);
  const byMatch = raw.match(/by\s+(\S+)/i);
  // Received timestamps are after a semicolon at the end
  const dateStr = raw.split(";").pop()?.trim();
  const timestamp = dateStr ? new Date(dateStr) : null;

  return {
    from: fromMatch?.[1] ?? null,
    by: byMatch?.[1] ?? null,
    timestamp: timestamp && !isNaN(timestamp.getTime()) ? timestamp : null,
    raw,
  };
}

function toEmailAddress(addr: { name?: string; address?: string } | undefined): EmailAddress | null {
  if (!addr?.address) return null;
  return { name: addr.name ?? null, email: addr.address };
}

function toEmailAddressList(list: Array<{ name?: string; address?: string }> | undefined): EmailAddress[] {
  return (list ?? []).flatMap((a) => (toEmailAddress(a) ? [toEmailAddress(a)!] : []));
}

function toBuffer(content: string | ArrayBuffer | Uint8Array): Buffer {
  if (typeof content === "string") return Buffer.from(content, "base64");
  return Buffer.from(new Uint8Array(content));
}

// ─── Main parser ─────────────────────────────────────────────────────────────

export async function parseEml(buffer: Buffer): Promise<ParsedEmail> {
  const parser = new PostalMime();
  const email = await parser.parse(buffer);

  // Raw headers as a flat Record
  const rawHeaders: Record<string, string | string[]> = {};
  for (const h of email.headers ?? []) {
    const key = h.key.toLowerCase();
    const existing = rawHeaders[key];
    if (existing === undefined) {
      rawHeaders[key] = h.value;
    } else if (Array.isArray(existing)) {
      existing.push(h.value);
    } else {
      rawHeaders[key] = [existing, h.value];
    }
  }

  // Authentication
  const authHeader = Array.isArray(rawHeaders["authentication-results"])
    ? rawHeaders["authentication-results"][0]
    : (rawHeaders["authentication-results"] as string | undefined) ?? null;
  const authentication = parseAuthResultHeader(authHeader ?? null);

  // Received chain (oldest hop first)
  const receivedRaw = rawHeaders["received"];
  const receivedList: string[] = Array.isArray(receivedRaw)
    ? receivedRaw
    : receivedRaw
    ? [receivedRaw]
    : [];
  const receivedChain: ReceivedHop[] = receivedList.map(parseReceivedHeader).reverse();

  // Body & URLs
  const combinedText = [email.text ?? "", email.html ?? ""].join(" ");
  const extractedUrls = extractUrls(combinedText);

  return {
    messageId: email.messageId ?? null,
    subject: email.subject ?? null,
    date: email.date ? new Date(email.date) : null,

    from: toEmailAddress(email.from),
    replyTo: toEmailAddressList(email.replyTo),
    to: toEmailAddressList(email.to),
    cc: toEmailAddressList(email.cc),
    bcc: toEmailAddressList(email.bcc),

    body: {
      text: email.text ?? null,
      html: email.html ?? null,
      extractedUrls,
    },

    // type errors with attachments but currently working
    attachments: (email.attachments ?? []).map((a) => {
      const content = toBuffer(a.content); 
      //console.log(content);
      return {
      filename: a.filename ?? null,
      contentType: a.mimeType ?? "application/octet-stream",
      size: 10, //.content.byteLength,
      contentId: a.contentId ?? null,
      contentDisposition: a.disposition ?? null,
      content: content  ,//(a.content),
      contentBase64: content.toString("base64"),
    }}),

    authentication,
    receivedChain,
    rawHeaders,

    sourceFormat: "eml",
    parsedAt: new Date(),
  };
}
