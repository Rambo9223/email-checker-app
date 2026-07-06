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
      <h3 className="panel-heading">Sender — {sender.Address}</h3>
      

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
        <BoolBadge value={sender.isFormatValid?sender.isFormatValid:false} label="Valid format" />
        <BoolBadge value={sender.catch_all} label="Catch-all domain" />
        <BoolBadge value={sender.Disposable_Domain} label="Disposable Domain" />
        <BoolBadge value={sender.Role_Based} label="Role Based" />
        <BoolBadge value={sender.Free_Domain} label="Free Domain" />
        <BoolBadge value={sender.GreyListed} label="GreyListed" />
        {/*Add Diagnosis result div , also add info badges to Boolbadges to explain each parameter */}
      </div>

      <p className="panel-footnote">
        Checked via {sender.provider ?? "no provider configured"}
      </p>
    </div>
  );
}
