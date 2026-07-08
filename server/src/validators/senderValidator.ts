import axios from "axios";
import { SenderValidationResult } from "../types/email";
import { scoreGenerator } from "../utils/scoreGenerator";


// We are going to change to a different API Provider with a free plan 

// New - 


// ─── Provider: My Email Verifer ───────────────────────────────────────────────────
// Docs: https://client.myemailverifier.com/apis/settings
// Set MY_EMAIL_VERIFIER_KEY_API_KEY in your .env to enable.


async function validateWithMyEmailVerifier(email: string): Promise<SenderValidationResult> {
  const apiKey = process.env.MY_EMAIL_VERIFIER_KEY;
  if (!apiKey) throw new Error("API_KEY not set");
  const url = `https://api.myemailverifier.com/api/validate_single.php?apikey=${apiKey}&email=${email}`
  const { data } = await axios.get(url, {
    //params: { api_key: apiKey, email },
    timeout: 10000,
  });
  //console.log(data);


  return {

    Address:data.Address,
    catch_all:data.catch_all,
    Status:data.Status,
    Disposable_Domain:data.Disposable_Domain,
    Role_Based:data.Role_Based,
    Free_Domain:data.Free_Domain,
    GreyListed:data.GreyListed,
    Diagnosis:data.Diagnosis,
    score:scoreGenerator(data),
    provider: "My Email Verifier",
    raw: data,
  };
}

// ─── Fallback: format-only check (no external call) ──────────────────────────

function validateFormatOnly(email: string): SenderValidationResult {
  const formatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    Address:email,
    isFormatValid: formatRegex.test(email),
    catch_all:null,
    Status:"Unknown",
    Disposable_Domain:null,
    Role_Based:null,
    Free_Domain:null,
    GreyListed:null,
    Diagnosis:"Unable to check mailbox",
    score: null,
    provider: "local-format-check",
    raw: null,
  };
}

// ─── Public function ──────────────────────────────────────────────────────────

export async function validateSender(email: string | null): Promise<SenderValidationResult | null> {
  if (!email) return null;

  try {
    if (process.env.MY_EMAIL_VERIFIER_KEY) {
      return await validateWithMyEmailVerifier(email);
    }
    // Add additional providers here (ZeroBounce, Hunter.io, etc.)
    return validateFormatOnly(email);
  } catch (err) {
    console.error("[senderValidator] error:", err);
    // Fall back to local format check so the rest of the pipeline continues
    return validateFormatOnly(email);
  }
}
