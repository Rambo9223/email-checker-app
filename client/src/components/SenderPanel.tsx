import type { SenderValidationResult } from "../types/email";

interface SenderPanelProps {
  sender: SenderValidationResult | null;
}

function BoolBadge({ value, label }: { value: boolean | null; label: string }) {
  const state = value === null ? "unknown" : value ? "yes" : "no";
  return (
    <div className={`bool-badge bool-badge--${state}`}>
      <span className="bool-badge__label">{label}</span>
      <span className="bool-badge__value">
        {value === null ? "Not checked" : value ? "Yes" : "No"}
      </span>
    </div>
  );
}

export function SenderPanel({ sender }: SenderPanelProps) {
  if (!sender) {
    return (
      <div className="sender-panel">
        <h3 className="panel-heading">Sender</h3>
        <p className="panel-empty">No sender address found to validate.</p>
      </div>
    );
  }

  return (
    <div className="sender-panel">
      <h3 className="panel-heading">Sender — {sender.email}</h3>

      {sender.score !== null && (
        <div className="sender-panel__score">
          <span className="sender-panel__score-label">Quality score</span>
          <div className="sender-panel__score-bar">
            <div
              className="sender-panel__score-fill"
              style={{ width: `${sender.score}%` }}
            />
          </div>
          <span className="sender-panel__score-value">{sender.score}/100</span>
        </div>
      )}

      <div className="sender-panel__grid">
        <BoolBadge value={sender.isFormatValid} label="Valid format" />
        <BoolBadge value={sender.isDomainValid} label="Domain resolves" />
        <BoolBadge value={sender.isMxValid} label="MX record found" />
        <BoolBadge value={sender.isDisposable} label="Disposable" />
        <BoolBadge value={sender.isCatchAll} label="Catch-all domain" />
      </div>

      <p className="panel-footnote">
        Checked via {sender.provider ?? "no provider configured"}
      </p>
    </div>
  );
}
