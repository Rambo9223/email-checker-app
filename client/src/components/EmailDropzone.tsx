import { useCallback, useRef, useState } from "react";

interface EmailDropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

const ACCEPTED_EXTENSIONS = [".eml", ".msg"];

function isAcceptedFile(file: File): boolean {
  const lower = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function EmailDropzone({ onFileSelected, disabled }: EmailDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const file = fileList[0];

      if (!isAcceptedFile(file)) {
        setRejectionMessage(`"${file.name}" isn't a .eml or .msg file`);
        return;
      }

      setRejectionMessage(null);
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles]
  );

  return (
    <div className="dropzone-wrapper">
      <div
        className={[
          "dropzone",
          isDragging ? "dropzone--active" : "",
          disabled ? "dropzone--disabled" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".eml,.msg"
          className="dropzone__input"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
        />

        <svg
          className="dropzone__icon"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="6" y="10" width="36" height="28" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M6 12L24 26L42 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <p className="dropzone__title">
          {isDragging ? "Drop the file" : "Drop an .eml or .msg file here"}
        </p>
        <p className="dropzone__subtitle">or click to browse — max 25 MB</p>
      </div>

      {rejectionMessage && (
        <p className="dropzone__error" role="alert">
          {rejectionMessage}
        </p>
      )}
    </div>
  );
}
