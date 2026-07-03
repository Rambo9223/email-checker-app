import axios from "axios";
import { UrlScanResult } from "../types/email";

// ─── Provider: Google Safe Browsing v4 ───────────────────────────────────────
// Docs: https://developers.google.com/safe-browsing/v4/lookup-api
// Set GOOGLE_SAFE_BROWSING_KEY in your .env to enable.

const THREAT_TYPES = [
  "MALWARE",
  "SOCIAL_ENGINEERING",
  "UNWANTED_SOFTWARE",
  "POTENTIALLY_HARMFUL_APPLICATION",
];

async function scanWithGoogleSafeBrowsing(urls: string[]): Promise<UrlScanResult[]> {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;
  if (!apiKey) throw new Error("GOOGLE_SAFE_BROWSING_KEY not set");

  console.log(apiKey);

  const body = {
    client: { clientId: "email-checker", clientVersion: "1.0.0" },
    threatInfo: {
      threatTypes: THREAT_TYPES,
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: urls.map((u) => ({ url: u })),
    },
  };

  const { data } = await axios.post(
    `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
    body,
    { timeout: 10_000 }
  );

  // Build a threat map
  const threatMap: Record<string, string[]> = {};
  for (const match of data.matches ?? []) {
    const url: string = match.threat?.url;
    if (!url) continue;
    if (!threatMap[url]) threatMap[url] = [];
    threatMap[url].push(match.threatType);
  }

  return urls.map((url) => ({
    url,
    isSafe: !threatMap[url],
    threatTypes: threatMap[url] ?? [],
    provider: "GoogleSafeBrowsing",
    raw: threatMap[url] ?? null,
  }));
}

// ─── Fallback: mark unknown when no API key ───────────────────────────────────

function buildUnknownResults(urls: string[]): UrlScanResult[] {
  return urls.map((url) => ({
    url,
    isSafe: null,
    threatTypes: [],
    provider: null,
    raw: null,
  }));
}

// ─── Public function ──────────────────────────────────────────────────────────

export async function scanUrls(urls: string[]): Promise<UrlScanResult[]> {
  if (urls.length === 0) return [];

  // Deduplicate & cap at 500 (API limit)
  const uniqueUrls = [...new Set(urls)].slice(0, 500);

  try {
    if (process.env.GOOGLE_SAFE_BROWSING_KEY) {
      return await scanWithGoogleSafeBrowsing(uniqueUrls);
    }
    return buildUnknownResults(uniqueUrls);
  } catch (err) {
    console.error("[urlValidator] error:", err);
    return buildUnknownResults(uniqueUrls);
  }
}
