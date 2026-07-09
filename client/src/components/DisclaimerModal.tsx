import { useEffect, useRef } from "react";

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Trap focus inside modal while open
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop — click outside to close */}
      <div
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
        tabIndex={-1}
      >
        <div className="modal__header">
          <span className="modal__eyebrow">Legal</span>
          <h2 className="modal__title" id="disclaimer-title">Disclaimer</h2>
          <button
            className="modal__close-btn"
            onClick={onClose}
            aria-label="Close disclaimer"
          >
            ✕
          </button>
        </div>

        <div className="modal__body">
          <h3>Purpose of this tool</h3>
          <p>
            Email Checker is a diagnostic aid designed to help you assess the technical
            credibility and surface-level quality of an email. It examines indicators such
            as sender authentication records, domain reputation, and message content to
            provide an informed overview of a given email&rsquo;s characteristics.
          </p>
          <p>
            While the app is capable of flagging emails that display properties commonly
            associated with spam, phishing, or other malicious activity, it is not an
            infallible security system. Sophisticated bad actors may use technically
            legitimate credentials, verified domains, or clean sender addresses to make
            initial contact before pursuing fraudulent or harmful intentions. A result
            that appears credible is not a guarantee of safety.
          </p>

          <h3>Trust your judgement</h3>
          <p>
            You should always apply your own critical judgement when evaluating any
            received communication. If something about an email feels wrong &mdash; the
            request is unusual, the tone is pressuring, or the context doesn&rsquo;t add
            up &mdash; treat it with suspicion regardless of what this tool reports. No
            automated check should override your instinct. Do not rely solely on the
            output of this application to decide whether to respond to, continue contact
            with, or act on any email.
          </p>

          <h3>Limitation of liability</h3>
          <p>
            The developer of this application accepts no responsibility and shall not be
            held liable for any loss, damage, harm, or other adverse outcome &mdash;
            financial, personal, reputational, or otherwise &mdash; arising from your
            interaction with any sender, link, attachment, or content found within any
            email, whether that email was examined using this tool or not. Use of this
            application is entirely at your own risk.
          </p>
          <p>
            This tool is provided as-is, without warranty of any kind, express or
            implied. Results are advisory only and should be treated as one input among
            many when assessing the legitimacy of any communication.
          </p>
        </div>

        <div className="modal__footer">
          <button className="modal__confirm-btn" onClick={onClose}>
            I understand
          </button>
        </div>
      </div>
    </>
  );
}
