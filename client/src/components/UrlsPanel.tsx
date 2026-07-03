import type { UrlScanResult } from "../types/email";
import { truncate } from "../utils/format";

interface UrlsPanelProps {
  urls: UrlScanResult[];
}

export function UrlsPanel({ urls }: UrlsPanelProps) {
  if (urls.length === 0) {
    return (
      <div className="urls-panel">
        <h3 className="panel-heading">Links</h3>
        <p className="panel-empty">No links found in the email body.</p>
      </div>
    );
  }

  return (
    <div className="urls-panel">
      <h3 className="panel-heading">Links ({urls.length})</h3>
      <ul className="urls-panel__list">
        {urls.map((u, i) => {
          const state = u.isSafe === null ? "unknown" : u.isSafe ? "safe" : "unsafe";
          return (
            <li key={i} className={`urls-panel__item urls-panel__item--${state}`}>
              <span className="urls-panel__url" title={u.url}>
                {truncate(u.url, 60)}
              </span>
              <span className="urls-panel__status">
                {state === "unknown" ? "Not checked" : state === "safe" ? "Safe" : "Unsafe"}
                {u.threatTypes.length > 0 && ` — ${u.threatTypes.join(", ")}`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
