import { X, Lock } from 'lucide-react';

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

export function LoginPrompt({
  isOpen,
  onClose,
  onLogin,
  onRegister,
}: LoginPromptProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Login Required</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600 text-center mb-2">
            Please log in to complete your purchase
          </p>
          <p className="text-gray-500 text-sm text-center">
            You need to be logged in to proceed to checkout. This allows us to save your delivery information and track your orders.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onLogin}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>
          <button
            onClick={onRegister}
            className="w-full px-4 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Create Account
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors text-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
