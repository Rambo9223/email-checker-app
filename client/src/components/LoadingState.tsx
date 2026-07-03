interface LoadingStateProps {
  fileName: string;
}

export function LoadingState({ fileName }: LoadingStateProps) {
  return (
    <div className="loading-state">
      <div className="loading-state__spinner" aria-hidden="true" />
      <p className="loading-state__text">
        Checking <span className="loading-state__filename">{fileName}</span>…
      </p>
    </div>
  );
}
