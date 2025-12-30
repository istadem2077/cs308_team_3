import { useState } from 'react';
import {
  Search,
  User,
  LayoutDashboard,
  Package,
  LogOut,
  FolderTree,
  ShoppingBag,
  Warehouse,
  Plus,
  Minus,
  TrendingUp,
  AlertTriangle,
  Truck,
} from 'lucide-react';
import { Product } from '../../services/api';

interface PstockProps {
  products: Product[];
  onBack: () => void;
  onNavigate: (tab: string) => void;
  onUpdateProduct: (id: string, product: Product) => void;
}

export function Pstock({ products, onBack, onNavigate, onUpdateProduct }: PstockProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(
    product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStockChange = (product: Product, change: number) => {
    const newStock = Math.max(0, product.stockCount + change);
    onUpdateProduct(product.id, {
      ...product,
      stockCount: newStock,
    });
  };

  const getStatusBadge = (stockCount: number) => {
    if (stockCount === 0) {
      return (
        <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
          Out of Stock
        </span>
      );
    } else if (stockCount <= 10) {
      return (
        <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
          Low Stock
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
          In Stock
        </span>
      );
    }
  };

  const totalStock = products.reduce((sum, p) => sum + p.stockCount, 0);
  const lowStockCount = products.filter(p => p.stockCount > 0 && p.stockCount <= 10).length;
  const outOfStockCount = products.filter(p => p.stockCount === 0).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg">Product Manager</h2>
              <p className="text-xs text-gray-400">Sabanci University</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="mb-2">
            <p className="text-xs text-gray-400 px-3 mb-2">NAVIGATION</p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => onNavigate('categories')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <FolderTree className="w-5 h-5" />
              <span>Categories</span>
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Products</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg">
              <Warehouse className="w-5 h-5" />
              <span>Stock Management</span>
            </button>
            <button
              onClick={() => onNavigate('orders')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white"
            >
              <Truck className="w-5 h-5" />
              <span>Deliveries & Orders</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            <span>Exit Dashboard</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-1">Stock Management</h1>
              <p className="text-gray-500 text-sm">Manage product inventory levels</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 bg-gray-50"
                />
              </div>

              <button className="w-11 h-11 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
                <User className="w-5 h-5 text-blue-700" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Warehouse className="w-5 h-5" />
                </div>
                <p className="text-sm text-blue-100">Total Stock</p>
              </div>
              <p className="text-3xl mb-1">{totalStock}</p>
              <p className="text-xs text-blue-200">Items in inventory</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <p className="text-sm text-yellow-100">Low Stock</p>
              </div>
              <p className="text-3xl mb-1">{lowStockCount}</p>
              <p className="text-xs text-yellow-200">Products need restocking</p>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-700 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <p className="text-sm text-red-100">Out of Stock</p>
              </div>
              <p className="text-3xl mb-1">{outOfStockCount}</p>
              <p className="text-xs text-red-200">Immediate attention needed</p>
            </div>
          </div>

          {/* Stock Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Warehouse className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-gray-900">Stock Management</h3>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{product.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">{product.stockCount}</span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(product.stockCount)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStockChange(product, -1)}
                            disabled={product.stockCount === 0}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <input
                            type="number"
                            value={product.stockCount}
                            onChange={e => {
                              const newValue = parseInt(e.target.value) || 0;
                              onUpdateProduct(product.id, {
                                ...product,
                                stockCount: Math.max(0, newValue),
                              });
                            }}
                            className="w-20 px-3 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => handleStockChange(product, 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Warehouse className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No products found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}