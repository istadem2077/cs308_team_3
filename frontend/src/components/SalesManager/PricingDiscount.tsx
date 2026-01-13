import { useState, useEffect } from 'react';
import {
  Search,
  User,
  LayoutDashboard,
  LogOut,
  TrendingUp,
  DollarSign,
  Edit2,
  Save,
  X,
  FileText,
  RotateCcw,
  Bell,
  Loader2
} from 'lucide-react';
import { salesManagerAPI } from '../../services/managerApi';
import { productsAPI } from '../../services/api'; // Ensure you have this exported

interface PricingDiscountProps {
  onBack: () => void;
  onLogout: () => void; // Added prop
  onNavigate: (tab: string) => void;
}

// Matches your backend Product entity + frontend needs
interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // Renamed from currentPrice to match standard Product interface
  description?: string;
  discountRate?: number; // Add this field if your backend supports persistent discounts
  stockCount: number;
}

export function PricingDiscount({ onBack, onNavigate , onLogout }: PricingDiscountProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Fetch all products
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(products.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (checked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleApplyDiscount = async () => {
    const rate = parseFloat(discountRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      alert('Please enter a valid discount rate between 0 and 100');
      return;
    }

    setApplying(true);
    try {
      // Apply discount to all selected products
      // Note: Backend currently accepts one product at a time.
      // We will loop through selected IDs.
      const promises = Array.from(selectedProducts).map(id =>
          salesManagerAPI.setDiscount(id, rate)
      );

      await Promise.all(promises);

      alert('Discounts applied successfully!');

      // Clear selection and refresh products to show new prices if backend updates them
      setSelectedProducts(new Set());
      setDiscountRate('');
      loadProducts();

    } catch (error) {
      console.error("Failed to apply discounts", error);
      alert('Failed to apply some discounts. Please check console.');
    } finally {
      setApplying(false);
    }
  };

  // Calculate preview discount for a product
  const getPreviewPrice = (product: Product) => {
    const rate = parseFloat(discountRate);

    // If product is selected and we are typing a discount
    if (selectedProducts.has(product.id) && !isNaN(rate) && rate > 0) {
      return {
        rate: rate,
        price: product.price * (1 - rate / 100),
        isPreview: true
      };
    }

    return {
      rate: 0,
      price: product.price,
      isPreview: false
    };
  };

  const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Sidebar - Same as before */}
        <aside className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl">
          {/* ... (Keep sidebar code same as provided file) ... */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg">Sales Manager</h2>
                <p className="text-xs text-gray-400">Sabanci University</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <div className="mb-2">
              <p className="text-xs text-gray-400 px-3 mb-2">NAVIGATION</p>
              <button onClick={() => onNavigate('dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2">
                <LayoutDashboard className="w-5 h-5" /> <span>Dashboard</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg mb-2">
                <DollarSign className="w-5 h-5" /> <span>Pricing & Discount</span>
              </button>
              <button onClick={() => onNavigate('invoices')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2">
                <FileText className="w-5 h-5" /> <span>Invoice Management</span>
              </button>
              <button onClick={() => onNavigate('revenue')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2">
                <TrendingUp className="w-5 h-5" /> <span>Revenue & Profit</span>
              </button>
              <button onClick={() => onNavigate('refunds')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2">
                <RotateCcw className="w-5 h-5" /> <span>Refund Management</span>
              </button>
              <button onClick={() => onNavigate('notifications')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white">
                <Bell className="w-5 h-5" /> <span>Notifications</span>
              </button>
            </div>
          </nav>

          <div className="p-4 border-t border-gray-700">
            <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white">
              <LogOut className="w-5 h-5" /> <span>Exit Dashboard</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200 px-8 py-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div><h1 className="text-gray-900">Pricing & Discount Management</h1></div>
              {/* Search Bar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-80 bg-gray-50"
                  />
                </div>

                {/* Update User Button */}
                <button
                    onClick={onLogout}
                    className="w-11 h-11 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center hover:from-blue-100 hover:to-blue-200 transition-all duration-200"
                    title="Logout"
                >
                  <User className="w-5 h-5 text-blue-700" />
                </button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-8 overflow-y-auto">
            {/* Discount Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="text-gray-900 mb-4">Discount Controls</h3>
              <div className="flex items-end gap-4">
                <div className="flex-1 max-w-md">
                  <label className="block text-sm text-gray-600 mb-2">Discount Rate (%)</label>
                  <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountRate}
                      onChange={e => setDiscountRate(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <button
                    onClick={handleApplyDiscount}
                    disabled={selectedProducts.size === 0 || !discountRate || applying}
                    className={`px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                        selectedProducts.size === 0 || !discountRate || applying
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                    }`}
                >
                  {applying ? <Loader2 className="w-5 h-5 animate-spin"/> : null}
                  Apply Discount to {selectedProducts.size} Product{selectedProducts.size !== 1 ? 's' : ''}
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                  <div className="p-8 text-center text-gray-500">Loading products...</div>
              ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left">
                          <input
                              type="checkbox"
                              checked={selectedProducts.size === products.length && products.length > 0}
                              onChange={e => handleSelectAll(e.target.checked)}
                              className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                        </th>
                        <th className="px-6 py-4 text-left text-sm text-gray-700">Product Name</th>
                        <th className="px-6 py-4 text-left text-sm text-gray-700">Category</th>
                        <th className="px-6 py-4 text-left text-sm text-gray-700">Base Price</th>
                        <th className="px-6 py-4 text-left text-sm text-gray-700">New Price (Preview)</th>
                      </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map(product => {
                        const preview = getPreviewPrice(product);

                        return (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <input
                                    type="checkbox"
                                    checked={selectedProducts.has(product.id)}
                                    onChange={e => handleSelectProduct(product.id, e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                              <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                            {product.category}
                          </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                ${product.price.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium">
                                {preview.isPreview ? (
                                    <span className="text-green-600">
                              ${preview.price.toFixed(2)} (-{preview.rate}%)
                            </span>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                              </td>
                            </tr>
                        );
                      })}
                      </tbody>
                    </table>
                  </div>
              )}
            </div>
          </main>
        </div>
      </div>
  );
}