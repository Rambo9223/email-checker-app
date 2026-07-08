import { SenderValidationResult } from "../types/email";

const DEDUCTIONS = {
  statusInvalid: 60,
  statusUnknown: 20,
  statusCatchAll: 10,
  disposableDomain: 30,
  roleBased: 10,
  freeDomain: 5,
  greylisted: 15,
  catchAll: 10,
} as const;

export function scoreGenerator(result: SenderValidationResult): number | null {
  // Provider fallback — no real data available
  if (result.provider === "local-format-check") return null;

  let score = 100;
  const deductions: Array<{ reason: string; points: number }> = [];

  const deduct = (points: number, reason: string) => {
    score -= points;
    deductions.push({ reason, points });
  };

  // Status — most significant signal, only deduct once
  if (result.Status === "Invalid") {
    deduct(DEDUCTIONS.statusInvalid, "Invalid mailbox");
  } else if (result.Status === "Unknown") {
    deduct(DEDUCTIONS.statusUnknown, "Unverifiable mailbox");
  } else if (result.Status === "Catch-all") {
    deduct(DEDUCTIONS.statusCatchAll, "Catch-all domain");
  }

  if (result.Disposable_Domain)      deduct(DEDUCTIONS.disposableDomain, "Disposable domain");
  if (result.Role_Based)       deduct(DEDUCTIONS.roleBased,        "Role-based address");
  if (result.Free_Domain)      deduct(DEDUCTIONS.freeDomain,       "Free email provider");
  if (result.GreyListed)      deduct(DEDUCTIONS.greylisted,       "Greylisted server");
  if (result.catch_all)        deduct(DEDUCTIONS.catchAll,         "Catch-all flag");

  return Math.max(0, score); // floor at 0
}