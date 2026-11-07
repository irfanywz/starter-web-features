import { Component, type ErrorInfo, type ReactNode } from "react";
import Button from "@/components/ui/Button";
import { logger } from "@/features/logs/logger";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error(error.message, error.stack ?? info.componentStack ?? undefined);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          className="mx-auto mt-24 max-w-md space-y-4 rounded-xl border border-red-200 bg-white p-6 text-center dark:border-red-900 dark:bg-slate-900"
        >
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
            Terjadi kesalahan
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{this.state.error.message}</p>
          <Button onClick={this.handleReset}>Coba lagi</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
