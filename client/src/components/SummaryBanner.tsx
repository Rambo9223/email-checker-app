import type { ValidationReport } from "../types/email";
import { STATUS_LABEL } from "../utils/format";

interface SummaryBannerProps {
  summary: ValidationReport["summary"];
}

export function SummaryBanner({ summary }: SummaryBannerProps) {
  return (
    <div className={`summary-banner summary-banner--${summary.overallStatus}`}>
      <div className="summary-banner__status">
        <span className="summary-banner__label">{STATUS_LABEL[summary.overallStatus]}</span>
      </div>
      <div className="summary-banner__counts">
        <span className="summary-banner__count summary-banner__count--pass">
          {summary.passCount} pass
        </span>
        <span className="summary-banner__count summary-banner__count--warn">
          {summary.warnCount} warn
        </span>
        <span className="summary-banner__count summary-banner__count--fail">
          {summary.failCount} fail
        </span>
      </div>
    </div>
  );
}
