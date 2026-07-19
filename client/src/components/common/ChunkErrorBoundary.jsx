import { Component } from "react";

/**
 * Catches errors from lazy-loaded routes - most commonly a dynamically
 * imported chunk failing to fetch (dev server restarted, or a stale tab
 * open from before a new deploy). Without this, that failure is an
 * uncaught exception that blanks the page with no explanation.
 */
class ChunkErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-chadi-cream px-6 text-center">
          <p className="text-xl font-bold text-chadi-green">
            Something didn't load correctly
          </p>
          <p className="max-w-sm text-gray-600">
            This can happen after an update, or if the connection dropped
            briefly. Reloading the page usually fixes it.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white hover:bg-chadi-gold hover:text-black"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChunkErrorBoundary;
