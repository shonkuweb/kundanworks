import React from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      // Clear corrupt cache
      localStorage.removeItem('kundan_products');
      localStorage.removeItem('kundan_categories');
      localStorage.removeItem('kundan_cart');
      localStorage.removeItem('kundan_orders');
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#EAE0D4] p-6 sm:p-8 text-center shadow-lg space-y-4">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
              <AlertTriangle className="w-7 h-7 stroke-[2]" />
            </div>
            
            <h2 className="font-serif text-xl sm:text-2xl text-[#221B16] font-medium">
              Something went wrong
            </h2>
            
            <p className="text-xs text-neutral-600 leading-relaxed">
              We encountered a display issue while loading your boutique experience.
            </p>

            {this.state.error && (
              <div className="p-3 bg-neutral-50 rounded-lg text-left text-[11px] font-mono text-rose-700 overflow-x-auto max-h-32 border border-neutral-200">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="py-2.5 px-5 bg-[#1E1A17] hover:bg-[#342D28] text-white rounded-xl text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleReset}
                className="py-2.5 px-4 bg-white border border-[#D7BEA8] hover:bg-[#F7F2EB] text-[#221B16] rounded-xl text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Cache & Reset</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
