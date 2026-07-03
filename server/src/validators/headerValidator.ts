import { ParsedEmail, ValidationCheck, ValidationStatus } from "../types/email";

function statusFromAuthResult(result: string): ValidationStatus {
  if (result === "pass") return "pass";
  if (result === "softfail" || result === "neutral") return "warn";
  if (result === "none" || result === "unknown") return "unknown";
  return "fail";
}

export function validateAuthHeaders(email: ParsedEmail): ValidationCheck[] {
  const checks: ValidationCheck[] = [];
  const { spf, dkim, dmarc } = email.authentication;

  // ── SPF ─────────────────────────────────────────────────────────────────────
  checks.push({
    name: "SPF",
    status: statusFromAuthResult(spf.result),
    detail: spf.result === "pass"
      ? `SPF passed for domain ${spf.domain ?? "unknown"}`
      : spf.result === "none" || spf.result === "unknown"
      ? "No SPF record found or not checked"
      : `SPF ${spf.result} for domain ${spf.domain ?? "unknown"}`,
    raw: spf,
  });

  // ── DKIM ────────────────────────────────────────────────────────────────────
  if (dkim.length === 0) {
    checks.push({ name: "DKIM", status: "unknown", detail: "No DKIM signature found", raw: null });
  } else {
    for (const sig of dkim) {
      checks.push({
        name: `DKIM (${sig.domain ?? "?"})`,
        status: statusFromAuthResult(sig.result),
        detail: sig.result === "pass"
          ? `DKIM signature valid for ${sig.domain}`
          : `DKIM ${sig.result} for ${sig.domain ?? "unknown"}`,
        raw: sig,
      });
    }
  }

  // ── DMARC ───────────────────────────────────────────────────────────────────
  checks.push({
    name: "DMARC",
    status: statusFromAuthResult(dmarc.result),
    detail: dmarc.result === "pass"
      ? `DMARC passed (policy: ${dmarc.policy ?? "none"})`
      : dmarc.result === "none" || dmarc.result === "unknown"
      ? "No DMARC record found or not checked"
      : `DMARC ${dmarc.result} (policy: ${dmarc.policy ?? "none"})`,
    raw: dmarc,
  });

  // ── Reply-To mismatch ────────────────────────────────────────────────────────
  if (email.from && email.replyTo.length > 0) {
    const fromDomain = email.from.email.split("@")[1]?.toLowerCase();
    const replyDomains = email.replyTo.map((r) => r.email.split("@")[1]?.toLowerCase());
    const mismatch = replyDomains.some((d) => d && d !== fromDomain);
    checks.push({
      name: "Reply-To Domain",
      status: mismatch ? "warn" : "pass",
      detail: mismatch
        ? `Reply-To domain differs from From domain (${replyDomains.join(", ")} vs ${fromDomain})`
        : "Reply-To domain matches From domain",
      raw: { fromDomain, replyDomains },
    });
  }

  return checks;
}

export function summariseChecks(checks: ValidationCheck[]): {
  overallStatus: ValidationStatus;
  passCount: number;
  warnCount: number;
  failCount: number;
} {
  const passCount = checks.filter((c) => c.status === "pass").length;
  const warnCount = checks.filter((c) => c.status === "warn").length;
  const failCount = checks.filter((c) => c.status === "fail").length;

  let overallStatus: ValidationStatus = "pass";
  if (failCount > 0) overallStatus = "fail";
  else if (warnCount > 0) overallStatus = "warn";
  else if (passCount === 0) overallStatus = "unknown";

  return { overallStatus, passCount, warnCount, failCount };
}
