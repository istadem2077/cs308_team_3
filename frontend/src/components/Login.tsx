import { useState } from 'react';
import { Pill, Mail, Lock, Loader2, Settings, TrendingUp } from 'lucide-react';
import { authService, LoginCredentials } from '../services/auth';

interface LoginProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
  onSkip: () => void;
  onProductManager?: () => void;
  onSalesManager?: () => void;
}

export function Login({ onLoginSuccess, onSwitchToRegister, onSkip, onProductManager, onSalesManager }: LoginProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.login(credentials);
      onLoginSuccess();
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4 relative">
      {/* Management Access Buttons - Fixed Position */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
        <button
          onClick={(e) => {
            e.preventDefault();
            onProductManager?.();
          }}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 shadow-lg"
        >
          <Settings className="w-5 h-5" />
          <span className="whitespace-nowrap">Proceed as Product Manager</span>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            onSalesManager?.();
          }}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 shadow-lg"
        >
          <TrendingUp className="w-5 h-5" />
          <span className="whitespace-nowrap">Proceed as Sales Manager</span>
        </button>
      </div>
      
      {/* Main Login Card */}
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Pill className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to Sabanci University Pharmacy</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={credentials.email}
                onChange={e =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="student@sabanciuniv.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                value={credentials.password}
                onChange={e =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-700"
            >
              Register here
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onSkip}
            className="text-gray-600 hover:text-gray-900 text-sm underline"
          >
            Proceed without signing in
          </button>
        </div>
      </div>
    </div>
  );
}