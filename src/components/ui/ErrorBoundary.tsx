"use client"

import { Component, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-[400px] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
              <AlertTriangle className="w-16 h-16 text-ksk-red mx-auto mb-4" />
              <h2 className="text-xl font-bold text-ksk-dark mb-2">Something went wrong</h2>
              <p className="text-gray-500 mb-4">
                We apologize for the inconvenience. Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-ksk-gold text-ksk-dark font-semibold rounded-lg hover:bg-amber-400 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
