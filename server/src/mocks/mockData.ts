export const validationResult = {
  "Address": "herabela44@gmail.com",
  "catch_all": false,
  "Disposable_Domain": false,
  "Role_Based": false,
  "Free_Domain": false,
  "GreyListed": false,
  "Status": "Valid",
  "Diagnosis": "Mailbox exist and active. Safe to send (D28) (D21)",
  "provider":"My Email Verifier ",
  "raw":{}
};

export const mockBody = {
            "text": `Thank  you very much \n\n \n\nFrom: Scott Ramsay <Music2020@hotmail.com> \nSent: 04 June 2026 15:04\nTo: Elaine Sutherland <laine@riverside.co.uk>; 'Amy Inglis' <amy@restaurant.com>\nSubject: Invoice SR 03.06.26\n\n \n\nHey Amy/Elaine, \n\n \n\nIt was great to be back last night to play for you. 🙂 I've attached the invoice for last nights performance. \n\n \n\nMany Thanks\n\nScott\n\n\n","also please find my links - https://www.linkedin.com/in/scott-ramsay-287b43286/ & https://github.com/Rambo9223`,
            "html": null,
            "extractedUrls": [
                "http://schemas.microsoft.com/office/2004/12/omml",
                "http://www.w3.org/TR/REC-html40"
            ]
        };

export const parsedEmail = {
      messageId: '<test-001@example.com>',
      subject: 'Test email - clean sender',
      date: new Date("2025-07-14T10:00:00.000Z"),
      from: { name: 'John Smith', email: 'john.smith@example.com' },
      replyTo: [],
      to: [ { name: 'You', email: 'you@yourdomain.com' } ],
      cc: [],
      bcc: [],
      body: {
        text: 'This is the plain text body of the test email.\n' +
          'It can span multiple lines. \n',
        html: null,
        extractedUrls: []
      },
      attachments: [],
      authentication: {
        spf: {
          result: 'pass',
          domain: 'example.com',
          rawHeader: 'mx.yourdomain.com; spf=pass smtp.mailfrom=example.com; dkim=pass header.d=example.com; dmarc=pass p=reject'
        },
        dkim: [ {
        result: 'pass',
        domain: 'example.com',
        selector: null,
        rawHeader: 'mx.yourdomain.com; spf=pass smtp.mailfrom=example.com; dkim=pass header.d=example.com; dmarc=pass p=reject'
      } ],
        dmarc: {
          result: 'pass',
          policy: 'reject',
          rawHeader: 'mx.yourdomain.com; spf=pass smtp.mailfrom=example.com; dkim=pass header.d=example.com; dmarc=pass p=reject'
        },
        compoundHeader: 'mx.yourdomain.com; spf=pass smtp.mailfrom=example.com; dkim=pass header.d=example.com; dmarc=pass p=reject'
      },
      receivedChain: [],
      rawHeaders: {
        'mime-version': '1.0',
        'message-id': '<test-001@example.com>',
        date: 'Mon, 14 Jul 2025 10:00:00 +0000',
        from: 'John Smith <john.smith@example.com>',
        to: 'You <you@yourdomain.com>',
        subject: 'Test email - clean sender',
        'content-type': 'text/plain; charset="UTF-8"',
        'authentication-results': 'mx.yourdomain.com; spf=pass smtp.mailfrom=example.com; dkim=pass header.d=example.com; dmarc=pass p=reject'
      },
      sourceFormat: 'eml',
      parsedAt: new Date ("2026-07-24T12:09:47.245Z")
    } 


    
export const parsedBadEmail = {
      messageId: '<test-001@example.com>',
      subject: 'Test email - clean sender',
      date: new Date("2025-07-14T10:00:00.000Z"),
      from: { name: 'John Smith', email: 'john.smith@example.com' },
      replyTo: [{name:"johnnyB",email:"johnnyB@bmail.com"}],
      to: [ { name: 'You', email: 'you@yourdomain.com' } ],
      cc: [],
      bcc: [],
      body: {
        text: 'This is the plain text body of the test email.\n' +
          'It can span multiple lines. \n',
        html: null,
        extractedUrls: []
      },
      attachments: [],
      authentication: {
        spf: {
          result: 'fail',
          domain: 'example.com',
          rawHeader: null
        },
        dkim: [],
        dmarc: {
          result: 'fail',
          policy: 'reject',
          rawHeader: null
        },
        compoundHeader: null
      },
      receivedChain: [],
      rawHeaders: {
        'mime-version': '1.0',
        'message-id': '<test-001@example.com>',
        date: 'Mon, 14 Jul 2025 10:00:00 +0000',
        from: 'John Smith <john.smith@example.com>',
        to: 'You <you@yourdomain.com>',
        subject: 'Test email - clean sender',
        'content-type': 'text/plain; charset="UTF-8"',
        'authentication-results': 'mx.yourdomain.com; spf=pass smtp.mailfrom=example.com; dkim=pass header.d=example.com; dmarc=pass p=reject'
      },
      sourceFormat: 'eml',
      parsedAt: new Date ("2026-07-24T12:09:47.245Z")
    }