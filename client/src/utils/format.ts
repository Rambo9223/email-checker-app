import type { ValidationStatus } from "../types/email";

export const STATUS_LABEL: Record<ValidationStatus, string> = {
  pass: "Pass",
  warn: "Warning",
  fail: "Fail",
  unknown: "Not checked",
};

export function formatDate(iso: string | null): string {
  if (!iso) return "Unknown";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Unknown";
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}
