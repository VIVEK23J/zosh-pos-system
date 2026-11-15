import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6 text-gray-900 dark:text-gray-100 font-sans">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-xl text-center space-y-5">
            <div className="size-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="size-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Something went wrong
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                An unexpected UI rendering error occurred. The application caught it safely to prevent a blank screen.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-left text-[11px] font-mono text-gray-700 dark:text-gray-300 overflow-x-auto max-h-32 border border-gray-200 dark:border-gray-700">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs"
              >
                <RefreshCw className="size-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-xs transition flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700"
              >
                <Home className="size-3.5" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
