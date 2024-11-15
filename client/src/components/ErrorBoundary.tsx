import React from 'react';
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorCount: number;
}

const MAX_RETRY_COUNT = 3;
const ERROR_RESET_TIMEOUT = 5000; // 5 seconds

export class ErrorBoundary extends React.Component<Props, State> {
  private resetTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call error callback if provided
    this.props.onError?.(error, errorInfo);

    // Update state with error details
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Auto-retry after timeout if under max retry count
    if (this.state.errorCount < MAX_RETRY_COUNT) {
      this.resetTimeout = setTimeout(() => {
        this.resetError();
      }, ERROR_RESET_TIMEOUT);
    }
  }

  componentWillUnmount() {
    // Clean up timeout on unmount
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
  }

  resetError = () => {
    this.props.onReset?.();
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorCount } = this.state;
      const canRetry = errorCount < MAX_RETRY_COUNT;

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full mx-auto p-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-destructive">
                Something went wrong
              </h2>
              <div className="text-muted-foreground space-y-2">
                <p>{error?.message || 'An unexpected error occurred'}</p>
                {errorCount > 1 && (
                  <p className="text-sm">
                    Error occurred {errorCount} times
                  </p>
                )}
              </div>
              
              {import.meta.env.DEV && error?.stack && (
                <pre className="mt-4 p-4 bg-muted rounded-lg text-left overflow-auto text-sm">
                  {error.stack}
                </pre>
              )}

              <div className="flex gap-4 justify-center mt-6">
                <Button
                  onClick={this.resetError}
                  disabled={!canRetry}
                  variant={canRetry ? "default" : "secondary"}
                >
                  {canRetry ? 'Try Again' : 'Max Retries Reached'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
              </div>

              {!canRetry && (
                <p className="text-sm text-muted-foreground mt-4">
                  Please reload the page or try again later
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
