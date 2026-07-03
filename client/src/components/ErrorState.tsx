interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <p className="error-state__text">{message}</p>
      <button className="error-state__retry-btn" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
