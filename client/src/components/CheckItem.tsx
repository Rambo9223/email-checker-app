import type { ValidationStatus } from "../types/email";

interface CheckItemProps {
  label: string;
  status: ValidationStatus;
  detail: string;
}

const STATUS_GLYPH: Record<ValidationStatus, string> = {
  pass: "✓",
  warn: "!",
  fail: "✕",
  unknown: "?",
};

export function CheckItem({ label, status, detail }: CheckItemProps) {
  return (
    <div className={`check-item check-item--${status}`}>
      <span className="check-item__glyph" aria-hidden="true">
        {STATUS_GLYPH[status]}
      </span>
      <div className="check-item__body">
        <span className="check-item__label">{label}</span>
        <span className="check-item__detail">{detail}</span>
      </div>
    </div>
  );
}
