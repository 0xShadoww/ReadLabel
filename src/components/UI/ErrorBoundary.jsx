import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
    
    this.setState({
      error,
      errorInfo
    })

    // In production, you might want to log this to an error reporting service
    // errorReportingService.log(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-950 text-primary-50 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            {/* Error icon */}
            <div className="text-6xl mb-6">😵</div>
            
            {/* Error message */}
            <h1 className="text-2xl font-bold mb-4">Oops! Something broke</h1>
            <p className="text-primary-300 mb-6">
              The app encountered an unexpected error. Don't worry, your data is safe.
            </p>

            {/* Error details (only in development) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-dark-800 rounded-lg p-4 mb-6 text-left text-sm">
                <details className="cursor-pointer">
                  <summary className="text-danger font-medium mb-2">
                    Error Details (Dev Mode)
                  </summary>
                  <div className="space-y-2 text-primary-400">
                    <div>
                      <strong>Error:</strong> {this.state.error.toString()}
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 text-xs overflow-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="btn-primary w-full"
              >
                Try Again
              </button>
              
              <button
                onClick={this.handleReload}
                className="btn-ghost w-full"
              >
                Reload App
              </button>
            </div>

            {/* Help text */}
            <p className="text-sm text-primary-400 mt-6">
              If the problem persists, try clearing your browser cache or updating the app.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary