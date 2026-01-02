import { useState } from 'react';
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
} from 'lucide-react';

interface PricingDiscountProps {
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

interface Product {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  discountPercent: number;
  newPrice: number;
}

export function PricingDiscount({ onBack, onNavigate }: PricingDiscountProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Paracetamol 500mg',
      category: 'pain relief',
      currentPrice: 45.0,
      discountPercent: 0,
      newPrice: 45.0,
    },
    {
      id: '2',
      name: 'Ibuprofen 400mg',
      category: 'pain relief',
      currentPrice: 55.0,
      discountPercent: 0,
      newPrice: 55.0,
    },
    {
      id: '3',
      name: 'Vitamin D3 1000 IU',
      category: 'vitamins',
      currentPrice: 120.0,
      discountPercent: 0,
      newPrice: 120.0,
    },
    {
      id: '4',
      name: 'Multivitamin Complex',
      category: 'vitamins',
      currentPrice: 180.0,
      discountPercent: 0,
      newPrice: 180.0,
    },
    {
      id: '5',
      name: 'Antibiotic Amoxicillin',
      category: 'prescription',
      currentPrice: 250.0,
      discountPercent: 0,
      newPrice: 250.0,
    },
    {
      id: '6',
      name: 'Allergy Relief Tablets',
      category: 'allergies',
      currentPrice: 35.0,
      discountPercent: 0,
      newPrice: 35.0,
    },
    {
      id: '7',
      name: 'Face Masks (50 pack)',
      category: 'protection',
      currentPrice: 25.0,
      discountPercent: 0,
      newPrice: 25.0,
    },
    {
      id: '8',
      name: 'Hand Sanitizer 500ml',
      category: 'hygiene',
      currentPrice: 15.0,
      discountPercent: 0,
      newPrice: 15.0,
    },
  ]);

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

  const handleApplyDiscount = () => {
    const discount = parseFloat(discountRate);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      alert('Please enter a valid discount rate between 0 and 100');
      return;
    }

    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (selectedProducts.has(product.id)) {
          const newPrice = product.currentPrice * (1 - discount / 100);
          return {
            ...product,
            discountPercent: discount,
            newPrice: newPrice,
          };
        }
        return product;
      })
    );

    // Clear selection after applying
    setSelectedProducts(new Set());
    setDiscountRate('');
  };

  // Calculate preview discount for a product
  const getPreviewDiscount = (productId: string, product: Product) => {
    const discount = parseFloat(discountRate);
    
    // If product is selected and discount is valid, show preview
    if (selectedProducts.has(productId) && !isNaN(discount) && discount > 0 && discount <= 100) {
      return {
        discountPercent: discount,
        newPrice: product.currentPrice * (1 - discount / 100),
        isPreview: true,
      };
    }
    
    // Otherwise show saved discount if any
    if (product.discountPercent > 0) {
      return {
        discountPercent: product.discountPercent,
        newPrice: product.newPrice,
        isPreview: false,
      };
    }
    
    return null;
  };

  const handleEditProduct = (productId: string, currentPrice: number) => {
    setEditingProduct(productId);
    setEditPrice(currentPrice.toString());
  };

  const handleSaveEdit = (productId: string) => {
    const newPrice = parseFloat(editPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      alert('Please enter a valid price');
      return;
    }

    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            currentPrice: newPrice,
            newPrice: product.discountPercent > 0 
              ? newPrice * (1 - product.discountPercent / 100)
              : newPrice,
          };
        }
        return product;
      })
    );

    setEditingProduct(null);
    setEditPrice('');
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditPrice('');
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl">
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
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg mb-2">
              <DollarSign className="w-5 h-5" />
              <span>Pricing & Discount</span>
            </button>
            <button
              onClick={() => onNavigate('invoices')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <FileText className="w-5 h-5" />
              <span>Invoice Management</span>
            </button>
            <button
              onClick={() => onNavigate('revenue')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Revenue & Profit</span>
            </button>
            <button
              onClick={() => onNavigate('refunds')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Refund Management</span>
            </button>
            <button
              onClick={() => onNavigate('notifications')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white"
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
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
              <h1 className="text-gray-900">Pricing & Discount Management</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-80 bg-gray-50"
                />
              </div>

              <button className="w-11 h-11 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center hover:from-green-100 hover:to-green-200 transition-all duration-200">
                <User className="w-5 h-5 text-green-700" />
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
                <label className="block text-sm text-gray-600 mb-2">
                  Discount Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={discountRate}
                  onChange={e => setDiscountRate(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={handleApplyDiscount}
                disabled={selectedProducts.size === 0 || !discountRate}
                className={`px-6 py-2.5 rounded-xl transition-all duration-200 ${
                  selectedProducts.size === 0 || !discountRate
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                }`}
              >
                Apply Discount to {selectedProducts.size} Product{selectedProducts.size !== 1 ? 's' : ''}
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Product Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Current Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Discount %
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      New Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map(product => {
                    const previewDiscount = getPreviewDiscount(product.id, product);
                    
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
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {editingProduct === product.id ? (
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editPrice}
                              onChange={e => setEditPrice(e.target.value)}
                              className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                              autoFocus
                            />
                          ) : (
                            `$${product.currentPrice.toFixed(2)}`
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {previewDiscount ? (
                            <span className={previewDiscount.isPreview ? 'text-orange-600' : 'text-gray-600'}>
                              {previewDiscount.discountPercent.toFixed(0)}%
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {previewDiscount ? (
                            <span className={previewDiscount.isPreview ? 'text-orange-600' : 'text-gray-900'}>
                              ${previewDiscount.newPrice.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingProduct === product.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSaveEdit(product.id)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Save"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditProduct(product.id, product.currentPrice)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Price"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}