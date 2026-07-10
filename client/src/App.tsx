import { useState } from "react";
import { useEmailChecker } from "./hooks/useEmailChecker";
import { EmailDropzone } from "./components/EmailDropzone";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { ValidationResults } from "./components/ValidationResults";
import { DisclaimerModal } from "./components/DisclaimerModal";
import { InfoIcon } from "./assets/icons";
// @ts-ignore: CSS module import declaration unavailable in this setup
import "./App.css";

/*To do, create vitest files for frontend and test for backend */

export default function App() {
  const { state, checkEmail, reset } = useEmailChecker();
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  return (
    <div className="app">
      <header className="app__header">
        <span className="app__eyebrow">EML / MSG</span>
        <h1 className="app__title">Email Checker</h1>
        <p className="app__subtitle">
          Drop in a raw email file to verify its sender, authentication headers, and content.
        </p>
        <button
          className="disclaimer-btn"
          onClick={() => setDisclaimerOpen(true)}
          aria-haspopup="dialog"
        >
          <InfoIcon/>
          Disclaimer
        </button>
      </header>

      <main className="app__main">
        {state.status === "idle" && (
          <EmailDropzone onFileSelected={checkEmail} />
        )}
        {state.status === "loading" && <LoadingState fileName={state.fileName} />}
        {state.status === "error" && (
          <ErrorState message={state.message} onRetry={reset} />
        )}
        {state.status === "success" && (
          <ValidationResults report={state.report} onReset={reset} />
        )}
      </main>

      <DisclaimerModal
        isOpen={disclaimerOpen}
        onClose={() => setDisclaimerOpen(false)}
      />
    </div>
  );
}
