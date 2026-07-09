import type { SenderValidationResult } from "../types/email";
import { QuestionMarkIcon } from "../assets/icons";
import { senderValidationInfo } from "../utils/senderValidationInfo";

interface SenderPanelProps {
  sender: SenderValidationResult | null;
}

// Keys of senderValidationInfo that have tooltip text
type TooltipKey = keyof typeof senderValidationInfo;

function BoolBadge({
  value,
  label,
  tooltipKey,
}: {
  value: boolean | null;
  label: string;
  tooltipKey?: TooltipKey;
}) {
  const state = value === null ? "unknown" : value ? "yes" : "no";
  return (
    <div className={`bool-badge bool-badge--${state}`}>
      <span className="bool-badge__label">
        {label}
        {tooltipKey && (
          <span className="tooltip-anchor">
            <QuestionMarkIcon
              height="12"
              width="12"
              className="bi bi-question-circle tooltip-anchor__icon"
            />
            <div className="tooltip-box" role="tooltip">
              {senderValidationInfo[tooltipKey]}
            </div>
          </span>
        )}
      </span>
      <span className="bool-badge__value">
        {value === null ? "Not checked" : value ? "Yes" : "No"}
      </span>
    </div>
  );
}

function TextBadge({
  value,
  label,
  score,
}: {
  value: string;
  label: string;
  score: number | null;
}) {
  let state;
  if (score === null) {
    state = "unknown";
  } else if (score > 65) {
    state = "no";
  } else {
    state = "yes";
  }

  return (
    <div className={`bool-badge bool-badge--${state}`}>
      <span className="bool-badge__label">{label}</span>
      <span className="bool-badge__value">
        {value.length < 40 ? value : `${value.substring(0, 40)}...`}
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
        <TextBadge score={sender.score} value={sender.Diagnosis} label="Diagnosis" />
        {sender.isFormatValid ? (
          <BoolBadge
            value={sender.isFormatValid}
            label="Valid format"
            tooltipKey="isFormatValid"
          />
        ) : (
          <TextBadge score={sender.score} value={sender.Status} label="Valid Format" />
        )}
        <BoolBadge value={sender.catch_all}         label="Catch-all domain"   tooltipKey="catch_all" />
        <BoolBadge value={sender.Disposable_Domain} label="Disposable Domain"  tooltipKey="Disposable_Domain" />
        <BoolBadge value={sender.Role_Based}        label="Role Based"         tooltipKey="Role_Based" />
        <BoolBadge value={sender.Free_Domain}       label="Free Domain"        tooltipKey="Free_Domain" />
        <BoolBadge value={sender.GreyListed}        label="GreyListed"         tooltipKey="GreyListed" />
        <TextBadge score={sender.score} value={sender.Status} label="Status" />
      </div>

      <p className="panel-footnote">
        Checked via {sender.provider ?? "no provider configured"}
      </p>
    </div>
  );
}
