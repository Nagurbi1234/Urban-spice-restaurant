export function LoadingBlock({ label = "Setting the table…" }) {
  return (
    <div className="loading-block" data-testid="loading-state">
      <div className="loading-bar" style={{ width: "33%" }} />
      <div className="loading-bar" style={{ width: "66%", marginTop: 16 }} />
      <p style={{ marginTop: 24, fontSize: 14, color: "var(--color-text-mid)" }}>{label}</p>
    </div>
  );
}

export function ErrorBlock({ onRetry }) {
  return (
    <div className="error-block" data-testid="error-state">
      <p className="font-display" style={{ fontSize: 24, color: "var(--color-error-text)" }}>
        The kitchen is taking a moment.
      </p>
      <p style={{ marginTop: 8, fontSize: 14, color: "var(--color-error-text-2)" }}>
        We couldn’t bring this part of the table through.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="link-arrow underline"
          style={{ marginTop: 20, textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 12 }}
          data-testid="button-retry"
        >
          Try again
        </button>
      )}
    </div>
  );
}
