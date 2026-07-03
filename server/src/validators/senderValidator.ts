import axios from "axios";
import { SenderValidationResult } from "../types/email";

// ─── Provider: Abstract API ───────────────────────────────────────────────────
// Docs: https://www.abstractapi.com/api/email-verification-validation-api
// Set ABSTRACT_API_KEY in your .env to enable.

async function validateWithAbstractApi(email: string): Promise<SenderValidationResult> {
  const apiKey = process.env.ABSTRACT_API_KEY;
  if (!apiKey) throw new Error("ABSTRACT_API_KEY not set");

  const { data } = await axios.get("https://emailvalidation.abstractapi.com/v1/", {
    params: { api_key: apiKey, email },
    timeout: 8000,
  });

  return {
    email,
    isFormatValid: data.is_valid_format?.value ?? false,
    isDomainValid: data.is_mx_found?.value ?? null,
    isMxValid: data.is_mx_found?.value ?? null,
    isDisposable: data.is_disposable_email?.value ?? null,
    isCatchAll: data.is_catchall_email?.value ?? null,
    score: data.quality_score != null ? Math.round(data.quality_score * 100) : null,
    provider: "AbstractAPI",
    raw: data,
  };
}

// ─── Fallback: format-only check (no external call) ──────────────────────────

function validateFormatOnly(email: string): SenderValidationResult {
  const formatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    email,
    isFormatValid: formatRegex.test(email),
    isDomainValid: null,
    isMxValid: null,
    isDisposable: null,
    isCatchAll: null,
    score: null,
    provider: "local-format-check",
    raw: null,
  };
}

// ─── Public function ──────────────────────────────────────────────────────────

export async function validateSender(email: string | null): Promise<SenderValidationResult | null> {
  if (!email) return null;

  try {
    if (process.env.ABSTRACT_API_KEY) {
      return await validateWithAbstractApi(email);
    }
    // Add additional providers here (ZeroBounce, Hunter.io, etc.)
    return validateFormatOnly(email);
  } catch (err) {
    console.error("[senderValidator] error:", err);
    // Fall back to local format check so the rest of the pipeline continues
    return validateFormatOnly(email);
  }
}
