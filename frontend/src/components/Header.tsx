import { ShoppingCart, Search, Pill } from 'lucide-react';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export function Header({
  cartItemCount,
  onCartClick,
  onSearchChange,
  searchQuery,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-blue-600">Sabanci University Pharmacy</h1>
              <p className="text-gray-600 text-sm">Your health, our priority</p>
            </div>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search medicines, vitamins..."
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={onCartClick}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
