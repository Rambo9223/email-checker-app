import type { ValidationCheck } from "../types/email";
import { CheckItem } from "./CheckItem";

interface AuthPanelProps {
  checks: ValidationCheck[];
}

export function AuthPanel({ checks }: AuthPanelProps) {
  return (
    <div className="auth-panel">
      <h3 className="panel-heading">Authentication</h3>
      <div className="auth-panel__list">
        {checks.map((c, i) => (
          <CheckItem key={i} label={c.name} status={c.status} detail={c.detail} />
        ))}
      </div>
    </div>
  );
}
