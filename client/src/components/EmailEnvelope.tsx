import type { ParsedEmailTransport } from "../types/email";
import { formatDate, formatBytes } from "../utils/format";

interface EmailEnvelopeProps {
  email: ParsedEmailTransport;
}

function addressLine(addr: { name: string | null; email: string } | null): string {
  if (!addr) return "—";
  return addr.name ? `${addr.name} <${addr.email}>` : addr.email;
}

function addressListLine(addrs: Array<{ name: string | null; email: string }>): string {
  if (addrs.length === 0) return "—";
  return addrs.map(addressLine).join(", ");
}

export function EmailEnvelope({ email }: EmailEnvelopeProps) {
  return (
    <div className="envelope">
      <h3 className="panel-heading">Envelope</h3>
      <dl className="envelope__grid">
        <dt>Subject</dt>
        <dd>{email.subject ?? "(no subject)"}</dd>

        <dt>From</dt>
        <dd>{addressLine(email.from)}</dd>

        <dt>To</dt>
        <dd>{addressListLine(email.to)}</dd>

        {email.cc.length > 0 && (
          <>
            <dt>Cc</dt>
            <dd>{addressListLine(email.cc)}</dd>
          </>
        )}

        {email.replyTo.length > 0 && (
          <>
            <dt>Reply-To</dt>
            <dd>{addressListLine(email.replyTo)}</dd>
          </>
        )}

        <dt>Date</dt>
        <dd>{formatDate(email.date)}</dd>

        <dt>Message ID</dt>
        <dd className="envelope__mono">{email.messageId ?? "—"}</dd>

        <dt>Source format</dt>
        <dd className="envelope__badge">{email.sourceFormat.toUpperCase()}</dd>
      </dl>

      {email.attachments.length > 0 && (
        <div className="envelope__attachments">
          <h4 className="panel-subheading">Attachments ({email.attachments.length})</h4>
          <ul>
            {email.attachments.map((a, i) => (
              <li key={i}>
                <span>{a.filename ?? "(unnamed)"}</span>
                <span className="envelope__attachment-meta">
                  {a.contentType} · {formatBytes(a.size)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
