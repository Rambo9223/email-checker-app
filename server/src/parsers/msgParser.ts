import MsgReader from "@kenjiuno/msgreader";
import { ParsedEmail, EmailAddress, AuthenticationResults } from "../types/email";
import { extractUrls } from "../utils/extractUrls";


// page not filling out all forms like emlparser

// MSG files don't carry authentication headers — we return safe defaults
const emptyAuth: AuthenticationResults = {
  spf: { result: "unknown", domain: null, rawHeader: null },
  dkim: [],
  dmarc: { result: "unknown", policy: null, rawHeader: null },
  compoundHeader: null,
};

function toAddr(name?: string, email?: string): EmailAddress | null {
  if (!email) return null;
  return { name: name ?? null, email };
}

export async function parseMsg(buffer: Buffer): Promise<ParsedEmail> {
  //console.log(buffer)
  // MsgReader's types declare ArrayBuffer | DataView, not Buffer.
  // buffer.buffer is typed as ArrayBuffer | SharedArrayBuffer (ArrayBufferLike)
  // because TypeScript can't narrow Uint8Array.buffer further — but Node's
  // Buffer.from() always backs with a plain ArrayBuffer, never SharedArrayBuffer,
  // so the cast is safe. We still slice to isolate our bytes from any pool allocation.
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
  const reader = new MsgReader(arrayBuffer);
  //console.log(reader);
  const fileData = reader.getFileData();
  

  // check the filedata object as key/value pairs are potentially different, hence creating the un retrevable body

  if (!fileData) {
    throw new Error("Failed to parse .msg file: getFileData() returned null");
  }

  function toBuffer(content: string | ArrayBuffer | Uint8Array): Buffer {
  if (typeof content === "string") return Buffer.from(content, "base64");
  return Buffer.from(new Uint8Array(content));
}

  function toDecoder(content:Uint8Array<ArrayBufferLike>|string|null|undefined){
    
    
    if(content===undefined||content===null||typeof(content)==="string"){
      return "unavalable"
    }
    else{
    const decoder = new TextDecoder()
    const str = decoder.decode(content,{stream:true})
    //console.log(str);
    //console.log(typeof(str));
    return str
    }
  }

  const from = toAddr(fileData.senderName, fileData.senderEmail);

  // Recipients are typed: recipType 1 = To, 2 = CC, 3 = BCC
  const recipients = fileData.recipients ?? [];
  const to: EmailAddress[] = recipients
    .filter((r) => r.recipType === "to")
    .flatMap((r) => (r.email ? [{ name: r.name ?? null, email: r.email }] : []));
  const cc: EmailAddress[] = recipients
    .filter((r) => r.recipType === "cc")
    .flatMap((r) => (r.email ? [{ name: r.name ?? null, email: r.email }] : []));
  const bcc: EmailAddress[] = recipients
    .filter((r) => r.recipType === "bcc")
    .flatMap((r) => (r.email ? [{ name: r.name ?? null, email: r.email }] : []));

  const bodyText = fileData.body ?? null;
  const bodyHtml = toDecoder(fileData.html);
  const combinedText = [bodyText ?? "", bodyHtml ?? ""].join(" ");

  const attachments = (fileData.attachments ?? []).map((a) => {
    // FieldsData uses `body` (Uint8Array | undefined) for raw bytes and
    // `attachMimeTag` for the MIME type — not `content` / `mimeType`.
    const raw = a.body;
    const content = raw ? /*Buffer.from(new Uint8Array(raw)) */ toBuffer(raw): Buffer.alloc(0);
    //console.log(content);
    return {
      filename: a.fileName ?? null,
      contentType: a.attachMimeTag ?? "application/octet-stream",
      size: a.contentLength || "unavailable",
      contentId: String(a.dataId) || null,
      contentDisposition: "attachment",
      content,
      contentBase64: content.toString("base64"),
    };
  });

  // MSG stores the send date as a JS Date or string depending on library version
  let date: Date | null = null;
  if (fileData.messageDeliveryTime) {
    const d = new Date(fileData.messageDeliveryTime);
    if (!isNaN(d.getTime())) date = d;
  }

  return {
    messageId: fileData. messageId ?? null,
    subject: fileData.subject ?? null,
    date,

    from,
    replyTo: [],
    to,
    cc,
    bcc,

    body: {
      text: bodyText,
      html: bodyHtml,
      extractedUrls: extractUrls(combinedText),
    },

    attachments,
    authentication: emptyAuth,
    receivedChain: [],
    rawHeaders: {},

    sourceFormat: "msg",
    parsedAt: new Date(),
  };
}