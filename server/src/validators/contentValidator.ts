import axios from "axios";
import { ContentValidationResult } from "../types/email";

// ─── Provider: Postmark Spam Check (free, no key needed) ─────────────────────
// Docs: https://spamcheck.postmarkapp.com

interface PostmarkSpamResponse {
  success: boolean;
  score: number;
  rules: Array<{ score: number; name: string; description: string }>;
}

const SPAM_THRESHOLD = 5.0; // Standard SpamAssassin threshold

export async function validateContent(
  text: string | null,
  html: string | null
): Promise<ContentValidationResult | null> {
  const body = html ?? text;
  if (!body) return null;

  try {
    const { data } = await axios.post<PostmarkSpamResponse>(
      "https://spamcheck.postmarkapp.com/filter",
      { email: body, options: "long" },
      {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        timeout: 10_000,
      }
    );

    return {
      spamScore: data.score,
      spamThreshold: SPAM_THRESHOLD,
      isSpam: data.score >= SPAM_THRESHOLD,
      rules: (data.rules ?? []).map((r) => ({
        name: r.name,
        score: r.score,
        description: r.description,
      })),
      provider: "PostmarkSpamCheck",
      raw: data,
    };
  } catch (err) {
    console.error("[contentValidator] error:", err);
    return null;
  }
}
