import type { ValidationReport } from "../types/email";
import { SummaryBanner } from "./SummaryBanner";
import { EmailEnvelope } from "./EmailEnvelope";
import { AuthPanel } from "./AuthPanel";
import { SenderPanel } from "./SenderPanel";
import { ContentPanel } from "./ContentPanel";
import { UrlsPanel } from "./UrlsPanel";

interface ValidationResultsProps {
  report: ValidationReport;
  onReset: () => void;
}

export function ValidationResults({ report, onReset }: ValidationResultsProps) {
  console.log(report);
  return (
    <div className="results">
      <div className="results__header">
        <SummaryBanner summary={report.summary} />
        <button className="results__reset-btn" onClick={onReset}>
          Check another email
        </button>
      </div>

      <div className="results__grid">
        <div className="results__column results__column--wide">
          <EmailEnvelope email={report.parsedEmail} />
        </div>

        <div className="results__column">
          <AuthPanel checks={report.checks.auth} />
        </div>

        <div className="results__column">
          <SenderPanel sender={report.checks.sender} />
        </div>

        <div className="results__column">
          <ContentPanel content={report.checks.content} />
        </div>

        <div className="results__column results__column--wide">
          <UrlsPanel urls={report.checks.urls} />
        </div>
      </div>
    </div>
  );
}
