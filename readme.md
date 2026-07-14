<a name="readme-top"></a>

<br />
<div align="center">

<h3 align="center">Email Checker</h3>

<p align="center">
  A diagnostic tool for examining the credibility and quality of raw email files
</p>

</div>

---

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#validation-pipeline">Validation Pipeline</a></li>
    <li><a href="#testing">Testing</a></li>
    <li><a href="#future-changes">Future Changes</a></li>
    <li><a href="#disclaimer">Disclaimer</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

---

<!-- ABOUT THE PROJECT -->
## About The Project

Email Checker is a local diagnostic tool that allows you to upload a raw email file and receive a structured report on its sender, authentication headers, content, and embedded links.

The app accepts `.eml` and `.msg` file formats and processes them through a local Express server before running a series of validation checks against external APIs. Results are presented in a clear, panel-based interface that surfaces pass, warning, and failure states across each area of the email.

The project was built as a practical utility for anyone who regularly receives emails and wants a deeper look at their technical properties — particularly useful for identifying emails that may be attempting to appear more legitimate than they are.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![React][React.js]][React-url]
* [![TypeScript][TypeScript.com]][TypeScript-url]
* [![Vite][Vite.com]][Vite-url]
* [![Express.js][Express.js.com]][Express.js-url]
* [![Node.js][Node.js.com]][Node.js-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- GETTING STARTED -->
## Getting Started

The project is split into two directories — `server` and `frontend`. Both must be running simultaneously for the app to function.

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [VSCode](https://code.visualstudio.com/) or your preferred editor

### Installation

1. Download or clone the repository and navigate to the project root in your terminal.

2. **Start the server**

   ```bash
   cd server
   npm install
   cp .env.example .env
   npm run dev
   ```

   The server will start on `http://localhost:3001`. Open `.env` to add any optional API keys for extended validation features.

3. **Start the frontend** (in a second terminal)

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- USAGE -->
## Usage

Once both the server and frontend are running, open `http://localhost:5173` in your browser.

**Uploading a file**

Drag and drop an `.eml` or `.msg` file on to the upload area, or click it to open a file browser. Files up to 25 MB are accepted. Any other file type will be rejected with an error message.

**Reading the results**

Once processed, the report is divided into the following panels:

- **Summary** — an overall pass, warning, or fail status with a count of each across all checks
- **Envelope** — the parsed sender, recipients, subject, date, message ID, and any attachments
- **Authentication** — SPF, DKIM, and DMARC results extracted from the email headers, plus a Reply-To domain mismatch check
- **Sender** — a credibility breakdown of the sender address including format validity, domain checks, disposable domain detection, catch-all status, role-based address detection, and a calculated quality score
- **Content** — a spam score generated against the email body with any triggered spam rules listed
- **Links** — all URLs extracted from the email body, each assessed for known threats

Hovering the question mark icon on any sender check displays a tooltip explaining what that check means.

**Disclaimer**

Click the **Disclaimer** button in the header at any time to read important information about the limitations of the tool and the scope of the developer's liability.

**Checking another email**

Click **Check another email** at the top of the results to return to the upload screen.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- VALIDATION PIPELINE -->
## Validation Pipeline

When a file is uploaded the following process runs:

```
Upload (.eml / .msg)
       │
       ├─ emlParser     →  postal-mime        →  ParsedEmail
       └─ msgParser     →  @kenjiuno/msgreader
              │
              ├─ headerValidator    (SPF / DKIM / DMARC — no API key required)
              ├─ senderValidator    (my-email-verifier API + custom score generator)
              ├─ contentValidator   (Postmark SpamCheck — free, no key required)
              └─ urlValidator       (Google Safe Browsing — optional API key)
                        │
                        └─► ValidationReport (JSON) → Frontend
```

**API keys** are optional — the app degrades gracefully without them. Header authentication checks and Postmark spam scoring work out of the box. Add keys to `server/.env` to enable sender validation and URL threat scanning.

| Provider | Purpose | Key Required |
|---|---|---|
| Header parsing (built-in) | SPF / DKIM / DMARC | ❌ |
| Postmark SpamCheck | Content spam score | ❌ |
| my-email-verifier | Sender address validation | ✅ `EMAIL_VERIFIER_KEY` |
| Google Safe Browsing | URL threat scanning | ✅ `GOOGLE_SAFE_BROWSING_KEY` |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- TESTING -->
## Testing

Tests are located in `frontend/src/__tests__/`. Fixture `.eml` and `.msg` files used in tests can be found in `frontend/src/__tests__/fixtures/`.

To run the frontend test suite, open a terminal in the `frontend` directory and run:

```bash
npm run test
```

Tests are written using **Vitest** and **React Testing Library**. Fixture files are imported using Vite's `?raw` suffix, requiring no Node.js `fs` or `path` dependencies on the client side.

The current test suite covers:

- Acceptance of valid `.eml` files via the dropzone input
- Acceptance of valid `.msg` files via the dropzone input
- Rejection of invalid file types (e.g. `.txt`)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- FUTURE CHANGES -->
## Future Changes

- Add a history panel so previously checked emails can be reviewed within the same session without re-uploading
- Extend URL scanning to surface more detail on flagged links, including redirect chain analysis
- Add attachment scanning to flag potentially dangerous file types embedded in emails
- Introduce a shareable report export so results can be saved or sent to others
- Explore a browser extension version that can scan emails directly from a webmail client

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- DISCLAIMER -->
## Disclaimer

Email Checker is a diagnostic aid only. It examines technical properties of an email to provide an informed overview of its characteristics — it is not an infallible security system.

Sophisticated bad actors may use technically legitimate credentials and verified domains to make initial contact before pursuing fraudulent or harmful intentions. A result that appears credible is not a guarantee of safety. Always apply your own judgement and treat any email with suspicion if something feels wrong, regardless of what this tool reports.

The developer accepts no responsibility for any loss, damage, or adverse outcome arising from interaction with any sender, link, attachment, or content found in any email, whether examined using this tool or not. Use of this application is entirely at your own risk.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- CONTRIBUTING -->
## Contributing

Contributions are welcome and greatly appreciated.

If you have a suggestion that would improve the project, please fork the repository and open a pull request, or open an issue with the tag `enhancement`.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- CONTACT -->
## Contact

Scott Ramsay — sct_r_9223@live.co.uk

GitHub: [https://github.com/Rambo9223](https://github.com/Rambo9223)

LinkedIn: [www.linkedin.com/in/scott-ramsay-287b43286](https://www.linkedin.com/in/scott-ramsay-287b43286)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- MARKDOWN LINKS -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript.com]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Vite.com]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[Express.js.com]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[Express.js-url]: https://expressjs.com/
[Node.js.com]: https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node.js-url]: https://nodejs.org/