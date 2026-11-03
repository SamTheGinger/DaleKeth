// Renders a loading indicator or error message in place of `children` while data is unavailable.
export default function LoadState({ isLoading, error, children }) {
  if (isLoading) {
    return (
      <p role="status" className="animate-pulse py-10 text-center font-body text-muted">
        Loading&hellip;
      </p>
    )
  }
  if (error) {
    return (
      <p role="alert" className="py-10 text-center font-body text-text">
        {error.message}{' '}
        <button type="button" onClick={() => window.location.reload()} className="cursor-pointer font-semibold text-accent underline hover:text-muted">
          Try again
        </button>
      </p>
    )
  }
  return children
}
