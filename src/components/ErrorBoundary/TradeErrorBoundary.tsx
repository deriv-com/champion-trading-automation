import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * TradeErrorBoundary: Error boundary component for catching and displaying trading errors.
 * Inputs: { children: ReactNode, onReset?: () => void } - Child components and optional reset callback
 * Output: JSX.Element - Either error UI or children components
 */
export class TradeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  /**
   * getDerivedStateFromError: Updates component state when an error occurs.
   * Inputs: error: Error - The error that was thrown
   * Output: State - New state object with hasError set to true and the error
   */
  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  /**
   * componentDidCatch: Logs error details when a component error is caught.
   * Inputs:
   *   - error: Error - The error that was thrown
   *   - errorInfo: ErrorInfo - Additional information about the error
   * Output: void - Logs error information to the console
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Trade error caught:', error);
    console.error('Error info:', errorInfo);
  }

  /**
   * handleReset: Resets the error state and triggers the optional onReset callback.
   * Inputs: None
   * Output: void - Resets component state and calls onReset if provided
   */
  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  /**
   * getErrorMessage: Converts technical error messages into user-friendly messages.
   * Inputs: error: Error | null - The error to process
   * Output: string - User-friendly error message based on error content
   */
  private getErrorMessage(error: Error | null): string {
    if (!error) return 'An unknown error occurred';

    // Handle specific error types
    if (error.message.includes('unauthorized')) {
      return 'Your session has expired. Please log in again.';
    }

    if (error.message.includes('network')) {
      return 'Network error occurred. Please check your connection and try again.';
    }

    if (error.message.includes('trading session already exists')) {
      return 'A trading session is already in progress. Please wait for it to complete.';
    }

    // Default error message
    return error.message || 'An error occurred while processing your trade';
  }

  /**
   * render: Renders either the error UI or the children components.
   * Inputs: None
   * Output: JSX.Element - Error alert with retry button or children components
   */
  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px' }}>
          <Alert
            message="Trading Error"
            description={this.getErrorMessage(this.state.error)}
            type="error"
            showIcon
            action={
              <Button
                icon={<ReloadOutlined />}
                onClick={this.handleReset}
                type="primary"
                danger
              >
                Try Again
              </Button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}