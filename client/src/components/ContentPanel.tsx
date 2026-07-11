import type { ContentValidationResult } from "../types/email";

interface ContentPanelProps {
  content: ContentValidationResult | null;
}

export function ContentPanel({ content }: ContentPanelProps) {
  //console.log(content);
  if (!content) {
    return (
      <div className="content-panel">
        <h3 className="panel-heading">Content</h3>
        <p className="panel-empty">Content scan unavailable or no body text found.</p>
      </div>
    );
  }

  const status = content.isSpam ? "fail" : "pass";

  return (
    <div className="content-panel">
      <h3 className="panel-heading">Content</h3>

      <div className={`content-panel__score content-panel__score--${status}`}>
        <span className="content-panel__score-value">{content.spamScore ?? "—"}</span>
        <span className="content-panel__score-threshold">
          / {content.spamThreshold?.toFixed(1) ?? "—"} threshold
        </span>
      </div>

      <p className="content-panel__verdict">
        {content.isSpam ? "Flagged as likely spam" : "Not flagged as spam"}
      </p>

      {content.rules.length > 0 && (
        <details className="content-panel__rules">
          <summary>{content.rules.length} rule{content.rules.length === 1 ? "" : "s"} triggered</summary>
          <ul>
            {content.rules.map((r, i) => (
              <li key={i}>
                <span className="content-panel__rule-name">{r.name}</span>
                <span className="content-panel__rule-score">+{r.score}</span>
                <span className="content-panel__rule-desc">{r.description}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <p className="panel-footnote">Checked via {content.provider ?? "no provider configured"}</p>
    </div>
  );
}
