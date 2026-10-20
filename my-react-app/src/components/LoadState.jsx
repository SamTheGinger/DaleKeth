// What a section shows while its data is on the way from the server, or if loading it failed.
//
// Props:
//   isLoading  true while waiting for the server.
//   error      the error, if loading failed (otherwise null).
//   children   what to show once the data has arrived.
function LoadState({ isLoading, error, children }) {
  if (isLoading) {
    // role="status" lets screen readers announce it. animate-pulse gently fades the text in and out.
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
        {/* Reloading the page asks the server again. */}
        <button type="button" onClick={() => window.location.reload()} className="cursor-pointer font-semibold text-accent underline hover:text-muted">
          Try again
        </button>
      </p>
    )
  }
  return children
}

export default LoadState // Lets other files load this with: import LoadState from './LoadState.jsx'
