export const senderValidationInfo = {
  isFormatValid:
    "A valid email address follows the standard structure of local-part@domain.com. It is made up of a prefix/username (before the @ symbol), the @ symbol, and a domain name (after the @ symbol).",
  catch_all:
    "A catch-all domain (or accept-all domain) is an email server configuration that accepts all incoming messages sent to any address under that domain name, even if the specific username does not exist. Instead of bouncing, emails sent to mistyped or made-up addresses are routed to a designated central inbox.",
  Disposable_Domain:
    "A disposable email domain is associated with a temporary, 'burner' email address used for short-term tasks. It allows you to bypass account verifications or download gated content without exposing your primary email to future spam or marketing databases. Once your session or timer ends, the address permanently deletes.",
  Role_Based:
    "A role-based email is a generic address tied to a specific job function or department rather than a specific person. Examples include sales@, support@, and info@. These accounts are typically monitored by multiple people or routed to an internal ticketing system to ensure continuity when staff change roles.",
  Free_Domain:
    "A free email domain is the part of an email address after the @ symbol (e.g., @gmail.com) that you can use without paying for hosting or registration. Free domains are provided by major webmail services to let you easily create an account.",
  GreyListed:
    "A greylisted email is a message that a receiving server temporarily rejects. The server asks the sending server to try again later. This acts as an anti-spam technique, since legitimate senders will retry delivery, while automated spam systems often give up.",
} as const;
